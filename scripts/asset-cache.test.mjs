import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { openAssetCache } from "./asset-cache.mjs"

test("reuse requires matching source, output, and settings; deleted outputs are pruned", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "asset-cache-"))
  try {
    const source = path.join(root, "source")
    const directory = path.join(root, "cache")
    const output = path.join(directory, "asset")
    await fs.writeFile(source, "source")
    let cache = await openAssetCache(directory, "settings-1")
    assert.equal(await cache.reuse(source, "asset"), false)
    await fs.writeFile(output, "optimized")
    await cache.save()

    cache = await openAssetCache(directory, "settings-1")
    assert.equal(await cache.reuse(source, "asset"), true)
    await fs.writeFile(source, "changed")
    assert.equal(await cache.reuse(source, "asset"), false)
    await fs.writeFile(source, "source")
    await fs.writeFile(output, "corrupt")
    assert.equal(await cache.reuse(source, "asset"), false)
    await fs.unlink(output)
    assert.equal(await cache.reuse(source, "asset"), false)
    await fs.writeFile(output, "optimized")

    cache = await openAssetCache(directory, "settings-2")
    assert.equal(await cache.reuse(source, "asset"), false)
    cache = await openAssetCache(directory, "settings-1")
    await cache.save()
    await assert.rejects(fs.stat(output), { code: "ENOENT" })
  } finally {
    await fs.rm(root, { recursive: true, force: true })
  }
})
