import { Footer } from "./footer"
import headshot from "@/content/images/headshot.png"
import cvPdf from "@/content/pdfs/CV_WilliamHuang.pdf"

export function AboutSection() {
  return (
    <div className="flex min-h-full min-w-0 flex-col">
      <div className="min-w-0 space-y-8">
      <div>
        <img
          src={headshot}
          alt="Portrait headshot"
          className="w-32 h-32 rounded-full object-cover border border-border"
        />
      </div>
      <div>
        <h1 className="mb-2 break-words text-4xl font-serif sm:text-5xl">william·huang</h1>
        <p className="text-sm text-muted-foreground break-words">/ˈwɪljəm.xu̯ɑŋ/</p>
      </div>

      <div className="min-w-0 space-y-4">
        <p className="text-foreground break-words">
          I am a PhD Student in the department of{" "}
          <a
            href="https://www.ee.ucla.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            Electrical and Computer Engineering
          </a>{" "}
          at the{" "}
          <a
            href="https://www.ucla.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            University of California, Los Angeles (UCLA)
          </a>{" "}
          advised by{" "}
          <a
            href="https://yangzhang.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            Professor Yang Zhang
          </a>{" "}
          in the{" "}
          <a
            href="https://hilab.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            Human-Centered Computing & Intelligent Sensing Lab (HiLab)
          </a>
          . I am currently supported by the{" "}
          <a
            href="https://www.nsf.gov/funding/opportunities/grfp-nsf-graduate-research-fellowship-program"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            NSF Graduate Research Fellowship (NSF GRFP)
          </a>
          .
        </p>
        <p className="text-foreground break-words">My research interests lie at the intersection of <b>Human-Computer Interaction (HCI)</b>, <b>Artificial Intelligence (AI)</b>, and <b>Sensing</b>. I am broadly interested in the elicitation and encoding of abstract spatial and mobility preferences which dictate how people experience the physical world. By effectively modeling spatial preferences, I aim to develop more inclusive, practical systems to support people in real-world tasks. My work spans multiple application domains including but not limited to <b>accessibility</b>, <b>extended reality</b>, and <b>health sensing</b>. </p>
        <p className="text-foreground break-words">
          Previously, I worked at{" "}
          <a
            href="https://www.pnnl.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            Pacific Northwest National Laboratory
          </a>{" "}
          as an Applied Decision Systems and Analytics Intern,{" "}
          <a
            href="https://www.intel.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            Intel
          </a>{" "}
          as a Biomechanics Co-Op,{" "}
          <a
            href="https://uclabruins.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            UCLA Athletics
          </a>{" "}
          as the Data Analytics and Sports Science Project Lead, and the{" "}
          <a
            href="https://www.oar.nih.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
          >
            National Institutes of Health - Office of AIDS Research
          </a>{" "}
          as a Data Science Fellow.
        </p>

        <p className="text-foreground break-words">The best way to reach me is by email at william[dot]huang[at]ucla[dot]edu.</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
        <a
          href="mailto:william.huang@ucla.edu"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
        >
          Email
        </a>
        <a
          href={cvPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
        >
          CV
        </a>
        <a
          href="https://github.com/whuang37"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/whuang37/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
        >
          LinkedIn
        </a>
        <a
          href="https://scholar.google.com/citations?user=bB580MsAAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
        >
          Google Scholar
        </a>
        <a
          href="https://orcid.org/0000-0001-7651-2190"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground opacity-70 underline decoration-dotted decoration-1 underline-offset-2 transition-all hover:opacity-100 hover:decoration-solid [overflow-wrap:anywhere]"
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
