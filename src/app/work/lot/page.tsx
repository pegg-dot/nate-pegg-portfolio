import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function LotCase() {
  return (
    <CaseShell
      index="04 / LOT"
      title="LOT"
      subtitle="LOT is the real-estate acquisition workspace I wanted for myself: a map, research terminal, underwriting context, owner information, and a pipeline for deciding what is actually worth a closer look."
      external={{ label: "GITHUB", href: "https://github.com/pegg-dot/real-estate-platform" }}
      actions={[{ label: "VIEW CODE", href: "https://github.com/pegg-dot/real-estate-platform", external: true }]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A Charlottesville-first acquisition workspace that combines parcel, zoning, assessment, ownership, flood, market, and underwriting context instead of treating a listing page as the whole deal." },
        { label: "WHY", text: "My uncle told me he could help me learn real estate. I wanted something I would actually use while learning, not another spreadsheet or a generic listings clone." },
        { label: "HOW", text: "I pull public and market evidence into one property dossier, separate sourced facts from modeled assumptions, score against an explicit thesis, and keep the final stage change as a human decision." },
        { label: "WHEN", text: "Built in 2026 while I was at UVA. Charlottesville became the first wired market because it is where I am and where I wanted to understand the deals." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT STARTED</span><h2>THE RESEARCH WAS EVERYWHERE.</h2></div>
          <div className="caseStack"><p>County records in one place. Zoning somewhere else. Assessments, ownership, flood information, rent assumptions and financing ideas all separated.</p><p>I wanted one workspace where a property could move from “interesting” to “worth looking at” without pretending every field was equally certain.</p><p>I spent time looking at how real-estate investors actually research deals, then built the flow around the questions I would want answered.</p></div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <span className="caseLabel">THE LOOP</span>
        <div className="lotLoop"><div><b>SENSE</b><span>parcel · zoning · owner · flood</span></div><i>→</i><div><b>REASON</b><span>normalize · score · model</span></div><i>→</i><div><b>SHOW</b><span>dossier · map · action brief</span></div><i>→</i><div><b>DECIDE</b><span>human moves the deal</span></div></div>
      </section>

      <section className="caseBand">
        <div className="caseImageWide lotImage"><Image src="/lot/map-deal-panel.jpg" alt="LOT property research workspace with map and deal panel" fill sizes="100vw" /></div>
        <div className="caseGrid two compactTop"><div><span className="caseLabel">WHAT I CARED ABOUT</span><h2>MODELED MEANS MODELED.</h2></div><div className="caseStack"><p>A sourced county fact should not look the same as an estimated rent.</p><p>A thesis score should explain the thesis it is scoring against instead of pretending to be a universal “good deal” number.</p><p>The system can organize the work and surface uncertainty. The actual investment decision stays human.</p></div></div>
      </section>
    </CaseShell>
  );
}
