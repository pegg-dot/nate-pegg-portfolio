"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollTrace from "./components/ScrollTrace";
import TigreEgg from "./components/TigreEgg";
import { projects } from "./data/projects";

const shelf = projects.slice(3);

export default function PortfolioStory() {
  return (
    <main className="portfolioMain">
      <ScrollTrace />
      <div className="paperNoise" aria-hidden="true" />

      <section className="hero" id="top">
        <div className="heroChrome"><span>PORTFOLIO / 2026</span><span>SCROLL TO DRAW</span></div>
        <div className="heroName" aria-label="Nate Pegg">
          <div className="heroNameMask"><h1>NATE</h1></div>
          <div className="heroNameMask second"><h1>PEGG</h1></div>
        </div>
        <nav className="heroNav" aria-label="Primary">
          <a href="#work">work</a><a href="#draw">drawings</a><a href="#row">rowing</a><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">github ↗</a>
        </nav>
      </section>

      <section className="dellaSection" id="work">
        <div className="sectionRail"><span>01</span><span>DELLA</span><span>MAR 11 → NOW</span></div>
        <div className="dellaIntro">
          <div><span className="microLabel">CURRENT FOCUS</span><h2>ONE THING<br/>HARDENED.</h2></div>
          <div className="dellaIntroCopy"><p>AI operator for nail salons.</p><p className="mutedCopy">Calls first. Communications before everything else.</p><Link className="underLink" href="/work/della">open the build →</Link></div>
        </div>

        <div className="callArtifact">
          <div className="callTop"><div><span className="liveDot" />REAL TEST CALL</div><div>41 turns · 7:37</div></div>
          <div className="callBody">
            <aside className="checkedPanel">
              <span className="microLabel">DELLA CHECKED</span>
              <strong>Nail Repair</strong>
              <p>Thu, Jul 30 · 4:30 PM</p>
              <ol>
                <li><b>10:22</b><span>checked availability · Aug 1</span></li>
                <li><b>10:23</b><span>checked availability · Jul 30</span></li>
                <li><b>10:26</b><span>created Square booking</span></li>
                <li><b>10:27</b><span>created booking again</span></li>
              </ol>
            </aside>
            <div className="transcriptPanel">
              <div className="turn caller"><b>CALLER · 2:46</b><p>Why is the latest four thirty PM? Are you a hundred percent sure?</p></div>
              <div className="turn della"><b>DELLA</b><p>You&apos;re right to push back — let me double-check that for you.</p><em>↳ tool call: availability</em></div>
              <div className="turn caller"><b>CALLER · 3:25</b><p>You booked me for six PM Monday. Now you&apos;re telling me you close at five on Thursday. Did you just mess up there?</p></div>
              <div className="turn annotation"><span>42s dead air here</span><span>source conflict</span></div>
              <div className="turn caller"><b>CALLER · 6:07</b><p>Mia isn&apos;t an actual technician. I was just testing you.</p></div>
              <div className="turn annotation"><span>verify provider before promise</span><span>post-action state check</span></div>
            </div>
          </div>
          <div className="callLesson"><span>CALL</span><i>→</i><span>CONTEXT</span><i>→</i><span>POLICY / RAG</span><i>→</i><span>LIVE TOOL</span><i>→</i><span>ACTION</span><i>→</i><span>VERIFY</span></div>
        </div>
      </section>

      <section className="vialSection">
        <div className="sectionRail dark"><span>02</span><span>VIALGRADE</span><span>LIVE</span></div>
        <div className="vialStage">
          <div className="vialTitle"><span className="microLabel">EVIDENCE LAYER</span><h2>VIAL<br/>GRADE</h2><Link className="underLink" href="/work/vialgrade">inspect the system →</Link></div>
          <div className="vialMetrics">
            <div><span>90 DAYS</span><strong>897</strong><small>page views</small></div>
            <div><span>90 DAYS</span><strong>1,264</strong><small>vendor clicks</small></div>
            <div><span>BASELINE</span><strong>60</strong><small>compounds</small></div>
            <div><span>BASELINE</span><strong>34</strong><small>vendors</small></div>
          </div>
        </div>
        <div className="provenanceMap" aria-label="VialGrade provenance flow">
          <div className="provNode">vendor listing</div><span>→</span><div className="provNode">lab evidence</div><span>→</span><div className="provNode">source history</div><span>→</span><div className="provNode strong">published claim</div>
          <div className="provNote">201 checked-in Janoshik result records · automated collection stays separate from reviewed state</div>
        </div>
      </section>

      <section className="transformerSection">
        <div className="sectionRail light"><span>03</span><span>TRANSFORMER</span><span>FROM SCRATCH</span></div>
        <div className="transformerHero">
          <div className="transformerCopy"><span className="microLabel">BELOW THE API</span><h2>10.79M</h2><p>parameters I could actually trace.</p><div className="modelStats"><span>6 blocks</span><span>6 heads</span><span>384 dim</span><span>256 ctx</span></div><Link className="underLink lightLink" href="/work/transformer">go inside →</Link></div>
          <div className="transformerVisual"><Image src="/transformer/qkv.webp" alt="Transformer visualizer showing query, key and value projections" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
        </div>
        <div className="tokenFlow"><span>token</span><i>→</i><span>embedding</span><i>→</i><span>Q/K/V</span><i>→</i><span>attention</span><i>→</i><span>residual</span><i>→</i><span>logits</span></div>
      </section>

      <section className="shelfSection">
        <div className="sectionRail"><span>04</span><span>OTHER THINGS</span><span>STILL MOVING</span></div>
        <div className="shelfIntro"><h2>THE WORKBENCH</h2><p>Not everything needs to be finished to be real.</p></div>
        <div className="shelfTape">
          {shelf.map((project, i) => {
            const external = project.href?.startsWith("http");
            const content = <><span className="cardStatus">{project.status}</span><span className="cardNum">0{i + 4}</span><h3>{project.title}</h3><p>{project.kicker}</p><small>{project.meta}</small></>;
            return project.href ? external ? <a key={project.slug} className={`benchCard card${i}`} href={project.href} target="_blank" rel="noreferrer">{content}</a> : <Link key={project.slug} className={`benchCard card${i}`} href={project.href}>{content}</Link> : <div key={project.slug} className={`benchCard card${i} pending`}>{content}</div>;
          })}
        </div>
      </section>

      <section className="artSection" id="draw">
        <div className="sectionRail"><span>05</span><span>MADE BY HAND</span><span>GRAPHITE / COLOR</span></div>
        <div className="artLead"><h2>THE LINE<br/>LEAVES<br/>THE SCREEN.</h2><p>Commission work, portraits, buildings, objects, whatever made me want to sit down and draw it.</p></div>
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
        <div className="rowingImage"><Image src="/rowing/race-close.jpg" alt="Nate Pegg racing for Team USA in the U19 men's double" fill priority={false} sizes="100vw" /></div>
        <div className="rowingOverlay">
          <div className="sectionRail onPhoto"><span>06</span><span>TEAM USA</span><span>2024</span></div>
          <div className="rowingCopy"><h2>PEGG<br/>USA</h2><p>U19 Men&apos;s Double · Beach Sprint National Team</p><div className="rowingFacts"><span>South Lido Key</span><b>2:50.4</b><span>1st at Trials</span><span>Genoa</span><b>2:44.15</b></div></div>
        </div>
        <div className="rowingInset"><Image src="/rowing/race-wide.jpg" alt="Team USA U19 double racing off the beach" fill sizes="35vw" /></div>
      </section>

      <section className="aboutSection">
        <div className="aboutGrid">
          <div><span className="microLabel">ABOUT / DEBRIS</span><h2>STILL<br/>CURIOUS.</h2></div>
          <div className="aboutNotes"><p>University of Virginia.</p><p>Miami.</p><p>Builder, rower, artist.</p><TigreEgg /></div>
        </div>
      </section>

      <footer className="siteFooter">
        <div><span>NATE PEGG</span><span>2026</span></div>
        <div><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:nate@natepegg.com">Email ↗</a><a href="#top">Top ↑</a></div>
      </footer>
    </main>
  );
}
