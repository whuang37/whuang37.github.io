import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const distDir = path.join(rootDir, "dist")
const indexHtml = path.join(distDir, "index.html")
const routes = JSON.parse(fs.readFileSync(path.join(rootDir, ".tmp/route-paths.json"), "utf8"))

for (const route of routes) {
  if (!/^(photography|publications)(\/[a-z0-9-]+)?$/.test(route)) {
    throw new Error(`Invalid route path: ${route}`)
  }

  const directory = path.join(distDir, route)
  fs.mkdirSync(directory, { recursive: true })
  fs.copyFileSync(indexHtml, path.join(directory, "index.html"))
}

console.log(`✓ Generated ${routes.length} direct-link pages`)
