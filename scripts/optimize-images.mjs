import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceDir = path.join(rootDir, "content/images")
const outputDir = path.join(rootDir, ".tmp/optimized-images")
const maxDimension = 2000

async function imagePaths(directory) {
  const paths = []

  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      paths.push(...await imagePaths(entryPath))
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      paths.push(entryPath)
    }
  }

  return paths
}

await fs.rm(outputDir, { recursive: true, force: true })

let originalBytes = 0
let optimizedBytes = 0
for (const sourcePath of await imagePaths(sourceDir)) {
  const relativePath = path.relative(sourceDir, sourcePath).replace(/\.[^.]+$/, ".webp")
  const outputPath = path.join(outputDir, relativePath)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  const result = await sharp(sourcePath)
    .rotate()
    .resize({ width: maxDimension, height: maxDimension, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toFile(outputPath)

  originalBytes += (await fs.stat(sourcePath)).size
  optimizedBytes += result.size
}

console.log(`✓ Optimized images: ${(originalBytes / 1024 / 1024).toFixed(1)} MB → ${(optimizedBytes / 1024 / 1024).toFixed(1)} MB`)
