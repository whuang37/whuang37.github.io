import { Footer } from "./footer"
import headshot from "@/content/images/headshot.png"
import cvPdf from "@/content/pdfs/CV_WilliamHuang.pdf"

export function AboutSection() {
  return (
    <div className="flex h-full min-h-full flex-col">
      <div className="space-y-8">
      <div>
        <img
          src={headshot}
          alt="Portrait headshot"
          className="w-32 h-32 rounded-full object-cover border border-border"
        />
      </div>
      <div>
        <h1 className="text-5xl font-serif mb-2">william·huang</h1>
        <p className="text-muted-foreground text-sm">/ˈwɪljəm.xu̯ɑŋ/</p>
      </div>

      <div className="space-y-4">
        <p className="text-foreground">
          I am a PhD Student in the department of{" "}
          <a
            href="https://www.ee.ucla.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            Electrical and Computer Engineering
          </a>{" "}
          at the{" "}
          <a
            href="https://www.ucla.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            University of California, Los Angeles (UCLA)
          </a>{" "}
          advised by{" "}
          <a
            href="https://yangzhang.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            Professor Yang Zhang
          </a>{" "}
          in the{" "}
          <a
            href="https://hilab.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            Human-Centered Computing & Intelligent Sensing Lab (HiLab)
          </a>
          . I am currently supported by the{" "}
          <a
            href="https://www.nsf.gov/funding/opportunities/grfp-nsf-graduate-research-fellowship-program"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            NSF Graduate Research Fellowship (NSF GRFP)
          </a>
          .
        </p>
        <p className="text-foreground">My research interests lie at the intersection of <b>Human-Computer Interaction (HCI)</b>, <b>Artificial Intelligence (AI)</b>, and <b>Sensing</b>. I am broadly interested in the elicitation and encoding of abstract spatial and mobility preferences which dictate how people experience the physical world. By effectively modeling spatial preferences, I aim to develop more inclusive, practical systems to support people in real-world tasks. My work spans multiple application domains including but not limited to <b>accessibility</b>, <b>extended reality</b>, and <b>health sensing</b>. </p>
        <p className="text-foreground">
          Previously, I worked at{" "}
          <a
            href="https://www.pnnl.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            Pacific Northwest National Laboratory
          </a>{" "}
          as an Applied Decision Systems and Analytics Intern,{" "}
          <a
            href="https://www.intel.com/content/www/us/en/architecture-and-technology/3d-athlete-tracking.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            Intel 3DAT
          </a>{" "}
          as a Biomechanics Co-Op,{" "}
          <a
            href="https://uclabruins.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            UCLA Athletics
          </a>{" "}
          as the Data Analytics and Sports Science Project Lead, and the{" "}
          <a
            href="https://www.oar.nih.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
          >
            National Institutes of Health - Office of AIDS Research
          </a>{" "}
          as a Data Science Fellow.
        </p>

        <p className="text-foreground">The best way to reach me is by email at william[dot]huang[at]ucla[dot]edu.</p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <a
          href="mailto:william.huang@ucla.edu"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
        >
          Email
        </a>
        <a
          href={cvPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
        >
          CV
        </a>
        <a
          href="https://github.com/whuang37"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/whuang37/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
        >
          LinkedIn
        </a>
        <a
          href="https://scholar.google.com/citations?user=bB580MsAAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
        >
          Google Scholar
        </a>
        <a
          href="https://orcid.org/0000-0001-7651-2190"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid"
        >
          ORCID
        </a>
      </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}
