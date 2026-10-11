import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EvidenceComparison, GradeExplorer } from "./VialScenes";
import { exampleDestination, exampleTaggedUrl, linkParts } from "./evidence-model";
import copy from "./story-copy.json";
import s from "./vial.module.css";

export const metadata: Metadata = {
  title: "VialGrade | Nate Pegg",
  description: "Why I built VialGrade, and how claims become evidence you can inspect.",
};

function VMark() {
  return <svg viewBox="0 0 236 242" className={s.vMark} aria-hidden="true"><path d="M0 0 L76 0 L118 118 L160 0 L236 0 L146 242 L90 242 Z" fill="currentColor" /></svg>;
}

export default function VialGradeCase() {
  return <main className={s.page} id="main-content" tabIndex={-1}>
    <nav className={s.nav} aria-label="Project navigation">
      <Link href="/">← Nate Pegg</Link><span>02 / VialGrade</span>
      <a href="https://vialgrade.com" target="_blank" rel="noreferrer">Open VialGrade <span aria-hidden="true">↗</span><span className={s.srOnly}> (opens in a new tab)</span></a>
    </nav>
    <header className={s.hero}>
      <div className={s.heroTitle}><span className={s.eyebrow}>Research / evidence / 2026</span><h1><VMark /> VialGrade<span>.</span></h1></div>
      <div className={s.heroGrid}>
        <div className={s.heroCopy}><p>{copy.intro}</p><div className={s.heroActions}><a className={s.primaryLink} href="#evidence">Inspect a claim <span aria-hidden="true">↗</span></a><a className={s.textLink} href="#origin">How it started ↓</a></div><span className={s.heroBoundary}>A research tool. Not a product safety certification.</span></div>
        <a href="#evidence" className={s.heroFile} aria-label="What backs this up? Inspect the evidence example">
          <div className={s.fileBack} aria-hidden="true"><span>SOURCE RECORD</span><i /><i /><i /></div>
          <div className={s.fileFront}><div className={s.fileTop}><span>THE STOREFRONT SAYS</span><span>ILLUSTRATION</span></div><strong>“Third-party<br />tested.”</strong><div className={s.fileBatch}><span>Batch</span><code>VG-2410</code><span className={s.claimOnly}>Claim only</span></div><span className={s.fileQuestion}>What backs this up? <span aria-hidden="true">↗</span></span></div>
          <span className={s.pencilNote}>start with the source, not the badge</span>
        </a>
      </div>
    </header>
    <nav className={s.chapterNav} aria-label="Inside VialGrade"><span>Inside the project</span><a href="#evidence">01 <b>The evidence</b></a><a href="#grades">02 <b>The grade</b></a><a href="#handoff">03 <b>The handoff</b></a></nav>
    <section className={`${s.section} ${s.origin}`} id="origin" aria-labelledby="origin-title">
      <div><span className={s.eyebrow}>Where it came from</span><h2 id="origin-title">The websites all said<br />they were verified.</h2></div>
      <div className={s.prose}><p>{copy.originFriend}</p><p>{copy.originClaims}</p><p>{copy.originGoal}</p></div>
    </section>
    <section className={s.evidenceSection} id="evidence" aria-labelledby="evidence-title">
      <div className={s.sectionHeading}><div><span className={s.eyebrow}>01 / Follow the evidence</span><h2 id="evidence-title">What backs<br />this up?</h2></div><p>A certificate of analysis, or COA, is a document to check, not a badge to accept. Compare the claim with its source record, then try a missing or conflicting record.</p></div>
      <EvidenceComparison />
    </section>
    <section className={`${s.section} ${s.gradingSection}`} id="grades" aria-labelledby="grade-title">
      <div className={s.sectionHeading}><div><span className={s.eyebrow}>02 / The grade follows the evidence</span><h2 id="grade-title">Unknown has<br />to stay unknown.</h2></div><div className={s.prose}><p>{copy.gradingUnknown}</p></div></div>
      <GradeExplorer />
      <div className={s.gradeProse}><p>{copy.gradingAreas}</p><p>{copy.gradingStrong}</p></div>
    </section>
    <section className={`${s.section} ${s.handoffSection}`} id="handoff" aria-labelledby="handoff-title">
      <div className={s.handoffStory}><span className={s.eyebrow}>03 / A problem I didn&apos;t expect</span><h2 id="handoff-title">How do I know<br />a click made it out?</h2><div className={s.prose}><p>{copy.checkout}</p><p>{copy.handoff}</p><p>{copy.attribution}</p></div></div>
      <div className={s.linkSpecimen} data-testid="handoff-demo"><span className={s.smallLabel}>AN OUTBOUND LINK, UNPACKED</span><div className={s.linkRoute}><span>VialGrade</span><span aria-hidden="true">↗</span><span>Vendor site</span></div><code className={s.urlBase}>{exampleDestination}</code>
        <details className={s.linkDisclosure}><summary>Inspect the referral tags <span aria-hidden="true">+</span></summary><code className={s.fullUrl}>{exampleTaggedUrl}</code><dl>{linkParts.map(part => <div key={part.key}><dt>{part.key}<span>= {part.value}</span></dt><dd>{part.meaning}</dd></div>)}</dl></details>
        <div className={s.handoffLimit}><span>What the handoff can show</span><p>A recorded outbound click.</p><span>What it cannot establish by itself</span><p>A completed purchase.</p></div><p className={s.caption}>Illustrative URL, not a working vendor link. Expanding it sends nothing and records no referral.</p>
      </div>
    </section>
    <section className={`${s.section} ${s.afterLaunch}`} aria-labelledby="launch-title">
      <div className={s.launchNote}><span className={s.eyebrow}>An early progress note</span><h2 id="launch-title">People I didn&apos;t know<br />started using it.</h2><p className={s.historicalNote}>Preserved from the original case study. These are earlier reported figures, not live metrics.</p><p className={s.proseSingle}>{copy.earlyUse}</p></div>
      <figure className={s.productCapture}><div className={s.captureBar}><VMark /><span>The product, in context</span><span>Earlier capture</span></div><a href="/vialgrade/home.jpg" target="_blank" rel="noreferrer"><Image src="/vialgrade/research-home.webp" alt="Earlier VialGrade homepage with its verification search and source-focused layout" width={1440} height={1000} sizes="(max-width: 800px) 100vw, 55vw" /><span className={s.imageLink}>View the full screenshot ↗<span className={s.srOnly}> (opens in a new tab)</span></span></a><figcaption>Earlier interface and displayed counts, not a statement of current activity or product safety.</figcaption></figure>
    </section>
    <section className={s.boundarySection} aria-labelledby="boundary-title"><span className={s.eyebrow}>The distinction that matters</span><h2 id="boundary-title">A research tool.<br />Not a safety claim.</h2><div className={s.boundaryCopy}><p>{copy.boundary}</p><p>{copy.purpose}</p></div></section>
    <div className={s.notes}><details><summary>Project notes</summary><dl>{copy.brief.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl></details></div>
    <noscript><p className={s.noScript}>The full story is readable without JavaScript. Open “Read all three outcomes” for the evidence cases, and “What this example does and does not run” for the grade examples. Interactive record switching requires JavaScript.</p><style>{`[data-testid="evidence-demo"] fieldset, [data-testid="evidence-demo"] [role="group"], [data-testid="grade-demo"] fieldset { display: none !important; } [data-testid="evidence-demo"] button { pointer-events: none; }`}</style></noscript>
    <footer className={s.footer}><Link href="/">← Back to Nate&apos;s work</Link><a href="https://github.com/pegg-dot/vial" target="_blank" rel="noreferrer">View the code ↗<span className={s.srOnly}> (opens in a new tab)</span></a></footer>
  </main>;
}
