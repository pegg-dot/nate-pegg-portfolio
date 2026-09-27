import CaseShell from "../../components/CaseShell";

const steps = [
  ["10:22", "checked live availability", "Aug 1"],
  ["10:23", "checked live availability", "Jul 30"],
  ["10:26", "created Square booking", "Nail Repair · 4:30 PM"],
  ["10:27", "created a second booking", "same service / time"],
];

const failures = [
  ["Acted before asked", "The model started trying to book while the caller was still asking whether the service could be repaired."],
  ["Source conflict", "Business hours said 9–5 while a real 6 PM appointment already existed."],
  ["Provider verification", "The caller invented “Mia” and the model accepted the name before checking the roster."],
  ["Voice latency", "A long reasoning/tool turn left roughly 40 seconds of dead air."],
  ["Write verification", "The appointment was created, then the flow continued and created the same booking again."],
];

export default function DellaCase() {
  return (
    <CaseShell index="01 / DELLA" title="DELLA" subtitle="Started March 11, 2026. An AI operator for nail salons, narrowed down until communications could be made trustworthy." external={{ label: "LIVE SITE", href: "https://hellodella.com" }}>
      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE EVOLUTION</span><h2>OPENCLAW → OWN HARNESS → COMMUNICATIONS</h2></div>
          <div className="caseStack"><p>Started by exploring OpenClaw-style agents.</p><p>Moved toward a custom runner, skills, tools, permissions, receipts, evals and persistent context.</p><p>Pivoted from medspas to nail salons.</p><p>Then cut scope again: harden communications before trying to automate the whole business.</p></div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">REAL CALL / JUL 2026</span>
        <div className="caseCallGrid">
          <div className="caseCallSummary"><h2>41 turns.<br/>One real booking.</h2><p>Nail Repair (Hands or Feet)<br/>Thu, Jul 30 · 4:30 PM</p><div className="caseStepList">{steps.map(([time, action, meta]) => <div key={time + action}><b>{time}</b><span>{action}</span><em>{meta}</em></div>)}</div></div>
          <div className="caseTranscript">
            <blockquote><b>CALLER · 2:46</b><p>Why is the latest four thirty PM? Are you a hundred percent sure?</p></blockquote>
            <blockquote className="agent"><b>DELLA</b><p>You&apos;re right to push back — let me double-check that for you.</p></blockquote>
            <blockquote><b>CALLER · 3:25</b><p>You booked me for six PM Monday. Now you&apos;re telling me you close at five on Thursday. Did you just mess up there?</p></blockquote>
            <blockquote><b>CALLER · 6:07</b><p>Mia isn&apos;t an actual technician. I was just testing you.</p></blockquote>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandRed">
        <span className="caseLabel">WHAT THE CALL EXPOSED</span>
        <div className="failureGrid">{failures.map(([title, body], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">RAG IS NOT A TOOL</span><h2>KNOWLEDGE ≠ LIVE STATE</h2></div>
          <div className="ragVsTools"><div><b>RETRIEVE</b><span>repair policy</span><span>business rules</span><span>static guidance</span></div><div><b>TOOL</b><span>Thursday availability</span><span>technician roster</span><span>create / cancel booking</span></div><div><b>VERIFY</b><span>did the write happen?</span><span>what state are we in now?</span></div></div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <span className="caseLabel">WIRED TODAY</span>
        <div className="integrationGrid">
          <div><b>Square</b><span>live availability + booking creation</span><em>LIVE</em></div>
          <div><b>Retell</b><span>voice runtime</span><em>LIVE</em></div>
          <div><b>Telnyx</b><span>telephony / messaging infrastructure</span><em>LIVE</em></div>
          <div><b>Anthropic</b><span>model runtime</span><em>LIVE</em></div>
          <div><b>Email</b><span>inbound lead path + approved send via Resend</span><em>BUILT</em></div>
          <div><b>Gmail</b><span>context backfill; inbound Pub/Sub path not fully dispatched yet</span><em>PARTIAL</em></div>
          <div><b>Instagram</b><span>webhook + reply adapter implemented</span><em>CONNECTING</em></div>
          <div><b>Google Business</b><span>review/location adapter implemented</span><em>CONNECTING</em></div>
        </div>
      </section>
    </CaseShell>
  );
}
