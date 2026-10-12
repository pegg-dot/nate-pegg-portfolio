import type { Metadata } from 'next';
import { BookingDemo, ApprovalDemo, DellaMark } from './DellaScenes';
import { ProjectNav, ProjectFooter } from '../_authored/ProjectChrome';
import ArtifactViewer from '../_authored/ArtifactViewer';
import copy from './story-copy.json';
import s from '../_authored/authored.module.css';

export const metadata: Metadata = { title: 'Della | Nate Pegg', description: "Building an AI employee for nail salons, from the first calls to the owner's workspace." };
export default function DellaCase() {
  return <main className={s.della} id="main-content" tabIndex={-1} data-della-edition="authored">
    <ProjectNav active="della" />
    <header className={s.dellaMasthead}><h1 className={s.dellaTitle}><span><DellaMark /></span>Della</h1><div className={s.meta}><span>An AI employee for nail salons</span><span>Started March 11, 2026</span></div></header>
    <div className={s.dellaCover}>
      <ArtifactViewer testId="della-artifact" images={[
        { label: 'Owner controls', src: '/della/workspace-owner-1bca0154fd.webp', width: 1160, height: 720, alt: "Detail of Della's earlier owner controls, showing actions that need approval", caption: "An earlier workspace capture, with identifying details removed. The displayed counts are not current usage." },
        { label: 'Full workspace', src: '/della/workspace-context.webp', width: 1760, height: 1250, alt: 'The full earlier Della workspace with identifying details removed', caption: 'The same capture, including navigation and the surrounding workspace. This is an image, not the live application.' },
      ]} />
      <div className={s.dellaIntro}><p>{copy.intro}</p><p className={s.caption}>{copy.workspace}</p><p className={s.caption}>{copy.coverage}</p><a className={s.textLink} href="https://hellodella.com" target="_blank" rel="noreferrer">Visit Della <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></div>
    </div>
    <article className={s.dellaManuscript} id="why"><aside className={s.marginNote}><p>OpenOperator was the first version.</p><p>The focus moved from medspas to nail salons.</p></aside><div className={s.reading}>{copy.why.map(p => <p key={p}>{p}</p>)}<h2 id="build">Getting the booking to work</h2><p>{copy.bookingProblem}</p><p>{copy.sources}</p><details className={s.details}><summary>What I built around the model</summary><p>{copy.technical}</p></details></div></article>
    <div className={s.bookingInsert}><p className={s.caption}>A simplified call to show where that check happens.</p><BookingDemo inStory /></div>
    <aside className={s.memoryAside} id="memory" aria-label="A call I remember"><p className={s.caption}>My own test calls,<br /> described from memory.</p><div className={s.memoryText}><p>{copy.memoryFirst}</p><p>{copy.memorySecond}</p><p>{copy.memoryReflection}</p></div></aside>
    <section className={s.ownerInsert} id="control" aria-labelledby="owner-title"><div><h2 id="owner-title">Working with the owner</h2><p>{copy.control}</p><p>{copy.controlExample}</p></div><ApprovalDemo inStory /></section>
    <div className={`${s.dellaEnd} ${s.reading}`} id="now"><p>{copy.latency}</p><p>{copy.current}</p><p>{copy.direction}</p></div>
    <ProjectFooter next="vialgrade" name="VialGrade" />
    <noscript><style>{`[data-interactive="true"]{display:none!important}`}</style></noscript>
  </main>;
}
