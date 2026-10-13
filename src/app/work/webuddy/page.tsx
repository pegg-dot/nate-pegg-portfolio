import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";
import styles from "./webuddy.module.css";

const inputRows = [
  { label: "GOOGLE PLACES", title: "Start with the listing", text: "Name, hours, reviews, photos, address, phone, and website." },
  { label: "PUBLIC WEB", title: "Fill in the gaps", text: "Services, prices, booking links, Instagram, and specialties." },
  { label: "OWNER", title: "Ask what only they know", text: "What they are known for, corrections, preferences, and publishing details." },
];

export default function WeBuddyCase() {
  return (
    <CaseShell
      className="caseCompact webuddyCase"
      index="05 / WEBUDDY"
      title="WEBUDDY"
      subtitle="A salon website builder I made while cold-calling salons. Search the business, pull in what already exists online, then give the owner a site they can edit and publish."
      external={{ label: "OPEN WEBUDDY", href: "https://webuddy.base44.app" }}
      actions={[{ label: "OPEN WEBUDDY", href: "https://webuddy.base44.app", external: true }]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A salon website builder that turns a Google listing and a few owner answers into an editable site." },
        { label: "WHY", text: "I wanted something useful to send a salon instead of another cold call." },
        { label: "HOW", text: "Google data, public web research, and owner answers feed one business record that the site templates use." },
        { label: "WHEN", text: "Built in 2026 on Base44 while I was working on Della." },
      ]} />

      <section className="caseBand">
        <div className={styles.compareHeader}>
          <div>
            <span className="caseLabel">THE CURRENT PRODUCT</span>
            <h2>START WITH THE SALON.</h2>
          </div>
          <p>The landing page now starts with the business itself. WeBuddy pulls in the salon&apos;s public information, builds the first version, and leaves the owner with something they can keep changing.</p>
        </div>

        <div className={styles.templateCompare}>
          <figure>
            <Image
              src="/webuddy/current-home.jpg"
              loading="eager"
              alt="Current WeBuddy landing page with the salon search and generated site preview"
              width={1536}
              height={960}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <figcaption><span>CURRENT HOME</span><b>Search the salon</b><small>Google listing → first site</small></figcaption>
          </figure>
          <figure>
            <Image
              src="/webuddy/current-features.jpg"
              loading="eager"
              alt="Current WeBuddy product page showing generated services and the salon question-and-answer feature"
              width={1536}
              height={960}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <figcaption><span>ON THE SITE</span><b>Services + salon Q&amp;A</b><small>prices · hours · booking</small></figcaption>
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
            <p>Services, photos, reviews, hours, booking, location, SEO, and publishing state live in one place.</p>
          </article>

          <div className={styles.arrow}>→</div>

          <article className={styles.mapperCard}>
            <span>SHARED MAPPER</span>
            <strong>mapSiteToProfile</strong>
            <p>The same salon data can feed different designs without rebuilding the business information.</p>
          </article>

          <div className={styles.arrow}>→</div>

          <div className={styles.renderers}>
            <article><span>TEMPLATE A</span><b>Soft Luxury</b></article>
            <article><span>TEMPLATE B</span><b>Bold Studio</b></article>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHY I BUILT IT</span>
            <h2>A BETTER WAY INTO SALONS.</h2>
          </div>
          <div className="caseStack">
            <p>Cold-calling with nothing to show was rough. I thought it would be better to send an owner something useful that was already built around their actual business.</p>
            <p>It also gave me another reason to talk to the same salon owners I wanted to learn from while building Della.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className={styles.controlHeader}>
          <span className="caseLabel">AFTER GENERATION</span>
          <h2>THE OWNER CAN KEEP CHANGING IT.</h2>
          <p>The generated page is the starting point. Services, prices, photos, hours, location, booking links, and other salon information can be changed before publishing.</p>
        </div>
        <div className={styles.platformSplit}>
          <article>
            <span className="caseLabel">BASE44</span>
            <h3>The infrastructure.</h3>
            <p>Hosting, database, authentication, backend runtime, uploads, scheduling, and the AI builder I used to implement the app.</p>
          </article>
          <article className={styles.mineCard}>
            <span className="caseLabel">I DESIGNED</span>
            <h3>The product.</h3>
            <p>The onboarding, business record, generation prompts, templates, mapping layer, editing flow, and how the salon data moves through the system.</p>
          </article>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT IS NOW</span>
            <h2>USING IT FOR OUTBOUND.</h2>
          </div>
          <div className="caseStack">
            <p>Now the question is simple: if I send a salon a site that already looks like their business, will the owner care enough to respond and use it?</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
