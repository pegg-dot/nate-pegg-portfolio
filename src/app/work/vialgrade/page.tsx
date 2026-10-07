import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function VialGradeCase() {
  return (
    <CaseShell
      className="caseCompact vialgradeCase"
      index="02 / VIALGRADE"
      title="VIALGRADE"
      subtitle="VialGrade is a research site I built after a friend who follows peptide research told me how many students were buying from vendors that all claimed to be verified but were hard to trust. I wanted to see what could actually be checked."
      external={{ label: "VIALGRADE.COM", href: "https://vialgrade.com" }}
      actions={[
        { label: "OPEN VIALGRADE", href: "https://vialgrade.com", external: true },
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/vial", external: true },
      ]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A research site that compares vendor claims against lab records, COAs, batch data, public enforcement, and other evidence." },
        { label: "WHY", text: "Every storefront seemed to say verified COAs, third-party testing, and research use only. I wanted one place where those claims could actually be cross-checked." },
        { label: "HOW", text: "I collect records, match certificates and batches, and grade the evidence across testing, regulatory, reputation, and business signals. If there is not enough evidence, VialGrade leaves it ungraded." },
        { label: "WHEN", text: "Built in 2026 and still changing. The current version is live at vialgrade.com." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT CAME FROM</span><h2>THE WEBSITES ALL SAID THEY WERE VERIFIED.</h2></div>
          <div className="caseStack">
            <p>A friend of mine is really into biomedicine and peptide research. He told me a lot of people around him wanted to buy peptides, but that a lot of the market felt sketchy.</p>
            <p>When I started looking, that was basically my reaction too. Every site had verified COAs, third-party testing, purity numbers, and a &ldquo;research use only&rdquo; disclaimer. It was hard to tell what any of it actually proved.</p>
            <p>So I thought, why can&apos;t I use AI and software to cross-check the claims? I did not want to build a site telling people what to take. I wanted to build something that makes the evidence easier to inspect.</p>
          </div>
        </div>
      </section>

      <section className="caseBand plasticVisualBand">
        <div className="caseImageWide vialLiveImage"><Image src="/vialgrade/home.jpg" alt="VialGrade live research homepage" fill sizes="100vw" /></div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">HOW THE GRADES WORK</span><h2>UNKNOWN HAS TO STAY UNKNOWN.</h2></div>
          <div className="caseStack">
            <p>The grading engine looks across four areas: independent testing, regulatory and operator signals, reputation, and business signals. It cross-checks COAs, batches, lab records, and the other evidence I can actually trace.</p>
            <p>I learned pretty quickly that missing evidence cannot automatically count against somebody, and a clean-looking website cannot count as proof either. If there is not enough evidence, the site can return no grade at all.</p>
            <p>For vendors with a strong record, independent lab testing is what separates the higher grades. Verified negative evidence can pull a grade down or cap it. The point is that the letter has to come from something I can show.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">A PROBLEM I DID NOT EXPECT</span><h2>HOW DO I KNOW A CLICK MADE IT OUT?</h2></div>
          <div className="caseStack">
            <p>I originally wanted a native checkout, but I could not make that work. So VialGrade links to the original vendor page instead.</p>
            <p>That meant my analytics stopped once somebody left the site. I wanted a way to measure whether those outbound links were actually being used and make the source of the traffic visible on the other side.</p>
            <p>I ended up building referral attribution into the links. They carry normal UTM tags plus a short VialGrade click reference, so I can measure the handoff and the destination can identify VialGrade as the source. There are no live affiliate deals or native checkout.</p>
          </div>
        </div>
      </section>

      <section className="caseBand vialCaseBand">
        <span className="caseLabel">WHAT HAPPENED AFTER I PUT IT ONLINE</span>
        <div className="caseSmallWin"><h2>People I did not know started using it.</h2><p>That honestly surprised me. In the past month it has gotten about 2,000 Google impressions, around 600 clicks into the site, and eight people have signed up. It is still small, but that made the idea feel a lot more real.</p></div>
        <div className="caseMetricWall quietMetricWall">
          <div><strong>~2K</strong><span>Google impressions / month</span></div>
          <div><strong>~600</strong><span>clicks into site / month</span></div>
          <div><strong>8</strong><span>signups</span></div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div><span className="caseLabel">IMPORTANT DISTINCTION</span><h2>IT IS A RESEARCH TOOL, NOT A SAFETY CLAIM.</h2></div>
          <div className="caseStack">
            <p>VialGrade does not sell peptides, tell people what to take, or claim that a product is safe, sterile, correctly dosed, or fit for human use.</p>
            <p>The thing I am trying to make better is the evidence layer: what a vendor claims, what records actually exist, where they came from, and what is still unknown.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
