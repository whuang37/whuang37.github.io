import { execFile } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"

const run = promisify(execFile)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceDir = path.join(rootDir, "content/pdfs/publications")
const outputDir = path.join(rootDir, ".tmp/optimized-pdfs")

async function pageCount(pdfPath) {
  const { stdout } = await run("gs", [
    "-q", "-dNODISPLAY", `--permit-file-read=${pdfPath}`,
    `-sPDFname=${pdfPath}`,
    "-c", "PDFname (r) file runpdfbegin pdfpagecount = quit",
  ], { timeout: 30_000 })
  const count = Number(stdout.trim())
  if (!Number.isInteger(count) || count < 1) throw new Error(`Could not read page count: ${pdfPath}`)
  return count
}

await fs.rm(outputDir, { recursive: true, force: true })
await fs.mkdir(outputDir, { recursive: true })

let originalBytes = 0
let optimizedBytes = 0
for (const filename of (await fs.readdir(sourceDir)).filter((name) => name.endsWith(".pdf"))) {
  const sourcePath = path.join(sourceDir, filename)
  const outputPath = path.join(outputDir, filename)

  try {
    await run("gs", [
      "-q", "-dBATCH", "-dNOPAUSE", "-sDEVICE=pdfwrite",
      "-dPDFSETTINGS=/prepress",
      "-dDetectDuplicateImages=true", "-dCompressFonts=true",
      `-sOutputFile=${outputPath}`, sourcePath,
    ], { timeout: 120_000 })
  } catch (error) {
    if (error.code === "ENOENT") throw new Error("Ghostscript (gs) is required to build the publication PDFs.")
    throw error
  }

  const originalSize = (await fs.stat(sourcePath)).size
  const outputSize = (await fs.stat(outputPath)).size
  if (outputSize === 0) throw new Error(`Ghostscript produced an empty PDF: ${filename}`)
  if (outputSize >= originalSize) await fs.copyFile(sourcePath, outputPath)
  if (await pageCount(sourcePath) !== await pageCount(outputPath)) {
    throw new Error(`Page count changed while optimizing ${filename}`)
  }

  originalBytes += originalSize
  optimizedBytes += Math.min(originalSize, outputSize)
}

console.log(`✓ Optimized PDFs: ${(originalBytes / 1024 / 1024).toFixed(1)} MB → ${(optimizedBytes / 1024 / 1024).toFixed(1)} MB`)
