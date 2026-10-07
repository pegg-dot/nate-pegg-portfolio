"use client";

import Image from "next/image";
import Link from "next/link";
import HandwrittenName from "./components/HandwrittenName";
import ScrollTrace from "./components/ScrollTrace";

const workbench = [
  { title: "LOT", what: "Real-estate acquisition workspace for finding, underwriting and tracking opportunities.", origin: "My uncle said he could help me learn real estate, so I built the workspace I wanted beside me.", meta: "parcel data · underwriting · owner research", href: "/work/lot", action: "story" },
  { title: "WeBuddy", what: "Salon website system that turns public business data and a short owner onboarding into a structured, editable site.", origin: "I built it partly as a way to get my foot in the door with salon owners, then the hard problem became formalizing the business once across reusable templates.", meta: "Google listing import · 96-field model · templates", href: "/work/webuddy", action: "story" },
  { title: "NPGKTrades", what: "Polymarket copy-trading system with bankroll-relative sizing and deterministic risk gates.", origin: "I knew the trader. I wanted to mirror the allocation instead of blindly copying the dollar amount.", meta: "detect · aggregate · size · risk · execute", href: "/work/npgktrades", action: "story" },
  { title: "Say No To Plastic", what: "Interactive microplastics education site built around evidence, anatomy and practical guides.", origin: "The job was turning dense papers and scattered headlines into something a normal person could actually explore.", meta: "research communication · 3D anatomy · guides", href: "/work/say-no-to-plastic", action: "story" },
  { title: "UVA Spatial OS", what: "Campus routing system where GIS, entrances and pedestrian truth matter more than a plausible-looking line.", origin: "A map can look right and still route you wrong.", meta: "GIS · entrances · routing truth", href: "https://github.com/pegg-dot/uva-spatial-os", action: "code" },
  { title: "MoveMate", what: "Move-in and move-out help for UVA students, with a student marketplace underneath it.", origin: "We started with a marketplace, mapped roughly 20 assumptions, and realized moving itself was the sharper problem to solve first.", meta: "UVA · moving help · marketplace backbone", href: "/work/movemate", action: "story" },
];

