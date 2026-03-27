export interface Note {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export const notes: Note[] = [
  {
    "slug": "favourite-links",
    "title": "Example: Resource Collection",
    "date": "January 2025",
    "excerpt": "",
    "content": "<p>This note demonstrates how you can organize and share collections of links, resources, or bookmarks.</p>\n<h2>Design Resources</h2>\n<ul><li><a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">Example Link 1</a> - A great design resource</li><li><a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">Example Link 2</a> - Another helpful tool</li></ul>\n<h2>Reading List</h2>\n<ul><li><a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">Example Article</a> - An interesting article</li><li><a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">Example Essay</a> - A thought-provoking piece</li></ul>\n<h2>Tools</h2>\n<ul><li><a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">Example Tool</a> - A useful utility</li></ul>"
  },
  {
    "slug": "hello-world",
    "title": "Welcome to Your New Site",
    "date": "January 2025",
    "excerpt": "",
    "content": "<p>This is an example note to demonstrate how the content system works.</p>\n<p>You can write your thoughts, essays, or any content you'd like to share here. The MDX format gives you full control over your writing with support for:</p>\n<ul><li>**Markdown formatting** for rich text</li><li>Frontmatter for metadata (title, date, excerpt)</li><li>Custom React components (if you want to extend it)</li></ul>\n<h2>Getting Started</h2>\n<p>Simply edit this file in `content/notes/` or create new `.mdx` files to add your own content.</p>\n<p>The build system will automatically process your content and make it available on your site.</p>"
  }
]
