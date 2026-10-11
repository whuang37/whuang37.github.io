import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const distDir = path.join(rootDir, "dist")
const indexHtml = path.join(distDir, "index.html")
const routes = JSON.parse(fs.readFileSync(path.join(rootDir, ".tmp/route-paths.json"), "utf8"))
const siteUrl = "https://whuang37.github.io"
const homeHtml = fs.readFileSync(indexHtml, "utf8")

function readItems(filename, name) {
  const source = fs.readFileSync(path.join(rootDir, `content/${filename}`), "utf8")
  const match = source.match(new RegExp(`export const ${name}: [^=]+ = (\\[[\\s\\S]*\\])\\s*$`))
  if (!match) throw new Error(`Could not read ${name} from ${filename}`)
  return JSON.parse(match[1])
}

const publications = new Map(readItems("publications.tsx", "publications").map((item) => [item.slug, item]))
const photography = new Map(readItems("photography.tsx", "photography").map((item) => [item.slug, item]))

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

function metadata(route) {
  const [section, slug] = route.split("/")
  if (section === "publications" && slug) {
    const publication = publications.get(slug)
    if (!publication) throw new Error(`Unknown publication: ${slug}`)
    return {
      title: `${publication.title} | William Huang`,
      description: `${publication.title} by ${publication.authors}. ${publication.proceeding}, ${publication.year}.`,
    }
  }
  if (section === "photography" && slug) {
    const photo = photography.get(slug)
    if (!photo) throw new Error(`Unknown photography entry: ${slug}`)
    return { title: `${photo.title} | William Huang`, description: `Photography by William Huang: ${photo.title}.` }
  }
  return section === "publications"
    ? { title: "Publications | William Huang", description: "Publications by William Huang, a UCLA researcher in HCI, AI, sensing, and accessibility." }
    : { title: "Photography | William Huang", description: "Photography by William Huang." }
}

for (const route of routes) {
  if (!/^(photography|publications)(\/[a-z0-9-]+)?$/.test(route)) {
    throw new Error(`Invalid route path: ${route}`)
  }

  const directory = path.join(distDir, route)
  fs.mkdirSync(directory, { recursive: true })
  const url = `${siteUrl}/${route}/`
  const { title, description } = metadata(route)
  const pageHtml = homeHtml
    .replace(/    <script type="application\/ld\+json">[\s\S]*?<\/script>\n/, "")
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, '<meta property="og:type" content="website" />')
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
  fs.writeFileSync(path.join(directory, "index.html"), pageHtml)
}

const urls = ["/", ...routes.map((route) => `/${route}/`)]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`).join("\n")}\n</urlset>\n`
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap)

console.log(`✓ Generated ${routes.length} direct-link pages`)
