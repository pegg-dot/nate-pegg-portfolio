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
    title: "Ask for what the internet cannot know",
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
            text: "Cold calling salons was rough. I wanted to show up with something useful before asking an owner for their time.",
          },
          {
            label: "HOW",
            text: "Google Places, public web research, and owner answers feed one structured business record that both templates and the dashboard use.",
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
            <p>I was trying to talk to salon owners, and just calling them with nothing to show was not a great way in. I thought it would be much better if I could send them something that already looked useful.</p>
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
          <p>I did not want every salon to look like the same AI-generated page with a different logo. The challenge was keeping one shared business model underneath very different designs.</p>
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
            <p>The same structured business data can feed either template and the shared site components.</p>
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
          <p>The product could not just end at “AI made a website.” The owner still needs to control the business information after the first generation.</p>
        </div>

        <figure className={styles.wideArtifact}>
          <Image
            src="/webuddy/owner-dashboard.jpg"
            loading="eager"
            alt="WeBuddy owner dashboard with publishing and site controls"
            width={1600}
            height={1000}
            sizes="100vw"
          />
          <figcaption>Owner dashboard · publishing · services · photos · reviews · site controls</figcaption>
        </figure>

        <div className={styles.editorGrid}>
          <div className={styles.editorCopy}>
            <span className="caseLabel">VISUAL EDITOR</span>
            <h3>The generated data stays editable.</h3>
            <p>Owners can change the mapped content, replace photos, update location and hours, and preview the site on desktop or mobile.</p>
            <p>WeBuddy also generates the basic SEO layer from the salon data, including page titles, meta descriptions, and business + FAQ structured data.</p>
          </div>
          <figure>
            <Image
              src="/webuddy/visual-editor.jpg"
              loading="eager"
              alt="WeBuddy visual editor showing salon location, hours and imagery"
              width={1600}
              height={1000}
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </figure>
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <span className="caseLabel">WHAT GOT HARD</span>
        <div className={styles.lessonGrid}>
          <article>
            <span>01</span>
            <h3>Make the salon structured.</h3>
            <p>The hard part was deciding what the system actually needs to know about a salon so the same record can power different templates without everything becoming generic.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Public data is messy.</h3>
            <p>Google gives a useful base, but services, prices, booking links, and the story of the business can be incomplete or spread across different public sources. AI search helps fill that in, but it is not perfect verification.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Generation cannot own the page.</h3>
            <p>I wanted the AI to fill a structured record first, not just generate one giant block of website code. That way the owner can keep editing the same underlying business instead of starting over.</p>
          </article>
          <article>
            <span>04</span>
            <h3>The product still has rough edges.</h3>
            <p>There are still things I would change around integrations, SEO, templates, and publishing. It works, but I do not think of it as finished.</p>
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
            <h2>THE REAL TEST IS WHETHER OWNERS CARE.</h2>
          </div>
          <div className="caseStack">
            <p>I built WeBuddy partly because I wanted a better way to get in front of salon owners. Now I am using it for outbound instead of just adding more templates.</p>
            <p>If I can send a salon something that already understands a lot of its business, that is a much better opening than another cold call. What I care about next is whether owners respond, what they change, and whether it actually helps me learn the market faster.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
