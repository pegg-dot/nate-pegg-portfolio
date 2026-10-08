import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function NpgkCase() {
  return (
    <CaseShell
      className="caseCompact npgkCase"
      index="06 / NPGKTRADES"
      title="NPGKTRADES"
      subtitle="I built NPGKTrades after watching a friend who was extremely good at Polymarket. He would place a huge number of trades, sometimes on positions that looked like they opposed each other, and I wanted to see if I could build something that followed his actual trades at a scale that made sense for my bankroll."
      external={{ label: "GITHUB", href: "https://github.com/pegg-dot/NPGKTrades" }}
      actions={[{ label: "VIEW CODE", href: "https://github.com/pegg-dot/NPGKTrades", external: true }]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A Polymarket copy-trading system that watches one public wallet, groups new fills, scales the position to my bankroll, checks price and risk, and tracks the mirrored position." },
        { label: "WHY", text: "The trader I wanted to follow had a much larger account than mine, so copying the same dollar amount made no sense. I wanted to copy the allocation instead." },
        { label: "HOW", text: "Public wallet activity goes through fill aggregation, bankroll-relative sizing, slippage and exposure checks, then either a dry-run fill or an explicitly enabled live execution path." },
        { label: "WHEN", text: "Built in 2026 as a personal project. Most of my testing has been in dry-run mode." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT CAME FROM</span><h2>I WANTED TO FOLLOW THE TRADES, NOT GUESS THE STRATEGY.</h2></div>
          <div className="caseStack">
            <p>A friend of mine was known at school for being a very successful Polymarket trader. He is also one of the smartest people I know, had worked with AI a lot, and had won a bunch of hackathons in San Francisco.</p>
            <p>What made his trading interesting to me was that it did not always look obvious from the outside. In politics, for example, he could have money on two opposing candidates and still end up on top. On top of that, tens of orders could fill in a single day.</p>
            <p>Instead of trying to reverse-engineer the strategy first, I wanted to see if I could build something that simply watched his public wallet and tailed the trades automatically.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE BASIC IDEA</span><h2>COPY THE PERCENTAGE, NOT THE DOLLARS.</h2></div>
          <div className="bankrollNote">
            <span>source trade</span><strong>$2,000</strong><i>× bankroll ratio</i><span>my proportional copy</span><strong>$20</strong><small>illustrative example</small>
          </div>
        </div>
        <div className="caseStack compactTop">
          <p>If his account was dramatically larger than mine, a $5,000 position for him obviously could not mean a $5,000 position for me. The system calculates the size of his trade relative to his bankroll, then applies that ratio to mine.</p>
          <p>That was the part I cared about preserving: the allocation, not the raw dollar amount.</p>
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT MADE IT TRICKIER</span><h2>ONE TRADE CAN SHOW UP AS A LOT OF FILLS.</h2></div>
          <div className="caseStack">
            <p>The public wallet does not always hand you one neat order to copy. A larger position can arrive as a bunch of smaller fills in the same market and side.</p>
            <p>I added a short aggregation window so related fills get combined before the mirror trade is sized. The system uses the combined size and a volume-weighted average price instead of reacting to every tiny fragment separately.</p>
            <p>It also checks the current market price before copying, because by the time I detect a fill, the price can already have moved enough that copying it no longer makes sense.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">THE PATH</span>
        <div className="copyFlow"><span>detect</span><i>→</i><span>aggregate</span><i>→</i><span>scale</span><i>→</i><span>price / risk</span><i>→</i><span>execute</span><i>→</i><span>track</span></div>
        <div className="npgkGallery">
          <div><Image src="/npgk/overview.jpg" alt="NPGKTrades dashboard overview" fill sizes="33vw" /></div>
          <div><Image src="/npgk/positions.jpg" alt="NPGKTrades positions dashboard" fill sizes="33vw" /></div>
          <div><Image src="/npgk/analytics.jpg" alt="NPGKTrades analytics dashboard" fill sizes="33vw" /></div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div><span className="caseLabel">RISK</span><h2>I KEPT THE EXECUTION PATH DETERMINISTIC.</h2></div>
          <div className="caseStack">
            <p>I had already been experimenting with agents in other projects, but I did not want an LLM deciding whether money should move here.</p>
            <p>The execution gate is ordinary code. It checks session exposure, exposure to one market, price movement, minimum trade size, and a kill switch before a buy can go through. When the source trader sells, the mirror can reduce the position too.</p>
            <p>There is a separate learner that stores public trading behavior for pattern analysis, but that sits outside the path that decides whether a trade is allowed.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT IS NOW</span><h2>MOST OF MY TESTING HAS BEEN DRY-RUN.</h2></div>
          <div className="caseStack">
            <p>Dry-run still lets me follow the public wallet, size the copies, apply the same rules, and measure the hypothetical wins, losses, and percentage performance without putting real money behind every test.</p>
            <p>It is not identical to live execution because real fills, liquidity, and slippage can differ, but it is useful for seeing whether the system is following the account the way I intended.</p>
            <p>The repo also has a live path, but it is opt-in and requires explicit confirmation. I built this mainly because I wanted to see if the whole idea could work.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
