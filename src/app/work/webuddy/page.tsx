import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";
import styles from "./webuddy.module.css";

const inputRows = [
  {
    label: "GOOGLE PLACES",
    title: "The public listing",
    text: "Name, address, phone, hours, rating, review count, a small set of reviews and photos, website, and map coordinates.",
  },
  {
    label: "PUBLIC WEB SEARCH",
    title: "The missing context",
    text: "AI web search looks for services and prices, the booking link, Instagram handle, an about blurb, specialties, and more public review text.",
  },
  {
    label: "OWNER ANSWERS",
    title: "The parts only they know",
    text: "What they are known for, booking link confirmation, average spend, template, plan, email, and name. The onboarding is five screens.",
  },
];

export default function WeBuddyCase() {
  return (
    <CaseShell
      index="05 / WEBUDDY"
      title="WEBUDDY"
      subtitle="WeBuddy turns salon information into a structured business profile, then maps that profile into a finished website. I built it partly because I wanted a useful way to get my foot in the door with salon owners."
    >
      <ProjectBrief
        items={[
          {
            label: "WHAT",
            text: "A website system for salons. It starts with public business data and a short owner onboarding, normalizes everything into one 96-field ClientSite record, generates the missing copy and SEO fields, and renders the same model through reusable templates.",
          },
          {
            label: "WHY",
            text: "I did not want another blank-page website builder. I wanted to start with the business itself, get a salon to something useful quickly, and have a reason to start a real conversation with the owner.",
          },
          {
            label: "HOW",
            text: "Google Places + public web search + owner answers feed one shared data model. mapSiteToProfile turns that model into the shape every template and shared widget reads. The owner can then publish, edit, and keep using the site.",
          },
          {
            label: "WHEN",
            text: "Built in 2026 on Base44. Base44 provides hosting, database, auth, backend runtime, scheduling, and AI calls. I designed the product, onboarding flow, data model, generation prompts, background generation system, templates, mapping layer, and dashboard.",
          },
        ]}
      />

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHY I BUILT IT</span>
            <h2>I WANTED A WAY INTO THE SALON.</h2>
          </div>
          <div className="caseStack">
            <p>I was already spending a lot of time thinking about salons. WeBuddy was a way to show up with something useful instead of just asking an owner for their time.</p>
            <p>The idea was simple: do not make the owner start from a blank page. Start from the business data that already exists, ask for the pieces that are missing, and turn that into a site they can actually use.</p>
            <p>I am starting to send outbound emails now. The next test is whether the product actually gets me into conversations with salon owners.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className={styles.compareHeader}>
          <div>
            <span className="caseLabel">TWO TEMPLATES, ONE MODEL</span>
            <h2>THE PAGE WAS NOT THE HARD PART.</h2>
          </div>
          <p>The hard part was formalizing the salon once, then making that same structured data work across very different designs without making every business feel like the same generated site.</p>
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
            <figcaption><span>SOFT LUXURY</span><b>Nail Fever</b><small>same shared ClientSite shape</small></figcaption>
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
            <figcaption><span>BOLD STUDIO</span><b>Avant-Garde Salon & Spa</b><small>same shared ClientSite shape</small></figcaption>
          </figure>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <span className="caseLabel">THE PIPELINE</span>
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
            <span>ONE RECORD</span>
            <strong>ClientSite</strong>
            <b>96 fields</b>
            <p>Identity, contact, location, hours, services, reviews, photos, story, specialties, trust copy, booking, languages, SEO, billing, domain, and generation state.</p>
          </article>

          <div className={styles.arrow}>→</div>

          <article className={styles.mapperCard}>
            <span>SHARED MAPPER</span>
            <strong>mapSiteToProfile</strong>
            <p>One function converts the record into the shape both templates and the shared site widgets understand.</p>
          </article>

          <div className={styles.arrow}>→</div>

          <div className={styles.renderers}>
            <article><span>TEMPLATE A</span><b>Soft Luxury</b></article>
            <article><span>TEMPLATE B</span><b>Bold Studio</b></article>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">GENERATION</span>
            <h2>THE DATA GETS FILLED IN BEFORE THE DESIGN GETS PRETTY.</h2>
          </div>
          <div className="caseStack">
            <p>Google Places gives the stable listing data. Public web search tries to fill in services, prices, booking links, specialties, and more review context. The owner confirms or adds the pieces that matter.</p>
            <p>Then the generation step writes the tagline, subheading, about text, owner story, service descriptions, FAQs, why-us points, hygiene and guarantee copy, plus the SEO title and description.</p>
            <p>The important part is that generation does not directly own the page. It fills the structured record first, so the templates are rendering data instead of one-off AI markup.</p>
          </div>
        </div>

        <div className={styles.generationStrip}>
          <div><span>01</span><b>SAVE THE BUSINESS</b></div>
          <div><span>02</span><b>ENRICH PUBLIC DATA</b></div>
          <div><span>03</span><b>GENERATE COPY</b></div>
          <div><span>04</span><b>MAP TO TEMPLATE</b></div>
          <div><span>05</span><b>OWNER EDITS + PUBLISHES</b></div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className={styles.controlHeader}>
          <span className="caseLabel">AFTER GENERATION</span>
          <h2>THE OWNER STILL NEEDS CONTROL.</h2>
          <p>The generated site is the beginning, not the final screenshot. The dashboard carries the site forward after onboarding.</p>
        </div>

        <figure className={styles.wideArtifact}>
          <Image
            src="/webuddy/owner-dashboard.jpg"
            loading="eager"
            alt="WeBuddy owner dashboard with publishing, site controls, reviews, photos and revenue attribution"
            width={1600}
            height={1000}
            sizes="100vw"
          />
          <figcaption>Owner dashboard · publish state · services · photos · reviews · site link · booking revenue</figcaption>
        </figure>

        <div className={styles.editorGrid}>
          <div className={styles.editorCopy}>
            <span className="caseLabel">VISUAL EDITOR</span>
            <h3>Mapped data stays editable.</h3>
            <p>The owner can edit the sections that came out of the structured profile, replace photos, update trust and safety copy, work with location and hours, and preview desktop or mobile.</p>
            <p>That mattered because the system could not end at “AI made a website.” It had to leave the business with something it could keep changing.</p>
          </div>
          <figure>
            <Image
              src="/webuddy/visual-editor.jpg"
              loading="eager"
              alt="WeBuddy visual editor showing mapped salon location, hours and replaceable imagery"
              width={1600}
              height={1000}
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </figure>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">SEO</span>
            <h2>USE THE DATA THE SALON ALREADY HAS.</h2>
          </div>
          <div className="caseStack">
            <p>WeBuddy generates page titles, meta descriptions, and schema.org business + FAQ data from the salon&apos;s Google listing.</p>
            <p>The site also adds business, service, FAQ, page, site, and breadcrumb structured data; Open Graph and Twitter fields; location metadata; and lets owners add Google Analytics, Meta Pixel, or Clarity IDs.</p>
            <p>The “Get Found” view checks basic visibility and whether the salon&apos;s name, address, and phone match the Google listing.</p>
            <p className={styles.caveat}>It is not a finished SEO platform. Sites are still single-page, there is no sitemap or service-page system yet, and some metadata/canonical behavior still needs work for custom domains.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <span className="caseLabel">WHAT GOT HARD</span>
        <div className={styles.lessonGrid}>
          <article>
            <span>01</span>
            <h3>Formalize once.</h3>
            <p>If every template expects different fields, there is no system. The shared model had to be specific enough to render a real salon but stable enough that every template could depend on it.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Differentiate enough.</h3>
            <p>A schema can make the sites consistent, but too little business-specific data makes them feel identical. I had to keep adding the kinds of information that actually change the story and presentation.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Public research is not truth.</h3>
            <p>The web-search enrichment is useful, but it is still AI reading public results. The prompt says not to invent things, but there is no deterministic verification layer behind it yet.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Generation has to survive retries.</h3>
            <p>The business record is saved first, then the AI work happens in the background. That separation made it possible to retry generation without losing the salon or rebuilding the whole onboarding flow.</p>
          </article>
        </div>
      </section>

      <section className="caseBand">
        <div className={styles.platformSplit}>
          <article>
            <span className="caseLabel">BASE44 PROVIDES</span>
            <h3>The platform underneath it.</h3>
            <p>Hosting and deploys, database and login, backend function runtime, scheduler, AI calls, outgoing email, file uploads, and the AI builder I used to implement the app.</p>
          </article>
          <article className={styles.mineCard}>
            <span className="caseLabel">I DESIGNED</span>
            <h3>The product on top.</h3>
            <p>The product and onboarding flow, the 96-field data model, generation prompts, background generation design, two templates, shared mapping layer, dashboard, and the way the salon data moves through the system.</p>
          </article>
        </div>
        <p className={styles.platformNote}>I built WeBuddy on Base44 rather than writing the entire infrastructure stack by hand. The interesting part for me was deciding what the product should know about a salon, how that information should be represented, and how every part of the site should depend on it.</p>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">NOW</span>
            <h2>THE NEXT TEST IS NOT ANOTHER TEMPLATE.</h2>
          </div>
          <div className="caseStack">
            <p>I am starting outbound now.</p>
            <p>WeBuddy was always partly a way to get my foot in the door. If I can send a salon something that already understands its business and looks useful, I have a much better reason to start the conversation.</p>
            <p>The next thing I care about is whether owners actually respond, what they want changed, and whether the system helps me learn the market faster.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
