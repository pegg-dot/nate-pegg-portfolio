import Image from "next/image";
import CaseShell from "../../components/CaseShell";

export default function PlasticCase() {
  return (
    <CaseShell index="07 / SAY NO TO PLASTIC" title="SAY NO TO PLASTIC" subtitle="This started as a design and engineering problem: take a subject buried in dense papers, headlines and generic advice and make it understandable without making the science more certain than it is." external={{ label: "LIVE SITE", href: "https://saynotoplastic.com" }}>
      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE JOB</span><h2>MAKE THE SCIENCE FEEL EXPLORABLE.</h2></div>
          <div className="caseStack"><p>The project is connected to Dr. Elie Haddad and <i>Homo Plasticus</i>. I had to figure out what the experience should actually be, not just put book copy on a website.</p><p>The body became the organizing idea. A person can move through the evidence organ by organ instead of opening with a wall of citations.</p><p>Every chapter tries to show both what a study found and what it did not prove.</p></div>
        </div>
      </section>

      <section className="caseBand plasticVisualBand">
        <div className="caseImageWide plasticImage"><Image src="/plastic/home.jpg" alt="Say No To Plastic interactive educational website" fill sizes="100vw" /></div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT MADE IT INTERESTING TO ME</span><h2>THE INTERFACE HAD TO CARRY UNCERTAINTY TOO.</h2></div>
          <div className="caseStack"><p>A dramatic 3D body is easy to make feel authoritative. That is exactly why the limitations have to stay beside the findings.</p><p>I ended up caring as much about source traceability, editorial checks and release validation as the WebGL pieces.</p><p>The design problem was not “make microplastics scary.” It was “make the evidence legible.”</p></div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">THE EXPERIENCE</span>
        <div className="buildFacts"><span>whole-body journey</span><span>organ-by-organ evidence</span><span>3D anatomy</span><span>practical guides</span><span>book previews</span><span>podcast + TEDx</span><span>source traceability</span><span>owner tools</span></div>
      </section>
    </CaseShell>
  );
}
