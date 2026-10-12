import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";
import styles from "./spatial.module.css";

export default function UvaSpatialCase() {
  return (
    <CaseShell
      className="caseCompact spatialCase"
      index="08 / GROUNDS GUIDE"
      title="GROUNDS GUIDE"
      subtitle="I started Grounds Guide this year, my first year at UVA, after realizing I really didn't know my way around Grounds. Google Maps helped me get between buildings, but the routes it gave me weren't always the most efficient. It didn't know about the smaller paths and back ways I often took around campus. I thought I could make something that understood how I actually moved around UVA. I wanted it to find the quickest route, including those smaller paths, and use my class schedule to tell me when to leave. Ideally, it would know where I was, how long it would take me to get to class, and send me a notification when it was time to go. I also wanted the routes to follow paths that actually exist on Grounds."
      external={{ label: "GITHUB", href: "https://github.com/pegg-dot/grounds-guide" }}
      actions={[
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/grounds-guide", external: true },
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
          text: "I built a source registry from the public GIS and other data I could find from UVA, then aggregated the walkway data into paths and a deterministic pedestrian graph. I added entrance evidence and routing profiles for things like accessible, night, and low-hill routes, then put the schedule importer and day planner on top.",
        },
        {
          label: "WHEN",
          text: "It's still a local preview, and I need to check the routing data on Grounds before I'd call it ready to use.",
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
            <p>It was pretty easy to find a route between two places at UVA, but figuring out whether that route actually worked was a lot harder, because two paths can cross on a map without connecting and the center of a building doesn’t tell you which door you can actually use. That was when I started checking the campus data more carefully before I kept building the 3D version.</p>
          </div>
        </div>
      </section>

      <section className={`caseBand ${styles.previewBand}`}>
        <div className={styles.previewIntro}>
          <span className="caseLabel">THE PRODUCT</span>
          <h2>This is what Grounds looks like now.</h2>
          <p>These are real screenshots from the local build. The 2D view is what I use for the normal campus map, and the 3D view is the part I kept coming back to because I wanted Grounds to feel like UVA, not just another directions app.</p>
        </div>

        <div className={styles.previewGallery}>
          <figure className={`${styles.previewFrame} ${styles.previewWide}`}>
            <Image
              src="/uva-spatial/grounds-2d-overview.png"
              alt="Grounds Guide 2D campus overview with the schedule import panel"
              width={1648}
              height={928}
              sizes="100vw"
              priority
            />
            <figcaption>
              The 2D campus view. The schedule import lives right on top of the map because the point is to connect where I need to be with how I actually get there.
            </figcaption>
          </figure>

          <figure className={styles.previewFrame}>
            <Image
              src="/uva-spatial/grounds-3d-overview.png"
              alt="Grounds Guide 3D campus model showing UVA buildings across Grounds"
              width={1648}
              height={928}
              sizes="(max-width: 820px) 100vw, 50vw"
              loading="eager"
            />
            <figcaption>
              The same campus in 3D. I wanted the buildings and the Lawn to be recognizable enough that the map feels like a place I actually know.
            </figcaption>
          </figure>

          <figure className={styles.previewFrame}>
            <Image
              src="/uva-spatial/grounds-rotunda-close.png"
              alt="Grounds Guide close 3D view of the Rotunda, Lawn rooms, and nearby buildings"
              width={1648}
              height={928}
              sizes="(max-width: 820px) 100vw, 50vw"
              loading="eager"
            />
            <figcaption>
              A closer look at the Rotunda and the Lawn. This is the level of detail I was trying to get to before layering directions on top of it.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">ROUTING</span>
            <h2>The paths had to match the real campus.</h2>
          </div>
          <div className="caseStack">
            <p>It was easy enough to draw a route across the university, but deciding what actually worked was more difficult. Two walkways can cross in 2D without really connecting, the center of a building isn’t the same thing as the entrance you can use, and an accessible route needs an actual accessible entrance.</p>
            <p>I built the graph from UVA walkway data, but I don’t let the app assume two things connect just because they look close on the map. If the data doesn’t support the connection, it blocks the route instead of guessing.</p>
            <p>The three-dimensional copy of Grounds can make it easier to understand where you’re going, but it can’t create a walkway or override the existing routing rules.</p>
          </div>
        </div>

        <div className={styles.flow} aria-label="Grounds Guide routing flow">
          <div><span>01</span><b>SCHEDULE</b><small>the student&apos;s real day</small></div>
          <i>→</i>
          <div><span>02</span><b>RESOLVE</b><small>facility + reviewed alias</small></div>
          <i>→</i>
          <div><span>03</span><b>DOOR</b><small>entrance evidence</small></div>
          <i>→</i>
          <div><span>04</span><b>GRAPH</b><small>UVA walkway graph</small></div>
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
            <p>I added My Day so I could enter classes myself or import a day’s schedule and have it plan the walk between each class.</p>
            <p>There is a schedule importer where I can import my class schedule, and it extracts the classes and tries to resolve each one to the UVA building or location it belongs to. If it doesn’t know a location well enough, it leaves it unresolved and asks me to correct it instead of guessing.</p>
            <p>For something like this, I’d rather have it tell me it’s unsure than send me to the wrong place.</p>
          </div>
        </div>

        <figure className={`${styles.previewFrame} ${styles.scheduleFrame}`}>
          <Image
            src="/uva-spatial/schedule-import.png"
            alt="Grounds Guide schedule import preview with resolved UVA locations"
            width={1440}
            height={1000}
            sizes="100vw"
          />
          <figcaption>
            The schedule importer can read an .ics file or structured text. Locations it recognizes resolve automatically, and unclear ones stay unresolved until I correct them.
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
        <p className="caseFootnote">The five benchmark routes that don’t route are kept blocked because the current evidence is missing a supported connection or entrance. I’d rather leave those visible than make the benchmark look better by guessing.</p>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT IS NOW</span>
            <h2>I haven’t checked every route in person yet.</h2>
          </div>
          <div className="caseStack">
            <p>The local product can search UVA facilities, switch between fastest, accessible, night and low-hill routing, import a schedule, build a day, and calculate leave-by times. I’ve done a lot of testing and source checks, but I still don’t want the page to make the data look more finished than it is.</p>
            <p>I still need to check more doors and route connections on Grounds before I’d trust this for getting around campus. The entrance data also needs to cover more of the ordinary buildings.</p>
            <p>I still want to build the visual version of UVA I pictured at the beginning. I want it to sit on top of routes I can trust.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
