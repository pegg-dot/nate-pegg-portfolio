import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function NpgkCase() {
  return (
    <CaseShell
      index="06 / NPGKTRADES"
      title="NPGKTRADES"
      subtitle="NPGKTrades watches a public Polymarket wallet, detects new fills, scales the position to my bankroll, runs risk checks, and can mirror the trade instead of making me reproduce it manually."
      external={{ label: "GITHUB", href: "https://github.com/pegg-dot/NPGKTrades" }}
      actions={[{ label: "VIEW CODE", href: "https://github.com/pegg-dot/NPGKTrades", external: true }]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A copy-trading pipeline for one source trader: detect, aggregate fragmented fills, scale by bankroll ratio, check price and risk, execute, and track the resulting position." },
        { label: "WHY", text: "I knew the trader and wanted to follow the same decisions, but copying his raw dollar amount made no sense because his account was much larger than mine." },
        { label: "HOW", text: "The monitor reads public wallet activity, groups fills in the same market and side, calculates the proportional copy, and passes it through deterministic exposure, slippage, size, and kill-switch checks before execution." },
        { label: "WHEN", text: "Built in 2026 as a personal trading system. Dry run is the safe default, and the live execution path requires explicit confirmation." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE IDEA</span><h2>COPY THE ALLOCATION, NOT THE DOLLAR AMOUNT.</h2></div>
          <div className="bankrollNote"><span>source trade</span><strong>$2,000</strong><i>× bankroll ratio</i><span>my proportional copy</span><strong>$20</strong><small>illustrative example</small></div>
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE ENGINEERING DECISION I LIKED</span><h2>NOT EVERY DECISION SHOULD BE AN AGENT.</h2></div>
          <div className="caseStack"><p>The source wallet can be watched automatically. Fragmented fills can be aggregated. Position size can be calculated.</p><p>But the part that decides whether money moves is deterministic code: exposure limits, slippage, minimum size, session limits, and an emergency kill switch.</p><p>I liked building a system where the clever part and the safe part were allowed to be different things.</p></div>
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
