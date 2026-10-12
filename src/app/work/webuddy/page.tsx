import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";
import styles from "./webuddy.module.css";

const inputRows = [
  {
    label: "GOOGLE PLACES",
    title: "Start with what already exists",
    text: "Name, address, phone, hours, rating, reviews, photos, website, and coordinates.",
  },
  {
    label: "PUBLIC WEB SEARCH",
    title: "Fill in more context",
    text: "Services, prices, booking links, Instagram, specialties, and more public review context.",
  },
  {
    label: "OWNER ANSWERS",
    title: "Ask for what the internet can’t know",
    text: "What they are known for, booking confirmation, average spend, template, plan, and account details.",
  },
];

export default function WeBuddyCase() {
  return (
    <CaseShell
      className="caseCompact webuddyCase"
      index="05 / WEBUDDY"
      title="WEBUDDY"
      subtitle="I built WeBuddy while I was cold-calling salons. I thought if I could send an owner something useful first, like a website already built from their business data, I would have a much better way into the conversation."
    >
      <ProjectBrief
        items={[
          {
            label: "WHAT",
            text: "A salon website generator that starts with public business data, asks the owner for what is missing, and turns it into a finished site they can edit and publish.",
          },
          {
            label: "WHY",
            text: "Getting my foot in the door with nail salons was rough. I thought a site I’d already built from the business’s data would give me something useful to send them.",
          },
          {
            label: "HOW",
            text: "Google Places and web research fill in what is already public, then the owner answers the things the internet can’t know, and all of that goes into one business record that the templates and dashboard use.",
          },
          {
            label: "WHEN",
            text: "Built in 2026 on Base44. It started as a way to get closer to salon owners while I was working on Della.",
          },
        ]}
      />

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT CAME FROM</span>
            <h2>COLD CALLING SALONS WAS ROUGH.</h2>
          </div>
          <div className="caseStack">
            <p>I was trying to talk to salon owners, and just calling them with nothing to show wasn’t a great way in. I thought it would be much better if I could send them something that already looked useful.</p>
            <p>The idea became: find the salon, pull the public information that already exists, ask the owner for the pieces only they know, and generate a site around the actual business instead of starting from a blank template.</p>
            <p>That made WeBuddy useful on its own, but it also gave me another reason to talk to the exact same owners I wanted to learn from for Della.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className={styles.compareHeader}>
          <div>
            <span className="caseLabel">THE OUTPUT</span>
            <h2>TWO VERY DIFFERENT SITES FROM THE SAME SYSTEM.</h2>
          </div>
          <p>I didn’t want every salon to look like the same AI-generated page with a different logo. The challenge was keeping one shared business model underneath very different designs.</p>
        </div>

        <div className={styles.templateCompare}>
          <figure>
            <Image
              src="/webuddy/nail-fever.jpg"
              loading="eager"
              alt="Nail Fever generated with WeBuddy's Soft Luxury template"
              width={1600}
              height={1000}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <figcaption><span>SOFT LUXURY</span><b>Nail Fever</b><small>same shared business record</small></figcaption>
          </figure>
          <figure className={styles.darkFigure}>
            <Image
              src="/webuddy/avant-garde.jpg"
              loading="eager"
              alt="Avant-Garde Salon and Spa generated with WeBuddy's Bold Studio template"
              width={1600}
              height={1000}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <figcaption><span>BOLD STUDIO</span><b>Avant-Garde Salon & Spa</b><small>same shared business record</small></figcaption>
          </figure>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <span className="caseLabel">HOW IT WORKS</span>
        <div className={styles.pipeline}>
          <div className={styles.inputs}>
            {inputRows.map((row) => (
              <article key={row.label}>
                <span>{row.label}</span>
                <h3>{row.title}</h3>
                <p>{row.text}</p>
              </article>
            ))}
          </div>

          <div className={styles.arrow}>→</div>

          <article className={styles.modelCard}>
            <span>ONE BUSINESS RECORD</span>
            <strong>ClientSite</strong>
            <b>96 fields</b>
            <p>Services, reviews, photos, hours, story, booking, SEO, location, domain, publishing state, and the rest of the salon profile live in one place.</p>
          </article>

          <div className={styles.arrow}>→</div>

          <article className={styles.mapperCard}>
            <span>SHARED MAPPER</span>
            <strong>mapSiteToProfile</strong>
            <p>Both templates read from the same salon data, so the design can change without having to rebuild all of the business information underneath it.</p>
          </article>

          <div className={styles.arrow}>→</div>

          <div className={styles.renderers}>
            <article><span>TEMPLATE A</span><b>Soft Luxury</b></article>
            <article><span>TEMPLATE B</span><b>Bold Studio</b></article>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className={styles.controlHeader}>
          <span className="caseLabel">AFTER GENERATION</span>
          <h2>THE OWNER CAN KEEP CHANGING IT.</h2>
          <p>The product couldn’t just end at “AI made a website.” The owner still needs a place to manage and update it after the first generation.</p>
        </div>

        <div className={styles.controlArtifacts}>
          <article className={styles.controlArtifact}>
            <div className={styles.controlArtifactCopy}>
              <span className="caseLabel">OWNER DASHBOARD</span>
              <h3>Publish and manage the site.</h3>
              <p>The dashboard is where the owner can see the site status, publish it, and manage the business information around it.</p>
            </div>
            <figure className={styles.focusArtifact}>
              <div className={`${styles.artifactViewport} ${styles.dashboardCrop}`}>
                <Image
                  src="/webuddy/owner-dashboard.jpg"
                  loading="eager"
                  alt="WeBuddy owner dashboard showing publishing controls, site status, services, photos and reviews"
                  width={1600}
                  height={1000}
                  sizes="100vw"
                />
              </div>
              <figcaption>Owner dashboard · publish state · site controls · services · photos · reviews</figcaption>
            </figure>
          </article>

          <article className={styles.controlArtifact}>
            <div className={styles.controlArtifactCopy}>
              <span className="caseLabel">VISUAL EDITOR</span>
              <h3>Edit the generated site itself.</h3>
              <p>The owner can change mapped content, replace photos, update location and hours, and preview the site on desktop or mobile before publishing.</p>
            </div>
            <figure className={styles.focusArtifact}>
              <div className={`${styles.artifactViewport} ${styles.editorCrop}`}>
                <Image
                  src="/webuddy/visual-editor.jpg"
                  loading="eager"
                  alt="WeBuddy visual editor showing the editable salon website preview"
                  width={1600}
                  height={1000}
                  sizes="100vw"
                />
              </div>
              <figcaption>Visual editor · editable sections · imagery · hours · location · desktop/mobile preview</figcaption>
            </figure>
          </article>
        </div>

        <p className={styles.controlFootnote}>WeBuddy also generates the basic SEO layer from the salon data, including page titles, meta descriptions, and business + FAQ structured data.</p>
      </section>

      <section className="caseBand caseBandInk">
        <span className="caseLabel">WHAT GOT HARD</span>
        <div className={styles.lessonGrid}>
          <article>
            <span>01</span>
            <h3>Figure out what the site actually needs to know.</h3>
            <p>The hard part was deciding what information about a salon had to exist in the shared record so two very different templates could still come from the same data without everything becoming generic.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Public data is messy.</h3>
            <p>Google gives a useful base, but services, prices, booking links, and the story of the business can be incomplete or spread across different public sources. AI search helps fill that in, but it isn’t perfect verification.</p>
          </article>
          <article>
            <span>03</span>
            <h3>The owner still needs to be able to change it.</h3>
            <p>I wanted the AI to fill in the salon’s data first instead of generating one giant block of website code, because then the owner can keep changing services, photos, hours, and the rest of the site without starting over.</p>
          </article>
          <article>
            <span>04</span>
            <h3>The product still has rough edges.</h3>
            <p>There are still things I would change around integrations, SEO, templates, and publishing. It works, but I don’t think of it as finished.</p>
          </article>
        </div>
      </section>

      <section className="caseBand">
        <div className={styles.platformSplit}>
          <article>
            <span className="caseLabel">BASE44 PROVIDED</span>
            <h3>The infrastructure.</h3>
            <p>Hosting, database, authentication, backend runtime, scheduling, AI calls, uploads, and the AI builder I used to implement the app.</p>
          </article>
          <article className={styles.mineCard}>
            <span className="caseLabel">I DESIGNED</span>
            <h3>The product.</h3>
            <p>The onboarding, business model, generation prompts, two templates, shared mapping layer, dashboard, and the way the salon data moves through the system.</p>
          </article>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT IS NOW</span>
            <h2>NOW I’M USING IT FOR OUTBOUND.</h2>
          </div>
          <div className="caseStack">
            <p>I built WeBuddy partly because I wanted a better way to get in front of salon owners. Now I’m using it for outbound instead of just adding more templates.</p>
            <p>If I can send a salon a site that already has a lot of its real business information in it, that gives me a much better opening than another cold call. Now I want to see whether owners respond, what they actually change, and whether it helps me learn more about the market while I’m working on Della.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
