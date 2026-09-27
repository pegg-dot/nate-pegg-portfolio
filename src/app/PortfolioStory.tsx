"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  { title: "DELLA", tag: "AI operator for nail salons", meta: "Mar 11, 2026 → now", href: "https://hellodella.com", tone: "ink" },
  { title: "VIALGRADE", tag: "Evidence-backed peptide market intelligence", meta: "897 page views · 1,264 vendor clicks / 90d", href: "https://vialgrade.com", tone: "blue" },
  { title: "TRANSFORMER", tag: "10.79M parameters, built from scratch", meta: "PyTorch · attention · activations", href: "https://github.com/pegg-dot/Transformer", tone: "graphite" },
  { title: "LOT", tag: "Real-estate acquisition research system", meta: "public data · underwriting · decisions", href: "https://github.com/pegg-dot/real-estate-platform", tone: "sand" },
];

export default function PortfolioStory() {
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(1);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduced = () => setReduced(media.matches);
    updateReduced();
    media.addEventListener("change", updateReduced);
    return () => media.removeEventListener("change", updateReduced);
  }, []);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(next);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const offset = length * (1 - Math.min(1, progress * 1.12));
  const nameReady = reduced || progress > 0.025;

  return (
    <main>
      <div className="paperNoise" aria-hidden="true" />
      <svg className="storyLine" viewBox="0 0 1000 6200" preserveAspectRatio="none" aria-hidden="true">
        <path
          ref={pathRef}
          d="M 520 20 C 470 130 565 190 505 285 C 455 360 430 440 470 525 C 515 620 620 660 680 730 C 740 800 680 905 570 930 C 445 960 280 915 225 1030 C 180 1125 250 1190 360 1215 C 520 1250 665 1190 730 1320 C 785 1430 690 1510 560 1540 C 400 1575 285 1650 300 1790 C 315 1930 500 1960 590 2040 C 680 2120 635 2235 500 2280 C 360 2325 250 2420 280 2550 C 315 2700 510 2710 650 2810 C 760 2890 740 3040 610 3120 C 500 3190 330 3180 290 3320 C 250 3465 390 3520 520 3560 C 680 3610 735 3720 680 3860 C 625 4010 445 4040 350 4140 C 255 4240 300 4380 430 4450 C 560 4520 705 4525 735 4660 C 770 4810 625 4885 500 4960 C 350 5050 320 5210 410 5310 C 500 5410 690 5415 720 5570 C 750 5720 600 5800 500 5900 C 450 5950 430 6030 455 6170"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: length, strokeDashoffset: offset }}
        />
      </svg>

      <section className="hero sectionTall">
        <div className="heroPrompt">scroll to draw</div>
        <div className={`nameReveal ${nameReady ? "visible" : ""}`}>
          <span className="eyebrow">builder · artist · rower</span>
          <h1>NATE<br />PEGG</h1>
          <p className="heroNote">The line keeps going.</p>
        </div>
      </section>

      <section className="projectSection projectDella">
        <div className="sectionIndex">01 / BUILD</div>
        <div className="projectHead">
          <h2>DELLA</h2>
          <p>AI operator for nail salons.</p>
        </div>
        <div className="traceCard">
          <span>CALL</span><i>→</i><span>CONTEXT</span><i>→</i><span>TOOL</span><i>→</i><span>ACTION</span><i>→</i><span>RECEIPT</span>
        </div>
        <div className="evidenceStrip">
          <strong>REAL TEST CALL</strong>
          <span>checked live availability twice</span>
          <span>booked Nail Repair · Thu 4:30 PM</span>
          <span>Square appointment created</span>
        </div>
        <a className="projectLink" href="https://hellodella.com" target="_blank" rel="noreferrer">OPEN DELLA ↗</a>
      </section>

      <section className="projectSection projectVial">
        <div className="sectionIndex">02 / VERIFY</div>
        <div className="projectHead">
          <h2>VIALGRADE</h2>
          <p>Evidence before storefront polish.</p>
        </div>
        <div className="metricGrid">
          <div><strong>897</strong><span>page views / 90d</span></div>
          <div><strong>1,264</strong><span>vendor clicks / 90d</span></div>
          <div><strong>60</strong><span>baseline compounds</span></div>
          <div><strong>34</strong><span>baseline vendors</span></div>
        </div>
        <a className="projectLink" href="https://vialgrade.com" target="_blank" rel="noreferrer">OPEN VIALGRADE ↗</a>
      </section>

      <section className="projectSection projectTransformer">
        <div className="sectionIndex">03 / UNDERSTAND</div>
        <div className="projectHead">
          <h2>TRANSFORMER</h2>
          <p>I did not want the model to stay a black box.</p>
        </div>
        <div className="tokenRail"><span>token</span><span>embedding</span><span>Q K V</span><span>attention</span><span>logits</span></div>
        <a className="projectLink" href="https://github.com/pegg-dot/Transformer" target="_blank" rel="noreferrer">VIEW REPO ↗</a>
      </section>

      <section className="buildShelf">
        <div className="sectionIndex">04 / KEEP BUILDING</div>
        <div className="shelfGrid">
          {projects.slice(3).map((project) => (
            <a key={project.title} className="shelfCard" href={project.href} target="_blank" rel="noreferrer">
              <span>{project.meta}</span><h3>{project.title}</h3><p>{project.tag}</p>
            </a>
          ))}
          {[
            ["WEBBUDDY", "Salon website generator"],
            ["NPGKTRADES", "Deterministic copy-trading system"],
            ["SAY NO TO PLASTIC", "Interactive science + book experience"],
            ["UVA SPATIAL OS", "Campus routing + spatial truth"],
            ["HOOS MOVING", "coming in"],
          ].map(([title, tag]) => <div className="shelfCard muted" key={title}><span>IN THE WORKBENCH</span><h3>{title}</h3><p>{tag}</p></div>)}
        </div>
      </section>

      <section className="artSection">
        <div className="sectionIndex">05 / MADE BY HAND</div>
        <h2>THE LINE<br />LEAVES THE SCREEN.</h2>
        <p className="placeholderNote">Original graphite, charcoal, colored pencil, commissions. Scans coming next.</p>
        <div className="paperFrames"><div /><div /><div /></div>
      </section>

      <section className="rowingSection">
        <div className="sectionIndex">06 / MOVE</div>
        <div>
          <h2>TEAM USA</h2>
          <p>U19 Men&apos;s Double · Beach Sprint National Team · 2024</p>
          <div className="rowingFacts"><span>South Lido Key</span><span>2:50.4</span><span>1st at Trials</span><span>Genoa</span></div>
        </div>
      </section>

      <section className="footerSection">
        <p>Built by Nate Pegg.</p>
        <div><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:nate@natepegg.com">Email ↗</a></div>
      </section>
    </main>
  );
}
