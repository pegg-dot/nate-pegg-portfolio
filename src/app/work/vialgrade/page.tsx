import CaseShell from "../../components/CaseShell";

export default function VialGradeCase() {
  return (
    <CaseShell index="02 / VIALGRADE" title="VIALGRADE" subtitle="An evidence-backed research platform for the peptide market. It brings vendor listings, compounds, lab results, source history, conflicts and uncertainty into one place." external={{ label: "VIALGRADE.COM", href: "https://vialgrade.com" }} actions={[{ label: "OPEN VIALGRADE", href: "https://vialgrade.com", external: true }, { label: "VIEW CODE", href: "https://github.com/pegg-dot/vial", external: true }]}>
      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE PROBLEM I SAW</span><h2>EVERYTHING LOOKED LEGIT. THAT DID NOT MEAN IT WAS.</h2></div>
          <div className="caseStack"><p>Listings change. Certificates get reposted. Vendors rebrand. Prices are easy to compare; provenance is not.</p><p>I did not want to make another directory with a score at the top and no way to inspect where it came from.</p><p>The product became a research layer: listings, lab evidence, source history and uncertainty in the same place.</p></div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <span className="caseLabel">THE MODEL</span>
        <div className="evidencePipeline"><div>listing</div><i>→</i><div>source</div><i>→</i><div>lab evidence</div><i>→</i><div>conflict / uncertainty</div><i>→</i><div>reviewed state</div><i>→</i><div className="filled">published claim</div></div>
        <p className="caseFootnote">The useful part is not that the site has a lot of data. It is that the user can follow a claim backward and see what supports it.</p>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE PART THAT TOOK TIME</span><h2>THE WEBSITE WAS THE EASY PART.</h2></div>
          <div className="caseStack"><p>Collection and normalization had to survive pages changing shape.</p><p>Automated collection had to stay separate from reviewed state so a crawler could not quietly turn into product truth.</p><p>Source quality, conflicts and unknowns had to be modeled as first-class things instead of being smoothed away.</p></div>
        </div>
      </section>

      <section className="caseBand vialCaseBand">
        <span className="caseLabel">A SMALL WIN</span>
        <div className="caseSmallWin"><h2>3 accounts I do not recognize signed up.</h2><p>That was the first moment it felt like something existed outside my own browser.</p></div>
        <div className="caseMetricWall quietMetricWall"><div><strong>60</strong><span>baseline compounds</span></div><div><strong>34</strong><span>baseline vendors</span></div><div><strong>201</strong><span>checked-in lab-result records</span></div><div><strong>897</strong><span>page views / 90d</span></div></div>
      </section>
    </CaseShell>
  );
}
