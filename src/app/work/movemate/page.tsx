import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";
import styles from "./movemate.module.css";

const team = [
  {
    name: "Nate Pegg",
    year: "First-year · UVA",
    detail: "Product + engineering. I build the software, but the product decisions, testing, launch ideas, and operating plan are shared with the team.",
  },
  {
    name: "Jack Dofflemeyer",
    year: "Third-year · UVA",
    detail: "Charlottesville. Works across product decisions, validation, launch experiments, and the operating side of MoveMate.",
  },
  {
    name: "Will Franey",
    year: "First-year · UVA",
    detail: "Works across product decisions, validation, launch experiments, and figuring out what students actually need from the service.",
  },
  {
    name: "Bobby Wholey",
    year: "First-year · UVA",
    detail: "Works across product decisions, validation, launch experiments, and the marketplace / moving model as it develops.",
  },
  {
    name: "Jack Duffins",
    year: "Second-year · UVA",
    detail: "Charlottesville. Previously attended college in Jacksonville and played lacrosse. Works across product, launch, and operations with the team.",
  },
];

export default function MoveMateCase() {
  return (
    <CaseShell
      index="09 / MOVEMATE"
      title="MOVEMATE"
      subtitle="MoveMate helps UVA students move in and move out. The marketplace is still there, but it now sits underneath the main job: make the move itself easier, then help with the things students still need or need to get rid of."
      external={{ label: "LAUNCH MVP", href: "https://move-mate.netlify.app" }}
      actions={[{ label: "OPEN LAUNCH MVP", href: "https://move-mate.netlify.app", external: true }]}
    >
      <ProjectBrief items={[
        {
          label: "WHAT",
          text: "Move-in and move-out help for UVA students, with a student marketplace underneath it. The moving service is the wedge; the marketplace becomes the natural place for the furniture and things that are left over or still needed.",
        },
        {
          label: "WHY",
          text: "We started with a marketplace, but marketplaces are cyclical and hard to make useful before enough people are there. Moving is a sharper problem where one successful job can create much more value for one student.",
        },
        {
          label: "HOW",
          text: "We mapped roughly 20 assumptions by importance and confidence, then focused on the important assumptions we were least sure about. The launch MVP and QR posters are there to measure interest and get the first users before we recruit a large moving network.",
        },
        {
          label: "WHEN",
          text: "The project started as HOOS Moving and evolved into MoveMate in fall 2026. The current launch MVP is live now; the service, student-helper network, volunteer model, and fuller marketplace are the next operating layer.",
        },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">THE PIVOT</span>
            <h2>THE MARKETPLACE STOPPED BEING THE PRODUCT.</h2>
          </div>
          <div className="caseStack">
            <p>At first, the idea centered on a UVA marketplace. The problem was that the marketplace was both cyclical and dependent on enough buyers and sellers showing up at the same time.</p>
            <p>Moving had a much clearer job to be done. If somebody needs help getting a couch out of a fourth-floor apartment, that problem is already real before we have perfect marketplace liquidity.</p>
            <p>So we flipped the relationship: moving became the primary offer, and the marketplace became the backbone around the move.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <span className="caseLabel">HOW WE MADE THE DECISION</span>
        <div className={styles.matrixWrap}>
          <div className={styles.axisY}>IMPORTANCE ↑</div>
          <div className={styles.matrix}>
            <article className={styles.quietCell}>
              <span>HIGH CONFIDENCE</span>
              <h3>Already understood</h3>
              <p>Do not spend the next week proving what we already believe.</p>
            </article>
            <article className={styles.focusCell}>
              <span>LOW CONFIDENCE</span>
              <h3>Important + unsure</h3>
              <p>This is where we focused: the assumptions that could kill the idea if we were wrong.</p>
            </article>
            <article className={styles.quietCell}>
              <span>LOW IMPORTANCE</span>
              <h3>Can wait</h3>
              <p>Interesting questions, but not the ones that determine whether MoveMate deserves to exist.</p>
            </article>
            <article className={styles.quietCell}>
              <span>LOW IMPORTANCE</span>
              <h3>Noise</h3>
              <p>Do not optimize this before the core behavior is real.</p>
            </article>
          </div>
          <div className={styles.axisX}>CONFIDENCE →</div>
        </div>
        <p className="caseFootnote">We listed about 20 assumptions, plotted how important each one was and how confident we were in it, then iterated on the important assumptions with the least evidence.</p>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">THE LAUNCH MVP</span>
            <h2>FIRST, FIND OUT IF PEOPLE ACTUALLY RAISE THEIR HAND.</h2>
          </div>
          <div className="caseStack">
            <p>The current MVP is intentionally earlier than the full service. The goal is not just vague “interest”; it is to get the first real people into the funnel so we have somebody to learn from and eventually serve.</p>
            <p>Posters around UVA point directly to the launch MVP. We are testing different messages and incentives instead of waiting until every piece of the moving operation and marketplace is finished.</p>
            <p>If the demand is there, we can fulfill the early moves, recruit student helpers or volunteers as we need them, and keep building the operating system behind the service.</p>
            <a className={styles.liveButton} href="https://move-mate.netlify.app" target="_blank" rel="noreferrer">OPEN MOVE-MATE.NETLIFY.APP ↗</a>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <span className="caseLabel">THE LOOP WE ARE BUILDING TOWARD</span>
        <div className={styles.loop}>
          <article>
            <span>MOVE OUT</span>
            <h3>Need help getting out?</h3>
            <p>Book the move. If you still have furniture or things you do not want, the marketplace is right there.</p>
          </article>
          <div className={styles.loopArrow}>→</div>
          <article className={styles.marketplace}>
            <span>BACKBONE</span>
            <h3>MoveMate marketplace</h3>
            <p>Items leaving one apartment can become things another student needs.</p>
          </article>
          <div className={styles.loopArrow}>→</div>
          <article>
            <span>MOVE IN</span>
            <h3>Still need something?</h3>
            <p>Get help moving in, then use the marketplace for the desk, lamp, couch, mini-fridge, or whatever is still missing.</p>
          </article>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">THE TEAM</span>
        <div className={styles.teamIntro}>
          <h2>FIVE OF US. ONE BUILDER. SHARED PRODUCT DECISIONS.</h2>
          <p>I am the only person writing the product code right now. That does not mean the rest of the project is solo. The pivot, assumption map, launch ideas, incentives, validation, and operating plan are things we work through together.</p>
        </div>
        <div className={styles.teamGrid}>
          {team.map((person) => (
            <article key={person.name}>
              <span>{person.year}</span>
              <h3>{person.name}</h3>
              <p>{person.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHAT HAPPENS NEXT</span>
            <h2>DO NOT BUILD THE WHOLE MOVING COMPANY BEFORE THE FIRST MOVE.</h2>
          </div>
          <div className="caseStack">
            <p>Use the MVP and posters to get the first real users.</p>
            <p>Learn which move-in and move-out jobs people actually ask for, then serve them and recruit supply only when demand requires it.</p>
            <p>Build the fuller moving workflow and marketplace around behavior we have actually seen instead of around assumptions we never tested.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
