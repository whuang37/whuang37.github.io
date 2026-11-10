import { createHash } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

export async function fileHash(filename) {
  return createHash("sha256").update(await fs.readFile(filename)).digest("hex")
}

export async function openAssetCache(directory, signature) {
  const manifestPath = path.join(directory, "manifest.json")
  await fs.mkdir(directory, { recursive: true })
  let previous = {}
  try {
    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"))
    if (manifest.signature === signature) previous = manifest.files
  } catch (error) {
    if (error.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error
  }
  const files = {}

  return {
    async reuse(sourcePath, relativePath) {
      const sourceHash = await fileHash(sourcePath)
      files[relativePath] = { sourceHash }
      const entry = previous[relativePath]
      if (entry?.sourceHash !== sourceHash) return false
      try {
        return entry.outputHash === await fileHash(path.join(directory, relativePath))
      } catch (error) {
        if (error.code !== "ENOENT") throw error
        return false
      }
    },
    async save() {
      for (const relativePath of Object.keys(files)) {
        files[relativePath].outputHash = await fileHash(path.join(directory, relativePath))
      }
      async function prune(folder) {
        for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
          const filename = path.join(folder, entry.name)
          if (entry.isDirectory()) await prune(filename)
          else if (filename !== manifestPath && !Object.hasOwn(files, path.relative(directory, filename))) {
            await fs.unlink(filename)
          }
        }
      }
      await prune(directory)
      await fs.writeFile(manifestPath, JSON.stringify({ signature, files }, null, 2))
    },
  }
}
