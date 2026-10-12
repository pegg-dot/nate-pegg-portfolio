import Image from 'next/image';
import type { Metadata } from 'next';
import { ProjectNav, ProjectFooter } from '../_authored/ProjectChrome';
import { EvidenceComparison } from './VialScenes';
import GradeExamples from './GradeExamples';
import { exampleTaggedUrl, linkParts } from './evidence-model';
import copy from './story-copy.json';
import s from '../_authored/authored.module.css';

export const metadata: Metadata = { title: 'VialGrade | Nate Pegg', description: 'A research site I built to compare peptide vendors and follow their claims back to evidence.' };
export default function VialGradeCase() {
  return <main className={s.vial} id="main-content" tabIndex={-1} data-vial-edition="authored">
    <ProjectNav active="vialgrade" />
    <header className={s.vialOpening}><div className={s.meta}><span>Research / software</span><span>Built in 2026</span></div><div><h1>VialGrade</h1><p className={s.lead}>{copy.intro}</p><a className={s.textLink} href="https://vialgrade.com" target="_blank" rel="noreferrer">Visit the site <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></div></header>
    <article className={s.vialArticle} id="origin"><aside className={s.marginNote}><p>Where the idea came from</p></aside><div className={s.reading}><p>{copy.orientation}</p>{copy.origin.map(p => <p key={p}>{p}</p>)}</div></article>
    <div className={s.evidenceSpread}><p className={s.caption}>One example of the comparison. The names and records here are fictional.</p><EvidenceComparison inArticle /></div>
    <article className={s.vialArticle} id="grades"><aside className={s.marginNote}><p>Missing information</p></aside><div className={s.reading}><p>{copy.unknown}</p><figure className={s.codeFigure} data-testid="grade-source-excerpt"><figcaption><span>From the grade function</span><a href="https://github.com/pegg-dot/vial/blob/5a08f288a136d2af232e224770e07408902878bd/src/server/verify/grade.ts" target="_blank" rel="noreferrer">Source <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></figcaption><pre><code>{'case "unproven":\ncase "info": {\n    return {\n        ...base,\n        '}<mark>{'letter: null,'}</mark>{'\n        band: "insufficient",'}</code></pre><p className={s.codeCaption}>An excerpt; the return continues. The grade is deliberately left empty here.</p></figure><p>{copy.grading}</p></div></article>
    <div className={s.gradeFootnote}><details className={s.details} data-testid="grade-details"><summary>The letter grades, with example inputs</summary><GradeExamples /></details></div>
    <article className={s.vialArticle} id="handoff"><aside className={s.marginNote}><p>After the visitor leaves</p></aside><div className={s.reading}><p>{copy.handoff}</p><p>{copy.attribution}</p><div className={s.linkInline} data-testid="handoff-demo"><p><code>utm_source=vialgrade</code></p><p>The outbound click can be recorded.</p><p>A purchase? The link alone doesn&apos;t tell me.</p><details><summary>See an example link</summary><p>An illustrative address, not a working vendor link. Opening this explanation records nothing.</p><code>{exampleTaggedUrl}</code><dl>{linkParts.map(part => <div key={part.key}><dt>{part.key}</dt><dd>{part.meaning}</dd></div>)}</dl></details></div></div></article>
    <div className={s.vialFoot}><figure className={s.siteFigure}><a href="/vialgrade/home.jpg" target="_blank" rel="noreferrer"><Image src="/vialgrade/research-home.webp" width={1440} height={1000} alt="Earlier VialGrade homepage with its search and record-based comparisons" sizes="(max-width: 800px) 100vw, 680px" /><span className={s.srOnly}>Open the full screenshot (opens in a new tab)</span></a><figcaption><span className={s.fullSizeLabel}>The site I built. Click to see the full screenshot.</span>An earlier interface. The displayed numbers are not current activity, and the headline is not a product-safety finding.</figcaption></figure><div className={s.reading}><p>{copy.earlyUse}</p><p className={s.caption}>Earlier reported figures, not live analytics.</p></div></div>
    <p className={`${s.vialLast} ${s.reading}`}>{copy.takeaway}</p>
    <ProjectFooter next="transformer" name="Transformer" />
    <noscript><style>{`[data-interactive="true"]{display:none!important}`}</style></noscript>
  </main>;
}
