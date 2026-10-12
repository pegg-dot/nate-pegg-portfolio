import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { EvidenceComparison } from './VialScenes';
import GradeExamples from './GradeExamples';
import { exampleTaggedUrl, linkParts } from './evidence-model';
import copy from './story-copy.json';
import s from './vial.module.css';

export const metadata: Metadata = {
  title: 'VialGrade | Nate Pegg',
  description: "Why I built VialGrade to compare peptide vendors, what I could check, and what I learned about missing evidence.",
};

export default function VialGradeCase() {
  return <main className={s.page} id="main-content" tabIndex={-1} data-vial-edition="reader-first">
    <nav className={s.nav} aria-label="Project navigation"><Link href="/">&#8592; Nate Pegg</Link><span>02 / VialGrade</span><a href="https://vialgrade.com" target="_blank" rel="noreferrer">Visit VialGrade <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></nav>
    <header className={s.hero}>
      <div className={s.heroCopy}><p className={s.kicker}>Comparing the evidence behind peptide vendors</p><h1>VialGrade<span aria-hidden="true">.</span></h1><p className={s.lede}>{copy.intro}</p><p className={s.orientation}>{copy.orientation}</p><a className={s.storyLink} href="#origin">Why I built it <span aria-hidden="true">&#8594;</span></a><span className={s.year}>Built in 2026</span></div>
      <EvidenceComparison />
    </header>

    <section className={`${s.section} ${s.origin}`} id="origin" aria-labelledby="origin-title">
      <h2 id="origin-title">They all said<br /> they were verified.</h2><div className={s.prose}>{copy.origin.map(p => <p key={p}>{p}</p>)}</div>
    </section>

    <section className={`${s.section} ${s.gradesSection}`} id="grades" aria-labelledby="grades-title">
      <div className={s.gradeStory}><h2 id="grades-title">I didn&apos;t want<br /> to force a grade.</h2><div className={s.prose}><p>{copy.unknown}</p><p>{copy.grading}</p></div></div><GradeExamples />
    </section>

    <section className={`${s.section} ${s.handoffSection}`} id="handoff" aria-labelledby="handoff-title">
      <div><h2 id="handoff-title">Tracking what<br /> happened next.</h2><div className={s.prose}><p>{copy.handoff}</p><p>{copy.attribution}</p></div></div>
      <div className={s.handoff} data-testid="handoff-demo">
        <p className={s.handoffLabel}>When someone follows a vendor link</p>
        <div className={s.linkJourney}>
          <div><span className={s.journeyDot} aria-hidden="true" /><strong>Leaves VialGrade</strong><p>The outbound click can be recorded.</p></div>
          <div><span className={s.journeyDot} aria-hidden="true" /><strong>Arrives at the vendor</strong><p>The link identifies VialGrade as the source.</p></div>
          <div><span className={`${s.journeyDot} ${s.unknownDot}`} aria-hidden="true" /><strong>Buys something?</strong><p>The link alone doesn&apos;t tell me.</p></div>
        </div>
        <details className={s.linkDetails}><summary>See an example link <span aria-hidden="true">+</span></summary><p className={s.linkDisclosure}>An illustrative address, not a working vendor link. Opening this explanation records nothing.</p><code className={s.exampleUrl}>{exampleTaggedUrl}</code><dl>{linkParts.map(part => <div key={part.key}><dt>{part.key}</dt><dd>{part.meaning}</dd></div>)}</dl></details>
      </div>
    </section>

    <section className={`${s.section} ${s.launchedSection}`} aria-labelledby="launched-title">
      <div className={s.launchedStory}><h2 id="launched-title">People started<br /> finding it.</h2><div className={s.prose}><p>{copy.earlyUse}</p></div><p className={s.historical}>Earlier reported figures, not live analytics.</p><a className={s.productLink} href="https://vialgrade.com" target="_blank" rel="noreferrer">Visit VialGrade <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></div>
      <figure className={s.productCapture}><a href="/vialgrade/home.jpg" target="_blank" rel="noreferrer"><Image src="/vialgrade/research-home.webp" alt="Earlier VialGrade homepage, with its vendor search and record-based comparisons" width={1440} height={1000} sizes="(max-width: 760px) 100vw, 650px" /><span className={s.fullScreenshot}>Open the full screenshot <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></span></a><figcaption>An earlier interface. The numbers in this image aren&apos;t current activity.</figcaption></figure>
    </section>
    <section className={`${s.section} ${s.takeawaySection}`} aria-labelledby="takeaway-title"><h2 id="takeaway-title">What I took<br /> from it.</h2><p className={s.takeaway}>{copy.takeaway}</p></section>
    <footer className={s.footer}><Link href="/">&#8592; Back to my work</Link><Link href="/work/transformer">Transformer &#8594;</Link></footer>
    <noscript><style>{`[data-interactive="true"]{display:none!important}`}</style></noscript>
  </main>;
}
