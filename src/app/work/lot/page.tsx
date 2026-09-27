import Image from "next/image";
import CaseShell from "../../components/CaseShell";

export default function LotCase() {
  return (
    <CaseShell index="04 / LOT" title="LOT" subtitle="An explainable real-estate acquisition workspace that turns parcel, zoning, ownership and market evidence into ranked opportunities, underwriting context and a decision pipeline." external={{ label: "GITHUB", href: "https://github.com/pegg-dot/real-estate-platform" }} actions={[{ label: "VIEW CODE", href: "https://github.com/pegg-dot/real-estate-platform", external: true }]}>
      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT STARTED</span><h2>THE RESEARCH WAS EVERYWHERE.</h2></div>
          <div className="caseStack"><p>County records in one place. Zoning somewhere else. Assessments, ownership, flood information, rent assumptions and financing ideas all separated.</p><p>I wanted one workspace where a property could move from “interesting” to “worth looking at” without pretending every field was equally certain.</p><p>Charlottesville and UVA became the first market because that was the market I actually wanted to learn.</p></div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <span className="caseLabel">THE LOOP</span>
        <div className="lotLoop"><div><b>SENSE</b><span>parcel · zoning · owner · flood</span></div><i>→</i><div><b>REASON</b><span>normalize · score · model</span></div><i>→</i><div><b>SHOW</b><span>dossier · map · action brief</span></div><i>→</i><div><b>DECIDE</b><span>human moves the deal</span></div></div>
      </section>

      <section className="caseBand">
        <div className="caseImageWide lotImage"><Image src="/lot/map-deal-panel.jpg" alt="LOT property research workspace with map and deal panel" fill sizes="100vw" /></div>
        <div className="caseGrid two compactTop"><div><span className="caseLabel">THE PART I CARE ABOUT</span><h2>MODELED MEANS MODELED.</h2></div><div className="caseStack"><p>A sourced county fact should not look the same as an estimated rent.</p><p>A thesis score should explain the thesis it is scoring against instead of pretending to be a universal “good deal” number.</p><p>The system can organize the work and surface uncertainty. The actual investment decision stays human.</p></div></div>
      </section>
    </CaseShell>
  );
}
