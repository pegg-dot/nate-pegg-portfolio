import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";
import styles from "./movemate.module.css";

const team = [
  { name: "Nate Pegg", year: "First-year · UVA" },
  { name: "Jack Dofflemeyer", year: "Third-year · UVA" },
  { name: "Will Franey", year: "First-year · UVA" },
  { name: "Bobby Wholey", year: "First-year · UVA" },
  { name: "Jack Duffins", year: "Second-year · UVA" },
];

export default function MoveMateCase() {
  return (
    <CaseShell
      className="caseCompact movemateCase"
      index="09 / MOVEMATE"
      title="MOVEMATE"
      subtitle="MoveMate is a UVA project my friends and I started around move-in and move-out. We first thought the main thing would be a student marketplace for furniture, but after working through the idea we realized the more immediate problem was helping students actually move the stuff."
      external={{ label: "LAUNCH MVP", href: "https://move-mate.netlify.app" }}
      actions={[{ label: "OPEN LAUNCH MVP", href: "https://move-mate.netlify.app", external: true }]}
    >
      <ProjectBrief items={[
        {
          label: "WHAT",
          text: "Move-in and move-out help for UVA students, with a student marketplace around the same problem.",
        },
        {
          label: "WHY",
          text: "Students are constantly moving furniture in and out of apartments around UVA. The marketplace idea made sense, but the actual moving problem was more immediate.",
        },
        {
          label: "HOW",
          text: "We worked through about 20 assumptions, built a simple MVP, put posters around Grounds, and are trying to get real requests before building a huge operation around it.",
        },
        {
          label: "WHEN",
          text: "Started in fall 2026. The project was originally called HOOS Moving before becoming MoveMate.",
        },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT STARTED</span>
            <h2>A MARKETPLACE FOR MOVE-IN AND MOVE-OUT.</h2>
          </div>
          <div className="caseStack">
            <p>The first version of the idea was mostly a student marketplace. Around move-out, people have couches, desks, beds, mini-fridges, and a bunch of other stuff they need to get rid of. Then a few months later another group of students is moving in and needs a lot of the same things.</p>
            <p>It felt like there should be a better way to connect those two sides instead of having furniture get thrown out or students start from scratch every year.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">HOW IT CHANGED</span>
            <h2>MOVING HELP FIRST.</h2>
          </div>
          <div className="caseStack">
            <p>Once we started thinking about the marketplace more seriously, the cold-start problem became pretty obvious. A marketplace is only useful if enough buyers and sellers are there at the same time.</p>
            <p>The moving problem does not have that same issue. If somebody needs help getting a couch down four flights of stairs, they already have a problem even if there are zero listings on the marketplace.</p>
            <p>So we changed the order. Help with the move first, then let the marketplace handle the furniture that is still left over or the things somebody still needs.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">HOW WE THOUGHT THROUGH IT</span>
        <div className={styles.matrixWrap}>
          <div className={styles.axisY}>IMPORTANCE ↑</div>
          <div className={styles.matrix}>
            <article className={styles.quietCell}>
              <span>HIGH CONFIDENCE</span>
              <h3>We already had evidence.</h3>
              <p>These were not the questions we needed to spend the most time on.</p>
            </article>
            <article className={styles.focusCell}>
              <span>LOW CONFIDENCE</span>
              <h3>Important and still unclear.</h3>
              <p>This is where we focused because being wrong here could change the whole idea.</p>
            </article>
            <article className={styles.quietCell}>
              <span>LOW IMPORTANCE</span>
              <h3>Could wait.</h3>
              <p>Questions that mattered eventually, but not before we knew whether students cared.</p>
            </article>
            <article className={styles.quietCell}>
              <span>LOW IMPORTANCE</span>
              <h3>Not worth optimizing yet.</h3>
              <p>We did not want to spend time polishing things before the core behavior was real.</p>
            </article>
          </div>
          <div className={styles.axisX}>CONFIDENCE →</div>
        </div>
        <p className="caseFootnote">We wrote down about 20 assumptions, ranked them by how important they were and how confident we were in them, and tried to focus on the important ones we had the least evidence for.</p>
      </section>

      <section className="caseBand">
        <div className={styles.posterHeader}>
          <div>
            <span className="caseLabel">TESTING IT AT UVA</span>
            <h2>POSTERS AROUND GROUNDS.</h2>
          </div>
          <div className={styles.posterCopy}>
            <p>We built a simple MVP and started putting posters around UVA instead of waiting until the whole moving operation was finished.</p>
            <p>Different posters use different messages, but they all send people to the same place so we can see what actually gets students to respond.</p>
            <p>The earliest posters still use the HOOS Moving name because that was the name before we changed it to MoveMate.</p>
          </div>
        </div>

        <figure className={styles.posterCampaign}>
          <Image
            src="/movemate/poster-campaign.jpg"
            alt="MoveMate and HOOS Moving poster designs used around UVA Grounds"
            width={1000}
            height={563}
            sizes="100vw"
          />
          <figcaption>
            <strong>POSTERS WE TESTED AROUND GROUNDS.</strong>
            <span> The early designs use the HOOS Moving name because that was before we changed it to MoveMate.</span>
          </figcaption>
        </figure>
      </section>

      <section className="caseBand caseBandDark">
        <span className="caseLabel">HOW IT FITS TOGETHER</span>
        <div className={styles.loop}>
          <article>
            <span>MOVE OUT</span>
            <h3>Help getting everything out.</h3>
            <p>If there is furniture left over, it can move into the marketplace instead of just being thrown away.</p>
          </article>
          <div className={styles.loopArrow}>→</div>
          <article className={styles.marketplace}>
            <span>MARKETPLACE</span>
            <h3>Things one student no longer needs.</h3>
            <p>The same furniture can become something another student needs a few months later.</p>
          </article>
          <div className={styles.loopArrow}>→</div>
          <article>
            <span>MOVE IN</span>
            <h3>Help getting settled.</h3>
            <p>Then the marketplace can fill in whatever is still missing after the move.</p>
          </article>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">THE TEAM</span>
            <h2>FIVE OF US AT UVA.</h2>
          </div>
          <div className="caseStack">
            <p>I am the one writing the product code right now, but the idea is not something I am working on alone. The five of us have been working through the product, posters, testing, launch, and how we would actually fulfill the first moves.</p>
          </div>
        </div>
        <div className={styles.teamGrid}>
          {team.map((person) => (
            <article key={person.name}>
              <span>{person.year}</span>
              <h3>{person.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT IS NOW</span>
            <h2>THE MVP IS LIVE.</h2>
          </div>
          <div className="caseStack">
            <p>Right now we are trying to get the first actual requests instead of building a huge moving network before we know we need one.</p>
            <p>If people start asking for help, we can do the early moves ourselves and bring in student helpers or volunteers as demand grows. Then we can build more of the moving workflow and marketplace around what people actually use.</p>
            <a className={styles.liveButton} href="https://move-mate.netlify.app" target="_blank" rel="noreferrer">OPEN MOVE-MATE.NETLIFY.APP ↗</a>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
