import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, "..")

// Minimal Markdown -> HTML converter
function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n")

  function escapeHtml(raw) {
    return raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  function processInlineMarkdown(text) {
    // First replace markdown images/links with placeholders, then escape HTML,
    // and finally restore them as HTML tags.
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
    const images = []
    const links = []

    // Replace images with placeholders while collecting metadata
    let imageIndex = 0
    let processedText = text.replace(imagePattern, (_full, alt, url) => {
      images.push({ alt, url })
      const token = `___IMAGE_${imageIndex}___`
      imageIndex++
      return token
    })

    // Replace links with placeholders while collecting metadata
    let linkIndex = 0
    processedText = processedText.replace(linkPattern, (_full, linkText, url) => {
      links.push({ text: linkText, url })
      const token = `___LINK_${linkIndex}___`
      linkIndex++
      return token
    })

    // Escape HTML in the remaining text
    processedText = escapeHtml(processedText)

    // Restore images as HTML
    images.forEach(({ alt, url }, index) => {
      const escapedAlt = escapeHtml(alt || "Image")
      processedText = processedText.replace(
        `___IMAGE_${index}___`,
        `<figure><img src="${url}" alt="${escapedAlt}" /><figcaption>${escapedAlt}</figcaption></figure>`,
      )
    })

    // Restore links as HTML
    links.forEach(({ text: linkText, url }, index) => {
      processedText = processedText.replace(
        `___LINK_${index}___`,
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`,
      )
    })

    return processedText
  }

  const html = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (/^\s*$/.test(line)) {
      i++
      continue
    }

    if (/^```/.test(line)) {
      const code = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i])
        i++
      }
      if (i < lines.length && /^```/.test(lines[i])) i++
      html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`)
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      const text = processInlineMarkdown(heading[2])
      html.push(`<h${level}>${text}</h${level}>`)
      i++
      continue
    }

    if (/^>\s?/.test(line)) {
      const quote = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""))
        i++
      }
      html.push(`<blockquote>${escapeHtml(quote.join("\n")).replace(/\n/g, "<br/>")}</blockquote>`)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        const itemText = processInlineMarkdown(lines[i].replace(/^[-*]\s+/, ""))
        items.push(`<li>${itemText}</li>`)
        i++
      }
      html.push(`<ul>${items.join("")}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const itemText = processInlineMarkdown(lines[i].replace(/^\d+\.\s+/, ""))
        items.push(`<li>${itemText}</li>`)
        i++
      }
      html.push(`<ol>${items.join("")}</ol>`)
      continue
    }

    const para = [line]
    i++
    while (i < lines.length && !/^\s*$/.test(lines[i])) {
      if (/^(?:```|#{1,6}\s|>\s|[-*]\s|\d+\.\s)/.test(lines[i])) break
      para.push(lines[i])
      i++
    }
    const text = processInlineMarkdown(para.join(" ").trim())
    if (!text) continue
    if (/^<figure>[\s\S]*<\/figure>$/.test(text)) {
      html.push(text)
    } else {
      html.push(`<p>${text}</p>`)
    }
  }

  return html.join("\n")
}

function escapeHtml(raw = "") {
  return raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function unquote(value = "") {
  const trimmed = value.trim()
  if (!trimmed) return ""

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed.slice(1, -1).trim()
  }

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).trim()
  }

  return trimmed
}

function normalizeBibText(value = "") {
  return value
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function splitTopLevel(input = "", separator = " and ") {
  const parts = []
  let current = ""
  let depth = 0

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    if (char === "{") depth++
    if (char === "}") depth = Math.max(0, depth - 1)

    if (depth === 0 && input.slice(i, i + separator.length).toLowerCase() === separator) {
      parts.push(current.trim())
      current = ""
      i += separator.length - 1
      continue
    }

    current += char
  }

  if (current.trim()) parts.push(current.trim())
  return parts
}

function formatAuthorName(rawAuthor = "") {
  const author = rawAuthor.replace(/[{}]/g, "").trim()
  if (!author) return ""

  if (author.includes(",")) {
    const [last, first] = author.split(",").map((chunk) => chunk.trim())
    return [first, last].filter(Boolean).join(" ")
  }

  return author
}

