import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function LotCase() {
  return (
    <CaseShell
      className="caseCompact lotCase"
      index="04 / LOT"
      title="LOT"
      subtitle="LOT is a real-estate tool I built for myself and my uncle to find opportunities around Charlottesville. It pulls a lot of the data I would otherwise have to look through manually into one map and grades properties against the way I actually want to invest."
      external={{ label: "GITHUB", href: "https://github.com/pegg-dot/real-estate-platform" }}
      actions={[{ label: "VIEW CODE", href: "https://github.com/pegg-dot/real-estate-platform", external: true }]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A real-estate workspace for finding, underwriting, and tracking houses around Charlottesville based on the way I’m actually looking at deals." },
        { label: "WHY", text: "My uncle said he could help me learn real estate, so I built a tool to help me." },
        { label: "HOW", text: "It combines parcel, zoning, assessment, ownership, flood, market, and underwriting data, then scores each property against an explicit thesis and financing rules." },
        { label: "WHEN", text: "Built in 2026 at UVA. It’s useful now, but still unfinished and something I’m building mainly for myself and my uncle." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT CAME FROM</span><h2>I WANTED TO COMPRESS THE RESEARCH.</h2></div>
          <div className="caseStack">
            <p>I’m a student in Charlottesville, and I know there’s real demand for student housing around UVA. That made it a market I actually wanted to understand instead of picking somewhere random.</p>
            <p>What interested me about AI was the idea that you can take a huge amount of accumulated data and knowledge and compress it into something useful. Real estate felt perfect for that because so much of the work is gathering information that already exists, then figuring out what actually matters.</p>
            <p>I had also been learning about creative financing from people like Pace Morby and Grant Cardone, so I wanted the tool to look for opportunities through that lens instead of just telling me whether a property looked cheap or expensive.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <span className="caseLabel">THE BASIC LOOP</span>
        <div className="lotLoop">
          <div><b>SENSE</b><span>parcel · zoning · owner · flood</span></div><i>→</i>
          <div><b>REASON</b><span>normalize · underwrite · score</span></div><i>→</i>
          <div><b>SHOW</b><span>map · dossier · financing ideas</span></div><i>→</i>
          <div><b>DECIDE</b><span>I decide what is worth pursuing</span></div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseImageWide lotImage"><Image src="/lot/map-deal-panel.jpg" alt="LOT property research workspace with map and deal panel" fill sizes="100vw" /></div>
        <div className="caseGrid two compactTop">
          <div><span className="caseLabel">WHAT IT ACTUALLY DOES</span><h2>THE MAP IS BUILT AROUND MY THESIS.</h2></div>
          <div className="caseStack">
            <p>LOT pulls together public parcel data, zoning, assessments, ownership, flood information, market context, and underwriting. Then it grades properties based on the strategy I’m actually looking for.</p>
            <p>The financing side can compare traditional structures with things like seller financing, subject-to, and hybrids. I kept the financing math deterministic instead of asking the AI to do it, while the AI helps organize the property research and explain the tradeoffs between different structures.</p>
            <p>I didn’t want one generic &ldquo;good deal&rdquo; score, because a property that makes sense for one strategy could make no sense for another, so I wanted the ranking to stay tied to the way I’m actually trying to invest.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT GOT HARD</span><h2>AI CAN SOUND CERTAIN WHEN THE DATA ISN&apos;T.</h2></div>
          <div className="caseStack">
            <p>The hard part was pulling a lot of different kinds of data together without making the result look more certain than it really was.</p>
            <p>I also had to separate what I actually know from what the tool is estimating. A county assessment comes from a source, while rent, mortgage balance, seller motivation, or a financing scenario can be estimates, and I wanted those to look different because an AI can sound very confident even when the assumptions underneath it are weak.</p>
            <p>The other hard part was the interface. There are so many ways I could have shown the data that it was easy to make something powerful but impossible to understand. I spent a lot of time trying to make the map and property view feel clean instead of like a giant spreadsheet.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT IS NOW</span><h2>USEFUL, BUT NOT FINISHED.</h2></div>
          <div className="caseStack">
            <p>This isn’t something I’m trying to turn into a real-estate software company right now. I built it mainly because I wanted the tool for myself and my uncle.</p>
            <p>I’m actually looking for opportunities around Charlottesville, so I expect to keep using and improving it. Right now it’s useful, but there are still parts of the data, scoring, and workflow I want to finish before I would call it done.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
