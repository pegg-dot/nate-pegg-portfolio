import CaseShell from "../../components/CaseShell";

export default function VialGradeCase() {
  return (
    <CaseShell index="02 / VIALGRADE" title="VIALGRADE" subtitle="Evidence-backed market intelligence for a fragmented peptide market." external={{ label: "VIALGRADE.COM", href: "https://vialgrade.com" }}>
      <section className="caseBand vialCaseBand">
        <div className="caseMetricWall"><div><strong>897</strong><span>page views / 90d</span></div><div><strong>376</strong><span>reader-days / 90d</span></div><div><strong>1,264</strong><span>vendor clicks / 90d</span></div><div><strong>0</strong><span>confirmed orders</span></div></div>
        <p className="caseFootnote">The analytics intentionally separate traffic from outcomes. Reader IDs rotate daily, so the system does not pretend reader-days are durable unique users.</p>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE DATA LAYER</span><h2>NOT ANOTHER DIRECTORY.</h2></div>
          <div className="caseStack"><p><b>60</b> baseline compounds</p><p><b>34</b> baseline vendors</p><p><b>73</b> checked-in vendor COA records</p><p><b>201</b> checked-in Janoshik result records</p></div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <span className="caseLabel">PROVENANCE</span>
        <div className="evidencePipeline"><div>listing</div><i>→</i><div>source</div><i>→</i><div>lab evidence</div><i>→</i><div>conflict / uncertainty</div><i>→</i><div>reviewed state</div><i>→</i><div className="filled">published claim</div></div>
        <p className="caseFootnote">Automated collection is kept separate from higher-impact review and publication decisions.</p>
      </section>

      <section className="caseBand">
        <span className="caseLabel">WHAT I BUILT</span>
        <div className="buildFacts"><span>Next.js / React / TypeScript</span><span>PostgreSQL production data</span><span>automated collection workflows</span><span>evidence + provenance modeling</span><span>protected operational surfaces</span><span>security + release gates</span><span>public API surfaces</span><span>isolated previews</span></div>
      </section>
    </CaseShell>
  );
}
