import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function PlasticCase() {
  return (
    <CaseShell
      className="caseCompact plasticCase"
      index="07 / SAY NO TO PLASTIC"
      title="SAY NO TO PLASTIC"
      subtitle="I built Say No To Plastic for Dr. Elie Haddad around his new book, Homo Plasticus. It started as a website to sell the book and has since turned into a much larger project around education, newsletters, media, and raising awareness about microplastics."
      external={{ label: "LIVE SITE", href: "https://saynotoplastic.com" }}
      actions={[
        { label: "OPEN SITE", href: "https://saynotoplastic.com", external: true },
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/SayNoToPlastic", external: true },
      ]}
    >
      <ProjectBrief items={[
        {
          label: "WHAT",
          text: "A public education platform around Homo Plasticus, microplastics, and Dr. Haddad's broader work. It now includes the book, interactive science, newsletters, podcast and TEDx content, practical guides, and owner tools.",
        },
        {
          label: "WHY",
          text: "The original goal was to give people a place to buy the book, learn more about plastic, sign up for weekly newsletters, and eventually support a broader project around affiliates, products, and awareness.",
        },
        {
          label: "HOW",
          text: "I built the site around an interactive body journey, study-backed content, practical exposure guides, book and media pages, newsletter infrastructure, admin tools, and a source/validation system underneath it.",
        },
        {
          label: "WHEN",
          text: "Built in 2026 as a real client project for Dr. Elie Haddad. The scope kept growing as we figured out what the project could become.",
        },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT STARTED</span>
            <h2>IT STARTED AS A WEBSITE FOR HIS NEW BOOK.</h2>
          </div>
          <div className="caseStack">
            <p>Dr. Elie Haddad originally asked me to build a website around his new book, <em>Homo Plasticus</em>. The goal was not just to have a page where people could buy the book, but to create a place where people could learn more about plastic, sign up for newsletters, and eventually support a broader project around affiliates, products, and awareness.</p>
            <p>It started as a website to sell his book, and since then it has turned into a much larger project.</p>
          </div>
        </div>
      </section>

      <section className="caseBand plasticVisualBand">
        <div className="caseImageWide plasticImage">
          <Image
            src="/plastic/home.jpg"
            alt="Say No To Plastic interactive educational website"
            fill
            sizes="100vw"
          />
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHAT IT TURNED INTO</span>
            <h2>THE BOOK BECAME ONE PART OF A MUCH BIGGER SITE.</h2>
          </div>
          <div className="caseStack">
            <p>As we kept working on it, the site expanded into the main home for the science, the book, weekly newsletters, practical guides, Dr. Haddad’s podcast and TEDx work, and the other parts of the project.</p>
            <p>The biggest visual piece became the body experience. Instead of just putting research into cards or articles, I wanted somebody to be able to move through the body and understand where researchers are actually finding plastic-derived material and what each study does and does not show.</p>
            <p>We also built the less visible parts around that: newsletter sending, owner-facing content tools, Spanish content, source traceability, and validation so the site could keep growing without every change turning into a rebuild.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">THE PART I KEPT PUSHING</span>
            <h2>THE MICROPLASTICS HAD TO FEEL LIKE PART OF THE BODY.</h2>
          </div>
          <div className="caseStack">
            <p>I did not want the anatomy section to just have a generic image of microplastics sitting beside it. I wanted the particles to actually exist inside and around the live 3D body so the science felt connected to what you were looking at.</p>
            <p>I also kept changing how the particles looked because having every one of them show up as the same little colored dot felt fake. I wanted fibers, flakes, shards, different sizes and colors, and enough variation that it felt more like the material the site was actually talking about.</p>
            <p>A lot of the work became figuring out how to make a pretty technical subject feel visual without turning it into decoration.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHAT MADE IT HARD</span>
            <h2>THE VISUALS COULD NOT SAY MORE THAN THE SCIENCE DID.</h2>
          </div>
          <div className="caseStack">
            <p>Microplastics are a subject where it is very easy to make something sound scarier or more certain than the underlying research actually is. A dramatic body visualization can make a claim feel authoritative even when the paper itself is much narrower.</p>
            <p>So I ended up caring a lot about keeping the source, what the study found, and its limitations attached to the experience. The repo has source audits, content validation, accessibility checks, and release checks because I did not want the visual side to outrun the evidence underneath it.</p>
            <p>The challenge was making the science understandable for a normal person without pretending the research proves something it does not.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WORKING WITH A REAL CLIENT</span>
            <h2>THE PROJECT KEPT CHANGING AS WE USED IT.</h2>
          </div>
          <div className="caseStack">
            <p>This was also one of the projects where I learned how different it is to build for an actual person instead of just myself. Dr. Haddad would review the site, send changes, add new ideas, and sometimes the thing we thought was finished would turn into another part of the project.</p>
            <p>That is how the site ended up expanding from the book into newsletters, the science experience, podcast and TEDx content, owner tools, Spanish parity, and the other pieces that are there now.</p>
            <p>I had to keep making those additions without letting the whole thing turn into a bunch of disconnected pages.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">WHAT EXISTS NOW</span>
        <div className="buildFacts">
          <span>Homo Plasticus</span>
          <span>whole-body journey</span>
          <span>organ-by-organ evidence</span>
          <span>3D anatomy</span>
          <span>weekly newsletters</span>
          <span>practical guides</span>
          <span>podcast + TEDx</span>
          <span>Spanish content</span>
          <span>source traceability</span>
          <span>owner tools</span>
        </div>
      </section>
    </CaseShell>
  );
}
