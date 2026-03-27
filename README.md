# Cozy website template

Personal website template with resizable panels & MDX content management.

## Features

- **Resizable Panels**: Drag the dithered borders between panels to create your perfect layout
- **Decorative Ribbon**: Book-inspired ribbon bookmark detail
- **Mobile Responsive**: Seamless hamburger menu for mobile devices
- **MDX Content System**: Write notes and book reviews in Markdown with frontmatter metadata
- **Build-time Generation**: Lightning-fast performance with pre-processed content
- **Custom Typography**: Font stack ft. Zalando Sans, STIX Two Text serif, and JetBrains Mono
- **Paper Grain Texture**: Subtle background texture for a tactile, analog feel

## Quick Start

1. **Clone this repository**

```bash
git clone https://github.com/yourusername/minimalist-portfolio-template.git
cd minimalist-portfolio-template
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Start the development server**

```bash
npm run dev
```

Visit `http://localhost:5173` to see your site.

4. **Customize your content** (see sections below)

## Customization

### Update Your About Section

Edit `components/about-section.tsx` to personalize your homepage:

- Change your name and pronunciation
- Update your bio and work history
- Add your social media links (GitHub, Twitter, etc.)

### Add Your Notes

Create new `.mdx` files in the `content/notes/` directory:

```mdx
---
title: "Your Note Title"
date: "Month Year"
excerpt: "Optional brief description"
---

Your content goes here. Use standard Markdown syntax!

## Headings work

- Lists work too
- **Bold** and *italic* text
- [Links](https://example.com)
```

Notes automatically appear in your site after restarting the dev server.

### Add Your Bookshelf

Create `.mdx` files in the `content/books/` directory:

```mdx
---
title: "Book Title"
author: "Author Name"
year: 2024
lastUpdated: "Month Year"
isReading: true
hasNotes: true
---

Your book notes and thoughts go here...
```

**Frontmatter Options:**
- `isReading: true` - Shows in "Now reading" section
- `isReading: false` - Shows in "On my shelf" section
- `hasNotes: false` - Hides the note icon (defaults to true if content exists)

## Development

```bash
npm run dev              # Start dev server (auto-generates content)
npm run build            # Build for production
npm run generate-content # Manually regenerate content from MDX
npm run lint             # Run ESLint
```

## How It Works

This template uses a build-time content generation system:

1. **Write**: Create `.mdx` files in `content/notes/` or `content/books/`
2. **Generate**: `scripts/generate-content.mjs` converts MDX to static TypeScript files
3. **Build**: Vite bundles your site with pre-processed HTML content
4. **Deploy**: Static, performant site ready to ship

No runtime parsing means blazing-fast page loads!

## Deployment

This template is ready to deploy to:

- **Vercel** (recommended): Connect your GitHub repo
- **Netlify**: Drag and drop your build folder
- **Any static host**: Run `npm run build` and deploy the `dist` folder

## Tech Stack

- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Content**: MDX with gray-matter
- **Layout**: react-resizable-panels
- **TypeScript**: Full type safety

## License

MIT License
