import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function VialGradeCase() {
  return (
    <CaseShell
      index="02 / VIALGRADE"
      title="VIALGRADE"
      subtitle="VialGrade is a research platform for the peptide market. I built it because it was surprisingly hard to tell where a claim came from, whether a lab result matched it, or what was actually unknown."
      external={{ label: "VIALGRADE.COM", href: "https://vialgrade.com" }}
      actions={[
        { label: "OPEN VIALGRADE", href: "https://vialgrade.com", external: true },
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/vial", external: true },
      ]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "One place to research compounds, vendors, prices, lab evidence, source history, and conflicts instead of bouncing between storefronts and screenshots of certificates." },
        { label: "WHY", text: "The market felt backwards to me. The polished website was easy to find. The evidence behind the claims was the part that took work, and that is exactly the part people should be able to inspect." },
        { label: "HOW", text: "I collect and normalize vendor and lab data, keep provenance attached to the records, model supported / conflicting / unknown states, and keep automated collection separate from reviewed product truth." },
        { label: "WHEN", text: "Built in 2026 and still changing. The current version is live at vialgrade.com and I keep adding coverage, verification, and the operational tooling behind it." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE PROBLEM</span><h2>EVERYTHING COULD LOOK LEGIT.</h2></div>
          <div className="caseStack">
            <p>People were comparing prices and storefronts, but the thing I cared about was harder to compare: what evidence actually existed behind a product or vendor.</p>
            <p>Listings change. Certificates get reposted. Vendors rebrand. A purity number can look precise even when the source behind it is messy.</p>
            <p>I did not want to build another directory where the site gives you one score and asks you to trust the site.</p>
          </div>
        </div>
      </section>

      <section className="caseBand plasticVisualBand">
        <div className="caseImageWide vialLiveImage"><Image src="/vialgrade/home.jpg" alt="VialGrade live market research homepage" fill sizes="100vw" /></div>
      </section>

      <section className="caseBand caseBandBlue">
        <span className="caseLabel">HOW I THINK ABOUT A CLAIM</span>
        <div className="evidencePipeline"><div>listing</div><i>→</i><div>source</div><i>→</i><div>lab evidence</div><i>→</i><div>conflict / unknown</div><i>→</i><div>reviewed state</div><i>→</i><div className="filled">what the site can say</div></div>
        <p className="caseFootnote">The useful part is being able to go backward. If VialGrade says something, I want the user to be able to inspect what that statement is standing on.</p>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT TOOK THE MOST WORK</span><h2>THE DATA LAYER, NOT THE PAGE.</h2></div>
          <div className="caseStack">
            <p>I had to figure out how to collect a market where the sources do not stay still. Pages change shape, names are inconsistent, and the same certificate can show up in different contexts.</p>
            <p>I built the review layer so the crawler is not allowed to silently become the truth. Automated collection and what the product publishes are separate states.</p>
            <p>That also meant uncertainty had to be a real state. Sometimes the right answer is “I do not have enough evidence yet.”</p>
          </div>
        </div>
      </section>

      <section className="caseBand vialCaseBand">
        <span className="caseLabel">WHAT HAPPENED AFTER I PUT IT ONLINE</span>
        <div className="caseSmallWin"><h2>People I do not know started using it.</h2><p>There are three accounts I do not recognize, and the site has been getting real search and direct traffic. It is still tiny, but that was the first time the project felt like it existed outside my own browser.</p></div>
        <div className="caseMetricWall quietMetricWall"><div><strong>3</strong><span>accounts I do not recognize</span></div><div><strong>897</strong><span>page views / 90d</span></div><div><strong>376</strong><span>reader-days / 90d</span></div><div><strong>1,264</strong><span>vendor click-throughs / 90d</span></div></div>
      </section>
    </CaseShell>
  );
}
