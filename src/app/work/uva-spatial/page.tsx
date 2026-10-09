import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";
import styles from "./spatial.module.css";

export default function UvaSpatialCase() {
  return (
    <CaseShell
      className="caseCompact spatialCase"
      index="08 / UVA SPATIAL OS"
      title="UVA SPATIAL OS"
      subtitle="UVA Spatial OS is a campus navigation project I started after getting to UVA and realizing I did not really know my way around Grounds. I wanted something that could take my actual schedule, know the building and entrance I needed, tell me when to leave, and route me through the paths that actually exist."
      external={{ label: "GITHUB", href: "https://github.com/pegg-dot/uva-spatial-os" }}
      actions={[
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/uva-spatial-os", external: true },
      ]}
    >
      <ProjectBrief items={[
        {
          label: "WHAT",
          text: "A UVA-first navigation system that turns a student's real schedule into door-aware routes between classes and other places around Grounds.",
        },
        {
          label: "WHY",
          text: "Google Maps could get me near a building, but it did not know my schedule, which entrance I needed, when I should leave, or the paths around Grounds I actually cared about.",
        },
        {
          label: "HOW",
          text: "I built a source registry from UVA public GIS, turned the walkway data into a deterministic pedestrian graph, added entrance evidence and route profiles, then put a schedule and day planner on top.",
        },
        {
          label: "WHEN",
          text: "Started after I got to UVA in 2026. It is still a local preview and I am intentionally not calling it production-ready until the routing data is field-validated.",
        },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT STARTED</span>
            <h2>I DIDN&apos;T KNOW MY WAY AROUND GROUNDS.</h2>
          </div>
          <div className="caseStack">
            <p>When I got to UVA, I barely knew where anything was. Google Maps was useful, but it was not really the thing I wanted. I wanted to be able to put in my actual day and have something tell me where I needed to go next, which way to walk, and when I needed to leave.</p>
            <p>My first instinct was to make the campus itself really visual, almost like a 3D version of Grounds. Once I started working on it, I realized that a map can look completely believable and still send you to the wrong side of a building or through a path that does not actually connect. So I backed up and started with the routing data first.</p>
          </div>
        </div>
      </section>

      <section className={`caseBand ${styles.previewBand}`}>
        <figure className={styles.previewFrame}>
          <Image
            src="/uva-spatial/route-home.png"
            alt="UVA Spatial OS local student route preview"
            width={1440}
            height={1000}
            sizes="100vw"
            priority
          />
          <figcaption>
            The local student preview. The route engine stays separate from the visual layer, and the product is still explicitly marked as not production-validated.
          </figcaption>
        </figure>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">ROUTING</span>
            <h2>A ROUTE THAT LOOKS RIGHT CAN STILL BE WRONG.</h2>
          </div>
          <div className="caseStack">
            <p>The line on the map was the easy part. The harder part was deciding what I could actually trust. Two walkways can cross in 2D without really connecting. A building center is not the same thing as the door you can use. An accessible route needs actual accessible entrance evidence.</p>
            <p>I built the graph from source-backed UVA walkway data and kept the routing rules conservative on purpose. If the evidence is not good enough, the system blocks the route instead of filling in the gap because it looks obvious on a screen.</p>
            <p>That also meant keeping the 3D campus separate. The visual world can make the route easier to understand later, but it never gets to create a walkway or override the routing graph.</p>
          </div>
        </div>

        <div className={styles.flow} aria-label="UVA Spatial OS routing flow">
          <div><span>01</span><b>SCHEDULE</b><small>the student&apos;s real day</small></div>
          <i>→</i>
          <div><span>02</span><b>RESOLVE</b><small>facility + reviewed alias</small></div>
          <i>→</i>
          <div><span>03</span><b>DOOR</b><small>entrance evidence</small></div>
          <i>→</i>
          <div><span>04</span><b>GRAPH</b><small>source-backed walkways</small></div>
          <i>→</i>
          <div><span>05</span><b>ROUTE</b><small>fastest · accessible · night · low hill</small></div>
          <i>→</i>
          <div><span>06</span><b>LEAVE</b><small>ETA + leave-by time</small></div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">MY DAY</span>
            <h2>THE CALENDAR IS PART OF THE ROUTE.</h2>
          </div>
          <div className="caseStack">
            <p>A route is not that useful if the app does not know where I actually need to be next. I added a My Day mode where I can enter classes manually or import one day from a calendar and route the transitions between them through the same engine.</p>
            <p>The schedule import is deterministic. It can read an .ics file or structured pasted text, but it does not use an LLM to guess what a location means. If a class location does not match a reviewed UVA facility or alias, it stays unresolved until I correct it.</p>
            <p>That was intentional. For something like this, I would rather have the system tell me it is unsure than confidently send me to the wrong place.</p>
          </div>
        </div>

        <figure className={`${styles.previewFrame} ${styles.scheduleFrame}`}>
          <Image
            src="/uva-spatial/schedule-import.png"
            alt="UVA Spatial OS schedule import preview with resolved UVA locations"
            width={1440}
            height={1000}
            sizes="100vw"
          />
          <figcaption>
            Deterministic schedule import. Exact reviewed locations resolve; ambiguous ones stay visible for correction.
          </figcaption>
        </figure>
      </section>

      <section className="caseBand caseBandBlue">
        <span className="caseLabel">CURRENT LOCAL SNAPSHOT</span>
        <div className={styles.snapshotGrid}>
          <article><strong>822</strong><span>UVA facility records</span></article>
          <article><strong>9,501</strong><span>pedestrian graph nodes</span></article>
          <article><strong>4</strong><span>route profiles</span></article>
          <article><strong>20 / 25</strong><span>benchmark routes currently routed</span></article>
        </div>
        <p className="caseFootnote">The five benchmark routes that do not route are kept blocked because the current evidence is missing a supported connection or entrance. I would rather leave those visible than make the benchmark look better by guessing.</p>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT IS NOW</span>
            <h2>IT&apos;S STILL A PREVIEW.</h2>
          </div>
          <div className="caseStack">
            <p>The local product can search UVA facilities, switch between fastest, accessible, night and low-hill routing, import a schedule, build a day, and calculate leave-by times. There is also a lot of testing and source auditing behind it because I do not want the UI to make the data look more finished than it is.</p>
            <p>The big thing still missing is field validation. There are doors and route connections I need to actually check on Grounds before I would trust this as a real navigation product. Ordinary entrance coverage also still needs to get broader before the preview works well across the whole campus.</p>
            <p>After that, I still want to come back to the part that made me want to build it in the first place: a really good visual version of UVA. I just want the cool part sitting on top of something that is actually right.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