function formatAuthors(authorField = "") {
  const authors = splitTopLevel(authorField, " and ")
    .map(formatAuthorName)
    .filter(Boolean)

  if (authors.length <= 2) return authors.join(", ")
  if (authors.length === 3) return `${authors[0]}, ${authors[1]}, and ${authors[2]}`
  return `${authors[0]} et al.`
}

function normalizeArxiv(fields = {}) {
  const arxivFromField = fields.arxiv
  if (arxivFromField) return arxivFromField

  if (fields.archiveprefix?.toLowerCase() === "arxiv" && fields.eprint) {
    return `https://arxiv.org/abs/${fields.eprint}`
  }

  return undefined
}

function parseBibFields(rawFields = "") {
  const fields = {}
  let i = 0

  while (i < rawFields.length) {
    while (i < rawFields.length && /[\s,]/.test(rawFields[i])) i++
    if (i >= rawFields.length) break

    let keyStart = i
    while (i < rawFields.length && /[A-Za-z0-9_-]/.test(rawFields[i])) i++
    const key = rawFields.slice(keyStart, i).toLowerCase()

    while (i < rawFields.length && /\s/.test(rawFields[i])) i++
    if (rawFields[i] !== "=") {
      while (i < rawFields.length && rawFields[i] !== "\n") i++
      continue
    }
    i++

    while (i < rawFields.length && /\s/.test(rawFields[i])) i++

    let value = ""
    if (rawFields[i] === "{") {
      let depth = 0
      while (i < rawFields.length) {
        const char = rawFields[i]
        value += char
        if (char === "{") depth++
        if (char === "}") {
          depth--
          if (depth === 0) {
            i++
            break
          }
        }
        i++
      }
    } else if (rawFields[i] === '"') {
      value += rawFields[i]
      i++
      while (i < rawFields.length) {
        const char = rawFields[i]
        value += char
        i++
        if (char === '"' && rawFields[i - 2] !== "\\") break
      }
    } else {
      while (i < rawFields.length && rawFields[i] !== "," && rawFields[i] !== "\n") {
        value += rawFields[i]
        i++
      }
    }

    fields[key] = unquote(value)

    while (i < rawFields.length && /\s/.test(rawFields[i])) i++
    if (rawFields[i] === ",") i++
  }

  return fields
}

function parseBibtexEntries(bibtex = "") {
  const entries = []
  const entryRegex = /@([A-Za-z]+)\s*\{\s*([^,]+)\s*,([\s\S]*?)\n\}\s*/g
  let match

  while ((match = entryRegex.exec(bibtex)) !== null) {
    const type = match[1].toLowerCase()
    const slug = match[2].trim()
    const fields = parseBibFields(match[3])

    entries.push({ type, slug, fields })
  }

  return entries
}

function buildPublicationLinks(fields = {}) {
  const links = {
    doi: fields.doi ? `https://doi.org/${fields.doi.replace(/^https?:\/\/doi.org\//, "")}` : undefined,
    arxiv: fields.arxiv || normalizeArxiv(fields),
    code: fields.code || undefined,
  }

  return Object.fromEntries(Object.entries(links).filter(([, value]) => Boolean(value)))
}

function parseBibMonth(value = "") {
  const normalized = normalizeBibText(value).toLowerCase()
  if (!normalized) return 0

  const monthMap = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    sept: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12,
  }

  if (monthMap[normalized]) return monthMap[normalized]

  const numeric = Number.parseInt(normalized, 10)
  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 12) return numeric

  return 0
}

// Generate notes content
function generateNotes() {
  const notesDir = path.join(rootDir, "content/notes")
  const files = fs.readdirSync(notesDir).filter((f) => f.endsWith(".mdx"))

  const notes = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const fullPath = path.join(notesDir, filename)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      content: markdownToHtml(content),
    }
  })

  const output = `export interface Note {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export const notes: Note[] = ${JSON.stringify(notes, null, 2)}
`

  fs.writeFileSync(path.join(rootDir, "content/notes.tsx"), output)
  console.log(`✓ Generated content for ${notes.length} notes`)
}

