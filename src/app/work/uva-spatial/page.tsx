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
      subtitle="I started UVA Spatial OS during my first year at UVA because I realized I really didn't know my way around Grounds. Google Maps helped me get between buildings, but the routes it gave me weren't always the most efficient. It didn't know about the smaller paths and back ways I often took around campus. I thought I could make something that understood how I actually moved around UVA. I wanted it to find the quickest route, including those smaller paths, and use my class schedule to tell me when to leave. Ideally, it would know where I was, how long it would take me to get to class, and send me a notification when it was time to go. I also wanted the routes to follow paths that actually exist on Grounds."
      external={{ label: "GITHUB", href: "https://github.com/pegg-dot/uva-spatial-os" }}
      actions={[
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/uva-spatial-os", external: true },
      ]}
    >
      <ProjectBrief items={[
        {
          label: "WHAT",
          text: "A UVA navigation system that uses a student's schedule and the paths around Grounds to plan routes between classes.",
        },
        {
          label: "WHY",
          text: "Google Maps could get me near a building, but it didn't know my schedule, which entrance I needed, when I should leave, or the paths around Grounds I actually used.",
        },
        {
          label: "HOW",
          text: "I built a source registry from UVA public GIS, turned the walkway data into a deterministic pedestrian graph, added entrance evidence and route profiles, then put a schedule and day planner on top.",
        },
        {
          label: "WHEN",
          text: "I started it during my first year at UVA in 2026. It's still a local preview, and I need to check the routing data on Grounds before I'd call it ready to use.",
        },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT STARTED</span>
            <h2>I wanted my shortcuts to show up on the map.</h2>
          </div>
          <div className="caseStack">
            <p>At first, I pictured a visual version of Grounds that could show me where to go next. I also wanted it to know the smaller paths I took between buildings and plan around the classes I had that day.</p>
            <p>As I started building it, I realized a map could look believable and still send me to the wrong side of a building or along a path that doesn't connect. I had to figure out what campus data I could trust before I kept working on the 3D version.</p>
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
            <h2>The paths had to match the real campus.</h2>
          </div>
          <div className="caseStack">
            <p>The line on the map was the easy part. The harder part was deciding what I could actually trust. Two walkways can cross in 2D without really connecting. A building center is not the same thing as the door you can use. An accessible route needs actual accessible entrance evidence.</p>
            <p>I built the graph from UVA walkway data and kept the routing rules conservative. If there isn't enough evidence, the system blocks the route instead of filling in a gap because it looks like a path on the map.</p>
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
            <h2>I wanted it to plan around my classes.</h2>
          </div>
          <div className="caseStack">
            <p>I added My Day so I could enter classes myself or import a day's schedule and have it plan the walk between each class.</p>
            <p>The schedule import can read an .ics file or structured text. It doesn't use an LLM to guess what a location means. If a class location doesn't match a UVA building or a reviewed name for it, the app leaves it unresolved until I correct it.</p>
            <p>For something like this, I'd rather have it tell me it's unsure than send me to the wrong place.</p>
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
        <p className="caseFootnote">The five benchmark routes that do not route are kept blocked because the current evidence is missing a supported connection or entrance. I'd rather leave those visible than make the benchmark look better by guessing.</p>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT IS NOW</span>
            <h2>I haven't checked every route in person yet.</h2>
          </div>
          <div className="caseStack">
            <p>The local product can search UVA facilities, switch between fastest, accessible, night and low-hill routing, import a schedule, build a day, and calculate leave-by times. I've done a lot of testing and source checks, but I still don't want the page to make the data look more finished than it is.</p>
            <p>I still need to check more doors and route connections on Grounds before I'd trust this for getting around campus. The entrance data also needs to cover more of the ordinary buildings.</p>
            <p>I still want to build the visual version of UVA I pictured at the beginning. I want it to sit on top of routes I can trust.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
