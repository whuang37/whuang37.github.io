export interface PublicationLinks {
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

export const publications: Publication[] = [
  {
    "slug": "deltadorsal",
    "title": "DeltaDorsal: Enhancing Hand Pose Estimation with Dorsal Features in Egocentric Views",
    "authors": "William Huang, Siyou Pei, Leyi Zou, Eric J. Gonzalez, Ishan Chatterjee, Yang Zhang",
    "proceeding": "Proceedings of CHI 2026 To Appear",
    "year": 2026,
    "links": {
      "doi": "https://doi.org/10.48550/arXiv.2601.15516",
      "arxiv": "https://arxiv.org/abs/2601.15516",
      "code": "https://github.com/hilab-open-source/deltadorsal"
    },
    "hasPdf": true,
    "pdfPath": "/content/pdfs/publications/deltadorsal.pdf"
  },
  {
    "slug": "does-cafe",
    "title": "\"Does the Cafe Entrance Look Accessible? Where Is the Door?\" Towards Geospatial AI Agents for Visual Inquiries",
    "authors": "Jon E. Froehlich, Jared Hwang, Zeyu Wang, John S. O'Meara, Xia Su, William Huang, Yang Zhang, Alex Fiannaca, Philip Nelson, Shaun Kane",
    "proceeding": "ICCV CV4A11y Workshop 2025",
    "year": 2025,
    "links": {
      "doi": "https://doi.org/10.48550/arXiv.2508.15752",
      "arxiv": "https://arxiv.org/abs/2508.15752"
    },
    "hasPdf": true,
    "pdfPath": "/content/pdfs/publications/does-cafe.pdf"
  },
  {
    "slug": "accessibility-scout",
    "title": "Accessibility Scout: Personalized Accessibility Scans of Built Environments",
    "authors": "William Huang, Xia Su, Jon E. Froehlich, Yang Zhang",
    "proceeding": "Proceedings of UIST 2025",
    "year": 2025,
    "links": {
      "doi": "https://doi.org/10.1145/3746059.3747624",
      "arxiv": "https://arxiv.org/abs/2507.23190",
      "code": "https://github.com/hilab-open-source/accessibility-scout"
    },
    "hasPdf": true,
    "pdfPath": "/content/pdfs/publications/accessibility-scout.pdf"
  },
  {
    "slug": "wheelpose",
    "title": "WheelPose: Data Synthesis Techniques to Improve Pose Estimation Performance on Wheelchair Users",
    "authors": "William Huang, Sam Ghahremani, Siyou Pei, Yang Zhang",
    "proceeding": "Proceedings of CHI 2024",
    "year": 2024,
    "links": {
      "doi": "https://doi.org/10.1145/3613904.3642555",
      "arxiv": "https://arxiv.org/abs/2404.17063",
      "code": "https://github.com/hilab-open-source/wheelpose"
    },
    "hasPdf": true,
    "pdfPath": "/content/pdfs/publications/wheelpose.pdf"
  }
]
