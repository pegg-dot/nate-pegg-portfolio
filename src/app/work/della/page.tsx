import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ApprovalDemo, BookingDemo, ContextDemo, DellaMark, HeroScene, Icon, MemoryDemo } from "./DellaScenes";
import copy from "./story-copy.json";
import s from "./della.module.css";

export const metadata: Metadata = {
  title: "Della | Nate Pegg",
  description: "Building an AI employee for nail salons. A look at real bookings, customer memory, and the work around the model.",
};

export default function DellaCase() {
  return <main className={s.page} id="main-content" tabIndex={-1}>
    <nav className={s.nav} aria-label="Project navigation"><Link href="/"><Icon name="back" size={15} /> Nate Pegg</Link><span>01 / Della</span><a href="https://hellodella.com" target="_blank" rel="noreferrer">Open Della <span aria-hidden="true">↗</span><span className={s.srOnly}> (opens in a new tab)</span></a></nav>
    <section className={s.hero} aria-labelledby="della-title">
      <div className={s.heroCopy}><span className={s.eyebrow}>An AI employee for nail salons</span><h1 id="della-title"><DellaMark /> Della<span className={s.titlePeriod}>.</span></h1><p className={s.lede}>{copy.intro}</p><div className={s.heroActions}><a href="#booking" className={s.primaryButton}>Follow a booking <Icon name="arrow" size={16} /></a><a href="#origin" className={s.textButton}>How it started</a></div><span className={s.heroDate}>Building since March 11, 2026</span></div>
      <HeroScene />
    </section>
    <nav className={s.chapterNav} aria-label="Inside this project"><span>Inside Della</span><a href="#booking">01 <b>The call</b></a><a href="#memory">02 <b>The memory</b></a><a href="#control">03 <b>Your OK</b></a><a href="#build">04 <b>Behind it</b></a></nav>

    <section className={`${s.section} ${s.origin}`} id="origin" aria-labelledby="origin-title">
      <div className={s.originAside}><span className={s.eyebrow}>Where it started</span><h2 id="origin-title">The model still<br />needs the salon.</h2><div className={s.originTimeline}><span><i />OpenOperator<small>March 11, 2026</small></span><span><i />Nail salons<small>A more focused start</small></span><span><i />Communications<small>The first part to get right</small></span></div></div>
      <div className={s.prose}><p>{copy.originInterest}</p><p>{copy.originContext}</p><p>{copy.originPivot}</p></div>
    </section>

    <section className={`${s.section} ${s.bookingSection}`} id="booking" aria-labelledby="booking-title">
      <div className={s.bookingNarrative}><span className={s.eyebrow}>01 / The call</span><h2 id="booking-title">From a call<br />to the calendar.</h2><div className={s.prose}><p>{copy.capabilities}</p><p>{copy.bookingTruth}</p></div><div className={s.marginNote}><span className={s.smallRule} /><h3>The model saying it happened isn’t enough.</h3><p>{copy.verification}</p></div></div>
      <div><BookingDemo /><p className={s.expansionNote}>{copy.expansion}</p></div>
    </section>

    <section className={s.memorySection} id="memory" aria-labelledby="memory-title"><div className={s.sectionInner}>
      <div className={s.memoryHeading}><div><span className={s.eyebrow}>02 / A call I remember</span><h2 id="memory-title">It remembered<br />my chipped nail.</h2></div><p className={s.memoryReflection}>{copy.reflection}</p></div>
      <MemoryDemo />
      <div className={s.memoryCost}><h3>Memory has a cost too.</h3><p>{copy.memoryCost}</p></div>
    </div></section>

    <section className={`${s.section} ${s.controlSection}`} id="control" aria-labelledby="control-title">
      <div className={s.controlHeading}><div><span className={s.eyebrow}>03 / Working with the owner</span><h2 id="control-title">Some things<br />need your OK.</h2></div><p className={s.editorialCaption}>A closer look at the review flow: a draft can be ready without being allowed to leave. Open it, inspect the proposed action, and make a decision in the demo.</p></div>
      <ApprovalDemo />
    </section>

    <section className={s.buildSection} id="build" aria-labelledby="build-title"><div className={s.sectionInner}>
      <div className={s.buildGrid}><div><span className={s.eyebrow}>04 / Behind the conversation</span><h2 id="build-title">The right context.<br />From the right place.</h2><div className={s.prose}><p>{copy.context}</p></div></div><ContextDemo /></div>
      <div className={s.latencyRow}><div><h3>Latency adds up fast.</h3><p>{copy.latency}</p></div><div className={s.latencyVisual}><div className={s.dependencyChain}><span>Context</span><Icon name="arrow" size={14} /><span>Model</span><Icon name="arrow" size={14} /><span>Tools</span><Icon name="arrow" size={14} /><span>Response</span></div><p>Illustrative dependencies, not a measured latency trace.</p></div></div>
    </div></section>

    <section className={`${s.section} ${s.workspaceSection}`} aria-labelledby="workspace-title"><div className={s.workspaceHeading}><div><span className={s.eyebrow}>The wider workspace</span><h2 id="workspace-title">And this is where<br />it comes together.</h2></div><p className={s.editorialCaption}>The full interface has room for the work, the owner&apos;s decisions, and the record of what happened. The walkthroughs above isolate one piece at a time.</p></div>
      <figure className={s.workspaceFigure}><div className={s.captureBar}><span><DellaMark small /> The Della workspace</span><span>Earlier interface capture</span></div><Image src="/della/workspace-context.webp" alt="Earlier Della workspace showing which actions need owner approval and which can be handled within its permissions. Identifying details have been removed." width={1760} height={1250} sizes="(max-width: 720px) 100vw, 90vw" /><figcaption>Earlier workspace capture, with identifying details removed. Shown for interface context, not as evidence of customer traction or revenue.</figcaption></figure>
      <details className={s.projectNotes}><summary>Project notes <span aria-hidden="true">+</span></summary><div>{copy.brief.map(([label, text]) => <p key={label}>{text}</p>)}</div></details>
    </section>

    <section className={s.currentSection} aria-labelledby="current-title"><div className={s.currentInner}><div><span className={s.eyebrow}>Where it is now</span><h2 id="current-title">I’m getting it<br />into real salons.</h2><a className={s.lightButton} href="https://hellodella.com" target="_blank" rel="noreferrer">Open Della <span aria-hidden="true">↗</span><span className={s.srOnly}> (opens in a new tab)</span></a></div><div className={s.prose}><p>{copy.currentProof}</p><p>{copy.currentWork}</p></div></div></section>
    <footer className={s.footer}><Link href="/"><Icon name="back" size={16} /> Back to all projects</Link><Link href="/work/vialgrade">Next: VialGrade <Icon name="arrow" size={16} /></Link></footer>
    <noscript><style>{`[data-testid="booking-demo"] button, [data-testid="booking-demo"] fieldset, [data-testid="memory-demo"] button, [data-testid="approval-demo"] button, [data-testid="context-demo"] button { display: none !important; }`}</style><p className={s.noScript}>The story and examples are readable without JavaScript. Interactive walkthrough controls require JavaScript; open “Read the whole sequence” for the complete booking explanation.</p></noscript>
  </main>;
}
