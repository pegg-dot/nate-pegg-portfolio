import Image from "next/image";
import CaseShell from "../../components/CaseShell";

export default function NpgkCase() {
  return (
    <CaseShell index="06 / NPGKTRADES" title="NPGKTRADES" subtitle="A Polymarket copy-trading system that watches a public source wallet, aggregates fills, scales positions to my bankroll, runs deterministic risk checks, and mirrors the trade." external={{ label: "GITHUB", href: "https://github.com/pegg-dot/NPGKTrades" }} actions={[{ label: "VIEW CODE", href: "https://github.com/pegg-dot/NPGKTrades", external: true }]}>
      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE IDEA</span><h2>COPY THE ALLOCATION, NOT THE DOLLAR AMOUNT.</h2></div>
          <div className="bankrollNote"><span>source trade</span><strong>$2,000</strong><i>× bankroll ratio</i><span>my proportional copy</span><strong>$20</strong><small>illustrative example</small></div>
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT I LEARNED BUILDING IT</span><h2>NOT EVERY DECISION SHOULD BE AN AGENT.</h2></div>
          <div className="caseStack"><p>The source wallet can be watched automatically. Fragmented fills can be aggregated. Position size can be calculated.</p><p>But the execution gate is deterministic code: exposure limits, slippage, minimum size and a kill switch.</p><p>I liked that distinction. AI can be useful elsewhere without being allowed to improvise the part that decides whether money moves.</p></div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">THE PATH</span>
        <div className="copyFlow"><span>detect</span><i>→</i><span>aggregate</span><i>→</i><span>scale</span><i>→</i><span>price / risk</span><i>→</i><span>execute</span><i>→</i><span>track</span></div>
        <div className="npgkGallery"><div><Image src="/npgk/overview.jpg" alt="NPGKTrades dashboard overview" fill sizes="33vw" /></div><div><Image src="/npgk/positions.jpg" alt="NPGKTrades positions dashboard" fill sizes="33vw" /></div><div><Image src="/npgk/analytics.jpg" alt="NPGKTrades analytics dashboard" fill sizes="33vw" /></div></div>
      </section>
    </CaseShell>
  );
}
