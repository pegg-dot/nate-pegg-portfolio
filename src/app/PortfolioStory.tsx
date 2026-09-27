"use client";

import Image from "next/image";
import Link from "next/link";
import HandwrittenName from "./components/HandwrittenName";
import ScrollTrace from "./components/ScrollTrace";
import TigreEgg from "./components/TigreEgg";

const workbench = [
  { title: "LOT", origin: "My uncle said he could help me learn real estate, so I built a workspace I could actually use.", meta: "parcel data · underwriting · owner research", href: "/work/lot" },
  { title: "WebBuddy", origin: "I wanted salon websites to go from setup to something usable without a week of back-and-forth.", meta: "onboarding · templates · integrations" },
  { title: "NPGKTrades", origin: "I knew the trader. I wanted to mirror the trade relative to bankroll instead of blindly copying the dollar amount.", meta: "detect · size · risk-check · execute", href: "/work/npgktrades" },
  { title: "Say No To Plastic", origin: "The job was turning dense papers and scattered headlines into something a normal person could actually explore.", meta: "research communication · 3D anatomy · guides", href: "/work/say-no-to-plastic" },
  { title: "UVA Spatial OS", origin: "A map can look right and still route you wrong. I wanted the campus system to care about the actual path, door and schedule.", meta: "GIS · entrances · routing truth", href: "https://github.com/pegg-dot/uva-spatial-os" },
  { title: "HOOS Moving", origin: "This one is still changing enough that I do not want to pretend I know the final story yet.", meta: "UVA · in progress" },
];