export default function PortfolioStory() {
  return (
    <main className="portfolioMain">
      <ScrollTrace />
      <div className="paperNoise" aria-hidden="true" />

      <section className="hero" id="top">
        <div className="heroChrome"><span>NATE PEGG / 2026</span><span>SCROLL</span></div>
        <div className="heroSticky"><HandwrittenName /></div>
        <div className="heroIntro"><p>I build software, draw, and row.</p><span>RIGHT NOW: DELLA · VIALGRADE · MOVEMATE · UVA SPATIAL OS</span></div>
        <nav className="heroNav" aria-label="Primary">
          <a href="#work">work</a><a href="#draw">drawings</a><a href="#row">rowing</a><a href="#about">about</a><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">github ↗</a>
        </nav>
      </section>

      <section className="chapterIntro" id="work">
        <span className="microLabel">THINGS I KEEP PULLING ON</span>
        <h2>I usually start because<br/>something does not make sense yet.</h2>
        <p>The projects are different. The pattern is not.</p>
      </section>

      <section className="dellaStorySection projectSpotlight">
        <div className="sectionRail"><span>01</span><span>DELLA</span><span>MAR 11 → NOW</span></div>
        <div className="projectDefinition">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="della">Della is an AI employee for nail salons.</strong> It answers calls, remembers customers across conversations, checks live availability, creates real appointments in Square, and is being hardened around communications first.</p>
          <div className="projectActions"><Link href="/work/della">READ THE STORY →</Link><a href="https://hellodella.com" target="_blank" rel="noreferrer">OPEN DELLA ↗</a></div>
        </div>
        <div className="spotlightGrid">
          <div className="spotlightImage"><Image src="/della/room-identity.png" alt="Della workspace showing the AI employee's permissions, activity and state" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
          <div className="spotlightText"><span className="microLabel">WHY I STARTED</span><h2>Calls felt like a good place to find out whether an agent could actually behave like an employee.</h2><p>I started on March 11 after seeing agent systems work for real people. Miami made nail salons an obvious place to look: they are everywhere, missed calls matter, and the owner cannot always be at the desk.</p><div className="spotlightChips"><span>voice</span><span>persistent context</span><span>Square bookings</span><span>knowledge + tools</span></div></div>
        </div>
      </section>

      <section className="vialStorySection projectSpotlight">
        <div className="sectionRail dark"><span>02</span><span>VIALGRADE</span><span>LIVE</span></div>
        <div className="projectDefinition">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="vial">VialGrade is an evidence-backed research platform for the peptide market.</strong> It brings compounds, vendors, lab results, source history, conflicts and uncertainty into one place so a claim can be inspected instead of just trusted.</p>
          <div className="projectActions"><Link href="/work/vialgrade">READ THE STORY →</Link><a href="https://vialgrade.com" target="_blank" rel="noreferrer">OPEN VIALGRADE ↗</a><a href="https://github.com/pegg-dot/vial" target="_blank" rel="noreferrer">CODE ↗</a></div>
        </div>
        <div className="spotlightGrid reverse">
          <div className="spotlightImage vialPreview"><Image src="/vialgrade/home.jpg" alt="VialGrade homepage and search interface" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
          <div className="spotlightText"><span className="microLabel">WHY I STARTED</span><h2>Every site could say it was legitimate. I wanted somewhere the evidence mattered more than the claim.</h2><p>The interesting part became provenance: where a result came from, what it actually supported, and what was still unknown.</p><div className="spotlightChips"><span>vendors</span><span>compounds</span><span>lab evidence</span><span>source history</span></div></div>
        </div>
      </section>

      <section className="transformerStorySection projectSpotlight">
        <div className="sectionRail light"><span>03</span><span>TRANSFORMER</span><span>FROM SCRATCH</span></div>
        <div className="projectDefinition projectDefinitionDark">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="transformer">A GPT-style transformer built and trained from scratch in PyTorch.</strong> I instrumented its forward pass, captured the real intermediate tensors, and built a browser visualizer around what the model was actually doing.</p>
          <div className="projectActions"><Link href="/work/transformer">READ THE STORY →</Link><a href="https://transformer-viz-eight.vercel.app" target="_blank" rel="noreferrer">OPEN VISUALIZER ↗</a><a href="https://github.com/pegg-dot/Transformer" target="_blank" rel="noreferrer">CODE ↗</a></div>
        </div>
        <div className="spotlightGrid">
          <div className="spotlightImage transformerPreview"><Image src="/transformer/qkv.webp" alt="Transformer visualizer showing query, key and value projections" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
          <div className="spotlightText spotlightTextLight"><span className="microLabel">WHY I STARTED</span><h2>I did not want AI to stay a black box I could only describe from the outside.</h2><p>Building the model forced tokens, attention, residuals, logits, loss and backprop to become one mechanism instead of a list of concepts.</p><div className="spotlightChips"><span>10.79M params</span><span>6 blocks</span><span>6 heads</span><span>real activations</span></div></div>
        </div>
      </section>

      <section className="workbenchStorySection">
        <div className="sectionRail"><span>04</span><span>OTHER THINGS</span><span>THE REST OF THE DESK</span></div>
        <div className="workbenchStoryIntro"><span className="microLabel">MORE BUILDS</span><h2>Most started with a very specific itch.</h2></div>
        <div className="originList">
          {workbench.map((project, i) => {
            const body = <><span className="originNum">0{i + 4}</span><div><h3>{project.title}</h3><p className="originWhat">{project.what}</p><p className="originWhy"><span>why:</span> {project.origin}</p><small>{project.meta}</small></div><span className="originArrow">{project.action === "story" ? "story →" : project.action === "code" ? "code ↗" : project.action === "live" ? "live ↗" : "soon"}</span></>;
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
          <figure className="artPiece p2" data-pencil-target="art"><Image src="/art/coke-can.jpg" alt="Drawing of a crushed Coca-Cola can" fill sizes="30vw" /><figcaption>colored pencil</figcaption></figure>
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
          <div className="rowingStory"><span className="microLabel">SPRING → SUMMER → GENOA</span><h2>THE SUMMER I<br/>ENDED UP IN<br/><span data-pencil-target="rowing">A USA UNIFORM.</span></h2><p>Spring crew turned into beach-sprint trials at South Lido Key. We qualified. School ended, practice kept going, and the next few months were mostly mornings on the water until Worlds in Genoa.</p><div className="rowingFacts"><span>South Lido Key</span><b>1st at Trials</b><span>U19 Men&apos;s Double</span><span>Genoa</span></div></div>
        </div>
        <div className="rowingWideFrame"><Image src="/rowing/race-wide.jpg" alt="Team USA U19 double racing off the beach" fill sizes="100vw" /><span>U19 MEN&apos;S DOUBLE · TEAM USA</span></div>
      </section>

      <section className="aboutSection" id="about">
        <div className="aboutLead"><span className="microLabel">ABOUT ME, WITHOUT TURNING THIS INTO A RÉSUMÉ</span><h2>THE PROJECTS ARE<br/>ONLY PART OF IT.</h2></div>

        <div className="aboutPortraitGrid">
          <div className="aboutPortrait"><Image src="/rowing/race-close.jpg" alt="Nate Pegg rowing for Team USA" fill sizes="(max-width: 900px) 100vw, 46vw" /></div>
          <div className="aboutIntro">
            <span className="microLabel">I&apos;M NATE.</span>
            <p>I grew up in Miami and I&apos;m now a first-year at UVA. I build software, draw, and row. Most of the projects on this site started because I got stuck on something and wanted to understand it by making the thing myself.</p>
            <p>I care a lot about the mechanism underneath whatever I&apos;m using. That is basically why the Transformer exists, and it is also why Della turned into a much bigger lesson in tools, state, memory, checks, and what an agent can actually be trusted to do.</p>
            <div className="aboutNow">
              <span>RIGHT NOW</span>
              <b>Della</b>
              <b>VialGrade</b>
              <b>MoveMate</b>
              <b>UVA Spatial OS</b>
            </div>
            <small>Genoa, 2024 · Team USA U19 coastal rowing.</small>
          </div>
        </div>

        <div className="aboutCards">
          <article><span>01 / HOME</span><h3>Miami → UVA</h3><p>I went to Ransom Everglades in Miami and now I&apos;m at UVA. A lot of what I build still starts with something I saw around me first.</p></article>
          <article><span>02 / THE SHIRT</span><h3>Apparently one shirt was enough.</h3><p>When I was four or five I had two or three copies of the same red-and-blue striped shirt with a little green alien on it. I wore it nearly every day.</p></article>
          <article><span>03 / TIGRE</span><h3 data-pencil-target="about">It was a giraffe.</h3><p>I used to sleep with a tiny giraffe blanket over my ear. I called it Tigre, even though tigre means tiger and the thing was very obviously a giraffe.</p></article>
          <article><span>04 / STILL TRUE</span><h3>I like making things by hand.</h3><p>I drew long before I wrote code. I still like the fact that a drawing has no undo button and every mark is actually there because I put it there.</p></article>
        </div>
      </section>

      <footer className="siteFooter">
        <div><span>NATE PEGG</span><span>2026</span></div>
        <div><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:nate@natepegg.com">Email ↗</a><a href="#top">Top ↑</a></div>
      </footer>
    </main>
  );
}