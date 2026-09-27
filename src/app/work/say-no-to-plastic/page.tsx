import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function PlasticCase() {
  return (
    <CaseShell
      index="07 / SAY NO TO PLASTIC"
      title="SAY NO TO PLASTIC"
      subtitle="Say No To Plastic is an interactive education site I built around Dr. Elie Haddad's work on microplastics. The challenge was turning a dense research topic into something visual without making the evidence sound more certain than it is."
      external={{ label: "LIVE SITE", href: "https://saynotoplastic.com" }}
      actions={[
        { label: "OPEN SITE", href: "https://saynotoplastic.com", external: true },
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/SayNoToPlastic", external: true },
      ]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A visual, interactive site about microplastics, human exposure, and the evidence for plastic-derived material found in the body, connected to Dr. Elie Haddad and Homo Plasticus." },
        { label: "WHY", text: "The source material was spread across papers, headlines, a book, talks, and practical advice. I wanted a normal person to be able to explore the subject instead of getting a wall of citations or a scary headline." },
        { label: "HOW", text: "I organized the experience around the body, built interactive 3D anatomy and organ-by-organ evidence chapters, connected the book, podcast, TEDx, guides, and sources, and added validation around citations and releases." },
        { label: "WHEN", text: "Built in 2026 as a live client project. I kept changing the information architecture as I learned what Dr. Haddad actually wanted the site to teach and what the experience needed to do." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE JOB</span><h2>MAKE THE SCIENCE FEEL EXPLORABLE.</h2></div>
          <div className="caseStack"><p>I had to figure out the experience, not just put book copy onto webpages.</p><p>The body became the organizing idea. A person can move through the evidence organ by organ and see the study, what it found, and the limitation beside it.</p><p>I also had to connect the more practical parts: exposure-reduction guides, the book, the podcast, talks, and the source trail underneath the visuals.</p></div>
        </div>
      </section>

      <section className="caseBand plasticVisualBand">
        <div className="caseImageWide plasticImage"><Image src="/plastic/home.jpg" alt="Say No To Plastic interactive educational website" fill sizes="100vw" /></div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT MADE IT HARD</span><h2>THE INTERFACE COULD NOT BE MORE CERTAIN THAN THE PAPER.</h2></div>
          <div className="caseStack"><p>A dramatic 3D body can make something feel authoritative even when the underlying study has a narrow claim.</p><p>I ended up caring as much about source traceability, editorial checks, and release validation as the WebGL pieces.</p><p>The design problem was not “make microplastics scary.” It was “make the evidence understandable and keep the caveats attached.”</p></div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">WHAT EXISTS NOW</span>
        <div className="buildFacts"><span>whole-body journey</span><span>organ-by-organ evidence</span><span>3D anatomy</span><span>practical guides</span><span>book previews</span><span>podcast + TEDx</span><span>source traceability</span><span>owner tools</span></div>
      </section>
    </CaseShell>
  );
}
