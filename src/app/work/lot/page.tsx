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
        { label: "WHAT", text: "A Charlottesville-first map and research workspace that ranks properties against my own real-estate thesis." },
        { label: "WHY", text: "There is a ridiculous amount of public and market data around a property. I wanted AI to help compress that into something I could actually use." },
        { label: "HOW", text: "It combines parcel, zoning, assessment, ownership, flood, market, and underwriting data, then scores each property against an explicit thesis and financing rules." },
        { label: "WHEN", text: "Built in 2026 at UVA. It is useful now, but still unfinished and something I am building mainly for myself and my uncle." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT CAME FROM</span><h2>I WANTED TO COMPRESS THE RESEARCH.</h2></div>
          <div className="caseStack">
            <p>My uncle had moved from construction into real-estate development around Charlottesville, and I was interested in finding properties we could hold, rent, or otherwise structure into good deals around UVA.</p>
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
            <p>LOT pulls together public parcel data, zoning, assessments, ownership, flood information, market context, and underwriting. Then it grades properties based on the strategy I am actually looking for.</p>
            <p>The financing side can compare traditional structures with things like seller financing, subject-to, and hybrids. The math stays deterministic, while the AI is there to help organize the reasoning and explain the tradeoffs.</p>
            <p>The point is not a universal &ldquo;good deal&rdquo; score. A property can be good for one thesis and useless for another, so I wanted the ranking to always be tied back to what I am actually trying to do.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT GOT HARD</span><h2>AI CAN SOUND CERTAIN WHEN THE DATA ISN&apos;T.</h2></div>
          <div className="caseStack">
            <p>The hard part was pulling a lot of different kinds of data together without making the result look more certain than it really was.</p>
            <p>A county assessment is a sourced fact. An estimated rent, mortgage balance, seller motivation, or financing scenario is a model. I wanted those to look different because an AI can give you a very confident answer even when the assumptions underneath it are weak.</p>
            <p>The other hard part was the interface. There are so many ways I could have shown the data that it was easy to make something powerful but impossible to understand. I spent a lot of time trying to make the map and property view feel clean instead of like a giant spreadsheet.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT IS NOW</span><h2>USEFUL, BUT NOT FINISHED.</h2></div>
          <div className="caseStack">
            <p>This is not something I am trying to turn into a real-estate software company right now. I built it mainly because I wanted the tool for myself and my uncle.</p>
            <p>I am actually looking for opportunities around Charlottesville, so I expect to keep using and improving it. Right now it is useful, but there are still parts of the data, scoring, and workflow I want to finish before I would call it done.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
