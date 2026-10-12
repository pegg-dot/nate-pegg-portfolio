import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ApprovalDemo, BookingDemo, DellaMark, Icon } from "./DellaScenes";
import copy from "./story-copy.json";
import s from "./della.module.css";

export const metadata: Metadata = {
  title: "Della | Nate Pegg",
  description: "Why I'm building an AI employee for nail salons, what it does on a call, and what I've learned getting it to actually do the work.",
};

export default function DellaCase() {
  return <main className={s.page} id="main-content" tabIndex={-1} data-della-edition="reader-first">
    <nav className={s.nav} aria-label="Project navigation"><Link href="/"><Icon name="back" size={15} /> Nate Pegg</Link><span>01 / Della</span><a href="https://hellodella.com" target="_blank" rel="noreferrer">Visit Della <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></nav>

    <header className={s.hero}>
      <div className={s.heroCopy}>
        <p className={s.kicker}>An AI employee for nail salons</p>
        <h1><DellaMark /> Della</h1>
        <p className={s.lede}>{copy.intro}</p>
        <p className={s.coverage}>{copy.coverage}</p>
        <a className={s.storyLink} href="#why">Why I&apos;m building it <Icon name="arrow" size={16} /></a>
        <span className={s.since}>Building since March 11, 2026</span>
      </div>
      <BookingDemo />
    </header>

    <section className={`${s.section} ${s.whySection}`} id="why" aria-labelledby="why-title">
      <div className={s.sectionTitle}><h2 id="why-title">Why I started<br />with calls.</h2></div>
      <div className={s.prose}>{copy.why.map(p => <p key={p}>{p}</p>)}</div>
    </section>

    <section className={`${s.section} ${s.buildSection}`} id="build" aria-labelledby="build-title">
      <div className={s.buildStory}><h2 id="build-title">It had to actually<br />book the appointment.</h2><div className={s.prose}><p>{copy.bookingProblem}</p><p>{copy.sources}</p></div></div>
      <div className={s.sources}>
        <p className={s.sourcesIntro}>Where each answer comes from</p>
        <div className={s.sourceRow}><p>What&apos;s your cancellation policy?</p><div><span className={s.sourceArrow} aria-hidden="true">&#8627;</span><span>The salon&apos;s saved policy</span></div></div>
        <div className={s.sourceRow}><p>Is 4:30 open?</p><div><span className={s.sourceArrow} aria-hidden="true">&#8627;</span><span>The current booking calendar</span></div></div>
        <details className={s.technicalNote}><summary>What I built around the model <span aria-hidden="true">+</span></summary><p>{copy.technical}</p></details>
      </div>
    </section>

    <section className={`${s.section} ${s.memorySection}`} id="memory" aria-labelledby="memory-title">
      <div className={s.memoryHeading}><h2 id="memory-title">It remembered<br />my chipped nail.</h2><p className={s.memoryCaption}>My own test calls, described from memory.</p></div>
      <div className={s.memoryStory}>
        <div className={s.memoryLine}><span>First call</span><p>{copy.memoryFirst}</p></div>
        <div className={s.memoryLine}><span>A couple days later</span><p>{copy.memorySecond}</p></div>
        <p className={s.memoryReflection}>{copy.memoryReflection}</p>
      </div>
    </section>

    <section className={`${s.section} ${s.ownerSection}`} id="control" aria-labelledby="owner-title">
      <div className={s.ownerStory}><h2 id="owner-title">The owner decides<br />what it can do.</h2><div className={s.prose}><p>{copy.control}</p><p>{copy.controlExample}</p></div></div>
      <ApprovalDemo />
    </section>

    <section className={`${s.section} ${s.workspaceSection}`} aria-labelledby="workspace-title">
      <div><h2 id="workspace-title">What the owner sees.</h2><p className={s.workspaceIntro}>{copy.workspace}</p></div>
      <figure className={s.workspaceFigure}>
        <a href="/della/workspace-context.webp" target="_blank" rel="noreferrer" className={s.workspaceLink}>
          <Image src="/della/workspace-controls-398a69c78f.webp" alt="Detail of Della's earlier owner controls, showing which actions need approval" width={1165} height={280} sizes="(max-width: 720px) 100vw, 1100px" />
          <span className={s.fullScreenshot}>Open the full screenshot <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></span>
        </a>
        <figcaption>An earlier screen, with identifying details removed. These aren&apos;t live usage numbers.</figcaption>
      </figure>
    </section>

    <section className={`${s.section} ${s.currentSection}`} id="now" aria-labelledby="current-title">
      <div className={s.currentHeading}><h2 id="current-title">What I&apos;m<br />working on now.</h2><a href="https://hellodella.com" target="_blank" rel="noreferrer" className={s.externalLink}>Visit Della <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></div>
      <div className={s.prose}><p>{copy.current}</p><p>{copy.latency}</p><p>{copy.direction}</p></div>
    </section>
    <footer className={s.footer}><Link href="/"><Icon name="back" size={16} /> Back to my work</Link><Link href="/work/vialgrade">VialGrade <Icon name="arrow" size={16} /></Link></footer>
    <noscript><style>{`[data-interactive="true"]{display:none!important}`}</style></noscript>
  </main>;
}
