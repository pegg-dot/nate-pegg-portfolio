import Link from 'next/link';
import type { Metadata } from 'next';
import { DellaMark } from './DellaScenes';
import OriginalScreen from './OriginalScreen';
import copy from './story-copy.json';
import s from './originals.module.css';

export const metadata: Metadata = { title: 'Della | Nate Pegg', description: 'Building an AI-native operating system for nail salons, starting with customer communication and bookings.' };
export default function DellaCase() {
  return <main id="main-content" tabIndex={-1} className={s.page} data-della-edition="original-screens">
    <nav className={s.nav} aria-label="Project navigation"><Link href="/">&#8592; Nate Pegg</Link><div><Link href="/work/della" aria-current="page">Della</Link><Link href="/work/vialgrade">VialGrade</Link><Link href="/work/transformer">Transformer</Link></div></nav>
    <header className={s.opening}><div className={s.identity}><h1><DellaMark />Della</h1><span className={s.meta}>AI-native operating system for nail salons<br />Started April 2026</span></div><p className={s.intro}>{copy.intro}</p><a className={s.visit} href="https://hellodella.com" target="_blank" rel="noreferrer">Visit Della <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></header>
    <article className={s.origin} id="why"><div className={s.margin}>How I started</div><div className={s.prose}>{copy.why.map(p => <p key={p}>{p}</p>)}</div></article>
    <section className={s.industry} id="problem" aria-labelledby="problem-title">
      <div className={s.industryHead}>
        <span className={s.label}>What surprised me about salons</span>
        <h2 id="problem-title">There is a lot more operating work here than it looks like.</h2>
        <div className={s.prose}>
          <p>{copy.industryIntro}</p>
          <p>{copy.fragmentation}</p>
        </div>
      </div>
      <div className={s.statGrid} aria-label="Nail salon industry statistics">
        <div className={s.stat}><strong>34,417</strong><span>U.S. nail salons with employees</span></div>
        <div className={s.stat}><strong>22,572</strong><span>have fewer than five employees</span></div>
        <div className={s.stat}><strong>$3.9B</strong><span>annual payroll across employer nail salons</span></div>
        <div className={s.stat}><strong>37%</strong><span>of salon and spa calls go unanswered</span><small>82% of missed calls happen during business hours</small></div>
      </div>
      <p className={s.industryNote}>
        <span>{copy.industryContext}</span>
        <span>
          Sources: <a href="https://data.census.gov/table/CBP2023.CB2300CBP?codeset=naics~812113" target="_blank" rel="noreferrer">U.S. Census Bureau, 2023 County Business Patterns &#8599;</a>
          {' · '}
          <a href="https://www.zenoti.com/thecheckin/the-revenue-decision-before-the-appointment-book" target="_blank" rel="noreferrer">Zenoti, 2025 salon and spa data &#8599;</a>
        </span>
      </p>
    </section>
    <section className={s.callSection} id="build" aria-labelledby="call-title">
      <div className={s.callContent}>
        <div className={s.callHeading}><span className={s.label}>Where I started building</span><h2 id="call-title">Start with the phone.</h2><div className={s.prose}><p>{copy.currentWedge}</p><p>{copy.bookingProblem}</p><p>{copy.sources}</p></div><p className={s.sourceNote}>The screen alongside this is a crop of a real test call. The appointment was not created; the record still has inconsistencies that need work.</p></div>
        <div className={s.callScreens} data-testid="real-call-screens"><OriginalScreen testId="call-record" src="/della/originals/call-record-01c73930dd.webp" width={414} height={563} alt="Original Della call record showing that the booking system refused the appointment write" caption="My September 9 test call. The activity log says the appointment wasn't written to the booking system, despite the step being labeled 'Booked'." /></div>
      </div>
      <details className={s.technical}><summary>What I built around the model <span aria-hidden="true">+</span></summary><p>{copy.technical}</p></details>
    </section>
    <aside className={s.memory} id="memory"><span className={s.label}>Something I remember from testing</span><div className={s.prose}><p>{copy.memory.join(' ')}</p></div><p className={s.caption}>My recollection of separate test calls, not a transcript of the screenshots above.</p></aside>
    <section className={s.messages} id="control" aria-labelledby="messages-title"><div className={s.messagesCopy}><h2 id="messages-title">Messages and follow-up</h2><div className={s.prose}><p>{copy.messages}</p><p>{copy.control}</p></div></div><OriginalScreen testId="inbox-record" src="/della/originals/inbox-draft-e202a3554e.webp" width={568} height={429} alt="Original Della inbox draft marked approved, copy and send it yourself, with a customer name redacted" caption="The inbox from my testing. This draft is marked 'Approved. Copy and send it yourself.' It doesn't show an automatically sent message. A name is redacted." /></section>
    <section className={s.direction} id="direction" aria-labelledby="direction-title">
      <div className={s.directionIntro}>
        <span className={s.label}>Where it is now</span>
        <h2 id="direction-title">The phone is only the first piece.</h2>
        <div className={s.prose}><p>{copy.latency}</p><p>{copy.current}</p></div>
      </div>
      <div className={s.futureExample}>
        <span className={s.label}>A future example, not a live feature</span>
        <p>{copy.futureExample}</p>
      </div>
      <div className={s.directionClose}>
        <div className={s.prose}><p>{copy.thesis}</p></div>
        <p className={s.directionLine}>{copy.direction}</p>
      </div>
    </section>
    <footer className={s.footer}><Link href="/">&#8592; Back to my work</Link><Link href="/work/vialgrade">VialGrade &#8594;</Link></footer>
  </main>;
}