function generatePhotography() {
  const photographyDir = path.join(rootDir, "content/photography")
  const files = fs.existsSync(photographyDir)
    ? fs.readdirSync(photographyDir).filter((f) => f.endsWith(".mdx"))
    : []

  const photos = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const fullPath = path.join(photographyDir, filename)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      content: markdownToHtml(content),
    }
  })

  const output = `export interface Photo {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export const photography: Photo[] = ${JSON.stringify(photos, null, 2)}
`

  fs.writeFileSync(path.join(rootDir, "content/photography.tsx"), output)
  console.log(`✓ Generated content for ${photos.length} photography entries`)
}

// Generate books content
function generateBooks() {
  const booksDir = path.join(rootDir, "content/books")
  const files = fs.readdirSync(booksDir).filter((f) => f.endsWith(".mdx"))

  const books = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "")
    const fullPath = path.join(booksDir, filename)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content: mdxContent } = matter(fileContents)

    // Read metadata from frontmatter with defaults
    const title = data.title || slug
    const author = data.author || ""
    const year = data.year || 0
    const lastUpdated = data.lastUpdated
    const hasNotes = data.hasNotes ?? (mdxContent.trim().length > 0)
    const isReading = data.isReading ?? false
    const content = markdownToHtml(mdxContent)

    return {
      slug,
      title,
      author,
      year,
      ...(lastUpdated && { lastUpdated }),
      hasNotes,
      isReading,
      content,
    }
  })

  const output = `export interface Book {
  slug: string
  title: string
  author: string
  year: number
  lastUpdated?: string
  hasNotes: boolean
  isReading: boolean
  content: string
}

export const books: Book[] = ${JSON.stringify(books, null, 2)}
`

  fs.writeFileSync(path.join(rootDir, "content/books.tsx"), output)
  console.log(`✓ Generated content for ${books.length} books`)
}

function generatePublications() {
  const bibPath = path.join(rootDir, "content/publications.bib")
  const pdfDir = path.join(rootDir, "content/pdfs/publications")

  if (!fs.existsSync(bibPath)) {
    const output = `export interface PublicationLinks {
  doi?: string
  arxiv?: string
  code?: string
}

export interface Publication {
  slug: string
  title: string
  authors: string
  proceeding: string
  year: number | null
  links: PublicationLinks
  hasPdf: boolean
  pdfPath: string
}

export const publications: Publication[] = []
`
    fs.writeFileSync(path.join(rootDir, "content/publications.tsx"), output)
    console.log("✓ Generated content for 0 publications")
    return
  }

  const bibRaw = fs.readFileSync(bibPath, "utf8")
  const entries = parseBibtexEntries(bibRaw)

  const publications = entries
    .map(({ slug, fields }) => {
      const authors = normalizeBibText(fields.authors || fields.author || "")
      const proceeding = normalizeBibText(fields.proceeding || fields.booktitle || "")
      const title = normalizeBibText(fields.title || slug)
      const year = Number.parseInt(normalizeBibText(fields.year || ""), 10) || 0
      const month = parseBibMonth(fields.month || "")
      const links = buildPublicationLinks(fields)
      const pdfFilename = `${slug}.pdf`
      const hasPdf = fs.existsSync(path.join(pdfDir, pdfFilename))

      return {
        slug,
        title,
        authors,
        proceeding,
        year: year || null,
        links,
        hasPdf,
        pdfPath: `/content/pdfs/publications/${pdfFilename}`,
        _sortYear: year,
        _sortMonth: month,
      }
    })
    .sort((a, b) => {
      if (a._sortYear !== b._sortYear) return b._sortYear - a._sortYear
      if (a._sortMonth !== b._sortMonth) return b._sortMonth - a._sortMonth
      return a.title.localeCompare(b.title)
    })
    .map(({ _sortYear, _sortMonth, ...publication }) => publication)

  const output = `export interface PublicationLinks {
  doi?: string
  arxiv?: string
  code?: string
}

export interface Publication {
  slug: string
  title: string
  authors: string
  proceeding: string
  year: number | null
  links: PublicationLinks
  hasPdf: boolean
  pdfPath: string
}

export const publications: Publication[] = ${JSON.stringify(publications, null, 2)}
`

  fs.writeFileSync(path.join(rootDir, "content/publications.tsx"), output)
  console.log(`✓ Generated content for ${publications.length} publications`)
}

// Run generators
generateNotes()
generatePhotography()
generatePublications()
