import Link from 'next/link';
import type { Metadata } from 'next';
import { DellaMark } from './DellaScenes';
import OriginalScreen from './OriginalScreen';
import copy from './story-copy.json';
import s from './originals.module.css';

export const metadata: Metadata = { title: 'Della | Nate Pegg', description: 'Building an AI employee for nail salons, with the actual call and inbox screens from my testing.' };
export default function DellaCase() {
  return <main id="main-content" tabIndex={-1} className={s.page} data-della-edition="original-screens">
    <nav className={s.nav} aria-label="Project navigation"><Link href="/">&#8592; Nate Pegg</Link><div><Link href="/work/della" aria-current="page">Della</Link><Link href="/work/vialgrade">VialGrade</Link><Link href="/work/transformer">Transformer</Link></div></nav>
    <header className={s.opening}><div className={s.identity}><h1><DellaMark />Della</h1><span className={s.meta}>An AI employee for nail salons<br />Started March 2026</span></div><p className={s.intro}>{copy.intro}</p><a className={s.visit} href="https://hellodella.com" target="_blank" rel="noreferrer">Visit Della <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></header>
    <article className={s.origin} id="why"><div className={s.margin}>How I started</div><div className={s.prose}>{copy.why.map(p => <p key={p}>{p}</p>)}</div></article>
    <section className={s.callSection} id="build" aria-labelledby="call-title">
      <div className={s.callContent}>
        <div className={s.callHeading}><span className={s.label}>From my testing</span><h2 id="call-title">A call in Della</h2><div className={s.prose}><p>{copy.bookingProblem}</p><p>{copy.sources}</p></div><p className={s.sourceNote}>The screen alongside this is a crop of a real test call. The appointment was not created; the record still has inconsistencies that need work.</p></div>
        <div className={s.callScreens} data-testid="real-call-screens"><OriginalScreen testId="call-record" src="/della/originals/call-record-01c73930dd.webp" width={414} height={563} alt="Original Della call record showing that the booking system refused the appointment write" caption="My September 9 test call. The activity log says the appointment wasn't written to the booking system, despite the step being labeled 'Booked'." /></div>
      </div>
      <details className={s.technical}><summary>What I built around the model <span aria-hidden="true">+</span></summary><p>{copy.technical}</p></details>
    </section>
    <aside className={s.memory} id="memory"><span className={s.label}>Something I remember from testing</span><div className={s.prose}><p>{copy.memory.join(' ')}</p></div><p className={s.caption}>My recollection of separate test calls, not a transcript of the screenshots above.</p></aside>
    <section className={s.messages} id="control" aria-labelledby="messages-title"><div className={s.messagesCopy}><h2 id="messages-title">Messages and follow-up</h2><div className={s.prose}><p>{copy.messages}</p><p>{copy.control}</p></div></div><OriginalScreen testId="inbox-record" src="/della/originals/inbox-draft-e202a3554e.webp" width={568} height={429} alt="Original Della inbox draft marked approved, copy and send it yourself, with a customer name redacted" caption="The inbox from my testing. This draft is marked 'Approved. Copy and send it yourself.' It doesn't show an automatically sent message. A name is redacted." /></section>
    <div className={`${s.closing} ${s.prose}`} id="now"><p>{copy.latency}</p><p>{copy.current} {copy.direction}</p></div>
    <footer className={s.footer}><Link href="/">&#8592; Back to my work</Link><Link href="/work/vialgrade">VialGrade &#8594;</Link></footer>
  </main>;
}
