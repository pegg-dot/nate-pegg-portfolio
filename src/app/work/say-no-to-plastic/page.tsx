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
          text: "A website around Dr. Haddad's book and his work on microplastics. It now includes the book, science pages, newsletters, a body experience, practical guides, podcast and TEDx content, and tools for managing the site.",
        },
        {
          label: "WHY",
          text: "The original goal was to give people a place to buy the book, learn more about plastic, sign up for weekly newsletters, and eventually grow the project through things like affiliates, products, and more awareness.",
        },
        {
          label: "HOW",
          text: "I built the site, the interactive body experience, newsletter flow, book and media pages, admin tools, Spanish content, and the source and validation work behind the science pages.",
        },
        {
          label: "WHEN",
          text: "Built in 2026 for Dr. Elie Haddad. It started as a book website and kept expanding as we worked on it.",
        },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">WHERE IT STARTED</span>
            <h2>HOMO PLASTICUS.</h2>
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
            <span className="caseLabel">HOW IT GREW</span>
            <h2>MORE THAN A BOOK SITE.</h2>
          </div>
          <div className="caseStack">
            <p>As we kept working on it, we kept adding more. We added the science pages, the anatomy experience, weekly newsletters, practical guides, Dr. Haddad’s podcast and TEDx work, Spanish content, and admin tools so he could manage parts of the site himself.</p>
            <p>A lot of the project grew from Dr. Haddad going through the site, sending me changes, and coming up with new things he wanted to add. Something we thought was finished would usually lead to another part of the site.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">THE BODY EXPERIENCE</span>
            <h2>MAKING THE SCIENCE VISUAL.</h2>
          </div>
          <div className="caseStack">
            <p>The anatomy became one of the biggest parts of the site. I did not want it to just be a 3D body with some generic microplastic image beside it. I wanted the particles to actually exist inside and around the body so what you were looking at felt connected to the science.</p>
            <p>I also kept changing the particles because having every one of them show up as the same little colored dot looked fake. I wanted fibers, flakes, shards, different sizes and colors, and enough variation that it actually felt like the material we were talking about.</p>
            <p>At the same time, I had to be careful not to make the science seem more certain than it was. A 3D body can look very authoritative, so I wanted the study, what it found, and its limitations to stay connected to the visual instead of making claims the research did not actually make.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div>
            <span className="caseLabel">CLIENT WORK</span>
            <h2>WORKING WITH DR. HADDAD.</h2>
          </div>
          <div className="caseStack">
            <p>This was also one of the first projects where I was building for somebody else instead of just myself. Dr. Haddad would review things, send changes, and add ideas, and I had to keep adjusting the site around what he actually wanted.</p>
            <p>That is how it ended up becoming much bigger than the original book website without just turning into a bunch of random pages.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
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