export default function PortfolioStory() {
  return (
    <main className="portfolioMain">
      <ScrollTrace />
      <div className="paperNoise" aria-hidden="true" />

      <section className="hero" id="top">
        <div className="heroChrome"><span>NATE PEGG / 2026</span><span>SCROLL</span></div>
        <div className="heroSticky"><HandwrittenName /></div>
        <nav className="heroNav" aria-label="Primary">
          <a href="#work">work</a><a href="#draw">drawings</a><a href="#row">rowing</a><a href="#about">about</a><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">github ↗</a>
        </nav>
      </section>

      <section className="chapterIntro" id="work">
        <span className="microLabel">THINGS I KEEP PULLING ON</span>
        <h2>I usually start because<br/>something does not make sense yet.</h2>
        <p>The projects are different. The pattern is not.</p>
      </section>

      <section className="dellaStorySection">
        <div className="sectionRail"><span>01</span><span>DELLA</span><span>MAR 11 → NOW</span></div>
        <div className="storyHeroGrid">
          <div><span className="microLabel">THE QUESTION</span><h2>What if the person answering the phone actually remembered?</h2></div>
          <div className="storySide"><p>I started after seeing agent systems actually working for people and thinking the gap between a chatbot and an employee was going to collapse fast.</p><p>Miami made nail salons an obvious place to look. They are everywhere, calls get missed, and the owner should not have to be at the desk for the business to keep moving.</p><Link className="underLink" href="/work/della">the whole story →</Link></div>
        </div>

        <div className="pivotNotebook">
          <article><span>MAR 11</span><h3>OpenClaw first.</h3><p>I started by trying to understand how agent systems were put together at all.</p></article>
          <article><span>PIVOT 01</span><h3>Medspas → nail salons.</h3><p>The compliance surface was wrong for what I wanted to learn first.</p></article>
          <article><span>PIVOT 02</span><h3>Everything → communications.</h3><p>I was building way too much at once. Calls, context and follow-up became the thing to harden first.</p></article>
        </div>

        <div className="memoryMoment">
          <div className="memoryLabel"><span className="microLabel">THE MOMENT IT FELT REAL</span><p>Not a benchmark. Just a call that surprised me.</p></div>
          <div className="memoryPhone">
            <div className="memoryTurn me"><b>CALL 1</b><p>I chipped my nail.</p></div>
            <div className="memoryGap">a couple days later</div>
            <div className="memoryTurn della"><b>DELLA</b><p>How&apos;s your chipped nail?</p></div>
          </div>
          <p className="memoryAfter">The point was not the sentence. It was that the next conversation could start where the last one ended.</p>
        </div>

        <div className="currentLine"><span>now</span><b>calls</b><i>+</i><b>Square bookings</b><i>+</i><b>email</b><i>+</i><b>persistent customer context</b><i>+</i><b>tools instead of guesses</b></div>
      </section>

      <section className="vialStorySection">
        <div className="sectionRail dark"><span>02</span><span>VIALGRADE</span><span>LIVE</span></div>
        <div className="storyHeroGrid vialStoryGrid">
          <div><span className="microLabel">THE QUESTION</span><h2>How do you know what&apos;s legit when every site says it is?</h2></div>
          <div className="storySide"><p>Peptide shopping felt backwards to me. The thing that mattered most was the hardest thing to inspect: where a claim came from, whether the lab evidence matched it, and what was still unknown.</p><p>So I built the evidence layer I wished existed.</p><Link className="underLink" href="/work/vialgrade">inside VialGrade →</Link></div>
        </div>

        <div className="evidenceDesk">
          <div className="sourceScrap s1"><span>vendor page</span><b>99.4% purity</b><small>updated?</small></div>
          <div className="sourceScrap s2"><span>COA</span><b>lot #A17</b><small>who tested it?</small></div>
          <div className="sourceScrap s3"><span>lab result</span><b>source-linked</b><small>date + compound</small></div>
          <div className="sourceArrow">→</div>
          <div className="sourceAnswer"><span>VIALGRADE</span><b>show the evidence</b><small>and show uncertainty too</small></div>
        </div>

        <div className="smallWin"><span className="microLabel">SMALL THING I LIKED</span><p>Three accounts I do not recognize signed up. That was much cooler to me than watching an analytics number go up.</p></div>
        <div className="quietFacts"><span>60 baseline compounds</span><span>34 vendors</span><span>201 checked-in lab-result records</span><a href="https://vialgrade.com" target="_blank" rel="noreferrer">vialgrade.com ↗</a></div>
      </section>

      <section className="transformerStorySection">
        <div className="sectionRail light"><span>03</span><span>TRANSFORMER</span><span>FROM SCRATCH</span></div>
        <div className="transformerStoryHero">
          <div className="transformerStoryCopy"><span className="microLabel">THE QUESTION</span><h2>I didn&apos;t want AI to stay a black box.</h2><p>I was learning the pieces anyway: tokens, embeddings, attention, loss, backprop. Building the model forced those ideas to stop being vocabulary and become one system.</p><Link className="underLink lightLink" href="/work/transformer">go inside →</Link></div>
          <div className="transformerVisual"><Image src="/transformer/qkv.webp" alt="Transformer visualizer showing query, key and value projections" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
        </div>
        <div className="learningSequence"><div><span>1</span><b>learn it</b><p>forward pass, attention, training</p></div><div><span>2</span><b>build it</b><p>directly in PyTorch</p></div><div><span>3</span><b>open it up</b><p>capture real intermediate tensors</p></div><div><span>4</span><b>explain it</b><p>turn the internals into a visualizer</p></div></div>
        <div className="quietFacts darkFacts"><span>10.79M parameters</span><span>6 blocks</span><span>6 heads</span><span>5,000 training iterations</span><a href="https://transformer-viz-eight.vercel.app" target="_blank" rel="noreferrer">live visualizer ↗</a></div>
      </section>

      <section className="workbenchStorySection">
        <div className="sectionRail"><span>04</span><span>OTHER THINGS</span><span>WHERE THEY STARTED</span></div>
        <div className="workbenchStoryIntro"><span className="microLabel">THE REST OF THE DESK</span><h2>Most of these started with a very specific itch.</h2></div>
        <div className="originList">
          {workbench.map((project, i) => {
            const body = <><span className="originNum">0{i + 4}</span><div><h3>{project.title}</h3><p>{project.origin}</p><small>{project.meta}</small></div><span className="originArrow">{project.href ? "↗" : "…"}</span></>;
            if (!project.href) return <div key={project.title} className="originRow pending">{body}</div>;
            if (project.href.startsWith("/")) return <Link key={project.title} className="originRow" href={project.href}>{body}</Link>;
            return <a key={project.title} className="originRow" href={project.href} target="_blank" rel="noreferrer">{body}</a>;
          })}
        </div>
      </section>

      <section className="artSection" id="draw">
        <div className="sectionRail"><span>10</span><span>MADE BY HAND</span><span>GRAPHITE / COLOR</span></div>
        <div className="artLead"><h2>THE LINE<br/>LEAVES<br/>THE SCREEN.</h2><p>I drew long before I built software. I still like making something where every mark is mine and there is no undo button.</p></div>
        <div className="artWall">
          <figure className="artPiece p1"><Image src="/art/bob-marley.jpg" alt="Graphite portrait drawing" fill sizes="40vw" /><figcaption>graphite portrait</figcaption></figure>
          <figure className="artPiece p2"><Image src="/art/coke-can.jpg" alt="Drawing of a crushed Coca-Cola can" fill sizes="30vw" /><figcaption>colored pencil</figcaption></figure>
          <figure className="artPiece p3"><Image src="/art/dog-scarf.jpg" alt="Graphite dog portrait" fill sizes="35vw" /><figcaption>commission portrait</figcaption></figure>
          <figure className="artPiece p4"><Image src="/art/house.jpg" alt="Architectural graphite drawing of a house" fill sizes="48vw" /><figcaption>architecture study</figcaption></figure>
          <figure className="artPiece p5"><Image src="/art/moose.jpg" alt="Graphite moose drawing" fill sizes="32vw" /><figcaption>graphite</figcaption></figure>
          <figure className="artPiece p6"><Image src="/art/miami.jpg" alt="Color drawing collage of Miami" fill sizes="35vw" /><figcaption>Miami</figcaption></figure>
        </div>
      </section>

      <section className="rowingSection" id="row">
        <div className="rowingImage"><Image src="/rowing/race-close.jpg" alt="Nate Pegg racing for Team USA in the U19 men's double" fill sizes="100vw" /></div>
        <div className="rowingOverlay">
          <div className="sectionRail onPhoto"><span>11</span><span>ROWING</span><span>2024</span></div>
          <div className="rowingStory"><span className="microLabel">SPRING → SUMMER → GENOA</span><h2>THE SUMMER I<br/>ENDED UP IN<br/>A USA UNIFORM.</h2><p>Spring crew turned into beach-sprint trials at South Lido Key. We qualified. School ended, practice kept going, and the next few months were mostly mornings on the water until Worlds in Genoa.</p><div className="rowingFacts"><span>South Lido Key</span><b>1st at Trials</b><span>U19 Men&apos;s Double</span><span>Genoa</span></div></div>
        </div>
        <div className="rowingInset"><Image src="/rowing/race-wide.jpg" alt="Team USA U19 double racing off the beach" fill sizes="35vw" /></div>
      </section>

      <section className="aboutSection" id="about">
        <div className="aboutGrid">
          <div><span className="microLabel">OTHER EVIDENCE OF A PERSON</span><h2>NOT JUST<br/>THE PROJECTS.</h2></div>
          <div className="aboutNotes"><p>Miami → UVA.</p><p>Builder, rower, artist.</p><p className="oddNote">At four or five I owned multiple copies of the same red-and-blue striped shirt with a green alien on it and wore it almost every day.</p><TigreEgg /></div>
        </div>
      </section>

      <footer className="siteFooter">
        <div><span>NATE PEGG</span><span>2026</span></div>
        <div><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:nate@natepegg.com">Email ↗</a><a href="#top">Top ↑</a></div>
      </footer>
    </main>
  );
}
