"use client";

import Image from "next/image";
import Link from "next/link";
import HandwrittenName from "./components/HandwrittenName";
import ScrollTrace from "./components/ScrollTrace";

const workbench = [
  { title: "LOT", what: "Real-estate acquisition workspace for finding, underwriting and tracking opportunities.", origin: "My uncle said he could help me learn real estate, so I built the workspace I wanted beside me.", meta: "parcel data · underwriting · owner research", href: "/work/lot", action: "story" },
  { title: "WeBuddy", what: "Salon website system that turns public business data and a short owner onboarding into a structured, editable site.", origin: "Cold calling salons was rough. I thought if I could send them something useful first, like a site already built from their business data, I would have a better way in.", meta: "Google listing import · 96-field model · templates", href: "/work/webuddy", action: "story" },
  { title: "NPGKTrades", what: "Polymarket copy-trading system with bankroll-relative sizing and deterministic risk gates.", origin: "I knew the trader. I wanted to mirror the allocation instead of blindly copying the dollar amount.", meta: "detect · aggregate · size · risk · execute", href: "/work/npgktrades", action: "story" },
  { title: "Say No To Plastic", what: "Interactive microplastics education site built around evidence, anatomy and practical guides.", origin: "The job was turning dense papers and scattered headlines into something a normal person could actually explore.", meta: "research communication · 3D anatomy · guides", href: "/work/say-no-to-plastic", action: "story" },
  { title: "Grounds Guide", what: "Campus routing system where GIS, entrances and pedestrian truth matter more than a plausible-looking line.", origin: "I didn't know my way around Grounds. I wanted something that knew the smaller paths I took, used my schedule, and told me when to leave.", meta: "GIS · entrances · routing truth", href: "/work/grounds-guide", action: "story" },
  { title: "MoveMate", what: "Move-in and move-out help for UVA students, with a student marketplace underneath it.", origin: "We started with a marketplace, mapped roughly 20 assumptions, and realized moving itself was the sharper problem to solve first.", meta: "UVA · moving help · marketplace backbone", href: "/work/movemate", action: "story" },
];

export default function PortfolioStory() {
  return (
    <main className="portfolioMain" id="main-content" tabIndex={-1}>
      <h1 className="srOnly">Nate Pegg: things I build and draw</h1>
      <ScrollTrace />
      <div className="paperNoise" aria-hidden="true" />

      <section className="hero" id="top">
        <div className="heroChrome"><span>NATE PEGG / 2026</span><span>SCROLL</span></div>
        <div className="heroSticky"><HandwrittenName /></div>
        <div className="heroIntro"><p>I&apos;m a first-year at UVA. I like building things, drawing, and messing around with AI.</p><span>RIGHT NOW: DELLA · VIALGRADE · MOVEMATE · GROUNDS GUIDE</span></div>
        <nav className="heroNav" aria-label="Primary">
          <a href="#work">work</a><a href="#draw">drawings</a><a href="#row">rowing</a><a href="#about">about</a><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">github ↗</a>
        </nav>
      </section>

      <section className="chapterIntro" id="work">
        <span className="microLabel">HOW I GOT INTO THIS</span>
        <h2>I&apos;ve always liked<br/>creating things.</h2>
        <p>Growing up, I always wanted to be an entrepreneur. I tried a clothing brand, a marketplace for fitness clubs and organizations, and a bunch of other stuff I thought would be cool. Once I got really into AI, building side projects became how I really learned. Some start because I see a problem. Others because I want to understand something better or challenge myself and see if I can build it.</p>
      </section>

      <section className="dellaStorySection projectSpotlight">
        <div className="sectionRail"><span>01</span><span>DELLA</span><span>MAR 11 → NOW</span></div>
        <div className="projectDefinition">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="della">Della is an AI employee for nail salons.</strong> It answers calls, remembers customers across conversations, checks live availability, creates real appointments in Square, and is being hardened around communications first.</p>
          <div className="projectActions"><Link href="/work/della">READ THE STORY →</Link><a href="https://hellodella.com" target="_blank" rel="noreferrer">OPEN DELLA ↗</a></div>
        </div>
        <div className="spotlightGrid">
          <div className="spotlightImage"><Image src="/della/room-identity.png" alt="Della workspace showing the AI employee's permissions, activity and state" fill sizes="(max-width: 980px) 90vw, 50vw" /></div>
          <div className="spotlightText"><span className="microLabel">WHY I STARTED</span><h2>I thought vertical AI was going to be a lot more than just putting a chatbot on a business.</h2><p>A nail salon has live appointments, missed calls, repeat customers, texts, DMs, cancellations, and a lot of little things a generic model does not know. I wanted to see if I could connect into all of that and actually do the work, starting with communications.</p><div className="spotlightChips"><span>voice</span><span>persistent context</span><span>Square bookings</span><span>knowledge + tools</span></div></div>
        </div>
      </section>

      <section className="vialStorySection projectSpotlight">
        <div className="sectionRail dark"><span>02</span><span>VIALGRADE</span><span>LIVE</span></div>
        <div className="projectDefinition">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="vial">VialGrade is an evidence-backed research platform for the peptide market.</strong> It brings compounds, vendors, lab results, source history, conflicts and uncertainty into one place so a claim can be inspected instead of just trusted.</p>
          <div className="projectActions"><Link href="/work/vialgrade">READ THE STORY →</Link><a href="https://vialgrade.com" target="_blank" rel="noreferrer">OPEN VIALGRADE ↗</a><a href="https://github.com/pegg-dot/vial" target="_blank" rel="noreferrer">CODE ↗</a></div>
        </div>
        <div className="spotlightGrid reverse">
          <div className="spotlightImage vialPreview"><Image src="/vialgrade/home.jpg" alt="VialGrade homepage and search interface" fill sizes="(max-width: 980px) 90vw, 50vw" /></div>
          <div className="spotlightText"><span className="microLabel">WHY I STARTED</span><h2>I knew a lot of people who wanted to try peptides, but they were buying from sketchy labs or just from friends.</h2><p>I thought it would be useful to have one place that grades the vendors and storefronts and lets you see why they got that grade. I am not making money from it. I just wanted a better way to compare them.</p><div className="spotlightChips"><span>vendors</span><span>compounds</span><span>lab evidence</span><span>source history</span></div></div>
        </div>
      </section>

      <section className="transformerStorySection projectSpotlight">
        <div className="sectionRail light"><span>03</span><span>TRANSFORMER</span><span>FROM SCRATCH</span></div>
        <div className="projectDefinition projectDefinitionDark">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="transformer">A GPT-style transformer built and trained from scratch in PyTorch.</strong> I instrumented its forward pass, captured the real intermediate tensors, and built a browser visualizer around what the model was actually doing.</p>
          <div className="projectActions"><Link href="/work/transformer">READ THE STORY →</Link><a href="https://transformer-viz-eight.vercel.app" target="_blank" rel="noreferrer">OPEN VISUALIZER ↗</a><a href="https://github.com/pegg-dot/Transformer" target="_blank" rel="noreferrer">CODE ↗</a></div>
        </div>
        <div className="spotlightGrid">
          <div className="spotlightImage transformerPreview"><Image src="/transformer/qkv.webp" alt="Transformer visualizer showing query, key and value projections" fill sizes="(max-width: 980px) 90vw, 50vw" /></div>
          <div className="spotlightText spotlightTextLight"><span className="microLabel">WHY I STARTED</span><h2>I wanted to understand what was actually happening inside a transformer.</h2><p>I had been studying the concepts, but building one from scratch made them click a lot more. Then I built the visualizer because I thought it would be another challenge and a better way to see what the model was doing.</p><div className="spotlightChips"><span>10.79M params</span><span>6 blocks</span><span>6 heads</span><span>real activations</span></div></div>
        </div>
      </section>

      <section className="workbenchStorySection">
        <div className="sectionRail"><span>04</span><span>OTHER THINGS</span><span>THE REST OF THE DESK</span></div>
        <div className="workbenchStoryIntro"><span className="microLabel">MORE BUILDS</span><h2>A few other things I&apos;ve built or am still working on.</h2></div>
        <div className="originList">
          {workbench.map((project, i) => {
            const body = <><span className="originNum">0{i + 4}</span><div><h3>{project.title}</h3><p className="originWhat">{project.what}</p><p className="originWhy"><span>why:</span> {project.origin}</p><small>{project.meta}</small></div><span className="originArrow">{project.action === "story" ? "story →" : project.action === "code" ? "code ↗" : project.action === "live" ? "live ↗" : "soon"}</span></>;
            if (!project.href) return <div key={project.title} className="originRow pending">{body}</div>;
            if (project.href.startsWith("/")) return <Link key={project.title} className="originRow" href={project.href}>{body}</Link>;
            return <a key={project.title} className="originRow" href={project.href} target="_blank" rel="noreferrer">{body}</a>;
          })}
        </div>
      </section>

      <section className="artSection" id="draw">
        <div className="sectionRail"><span>10</span><span>MADE BY HAND</span><span>GRAPHITE / COLOR</span></div>
        <div className="artLead"><h2>Drawings</h2><div className="artIntro"><p>I started drawing in preschool. I still remember drawing some fish, and my teacher being so impressed that she took me around the school to show the principal and other teachers. Since then, I’ve kept drawing whatever interests me and trying to get better.</p><p>These are a few of my drawings from over the years. I also draw people’s dogs, which people started asking me to do around COVID. A lot of those requests now come through my Instagram, <a href="https://www.instagram.com/nate_draws07/" target="_blank" rel="noreferrer">@nate_draws07</a>.</p></div></div>
        <div className="artWall">
          <figure className="artPiece p1" data-pencil-target="marley"><Image src="/art/bob-marley.jpg" alt="Graphite portrait of Bob Marley" fill sizes="(max-width: 680px) 90vw, 40vw" /><figcaption>graphite portrait</figcaption></figure>
          <figure className="artPiece p2"><Image src="/art/coke-can.jpg" alt="Drawing of a crushed Coca-Cola can" fill sizes="(max-width: 680px) 90vw, 30vw" /><figcaption>colored pencil</figcaption></figure>
          <figure className="artPiece p3" data-pencil-target="dog"><Image src="/art/dog-scarf.jpg" alt="Graphite dog portrait" fill sizes="(max-width: 680px) 90vw, 35vw" /><figcaption>commission portrait</figcaption></figure>
          <figure className="artPiece p4"><Image src="/art/house.jpg" alt="Architectural graphite drawing of a house" fill sizes="(max-width: 680px) 90vw, 48vw" /><figcaption>architecture study</figcaption></figure>
          <figure className="artPiece p5"><Image src="/art/moose.jpg" alt="Graphite moose drawing" fill sizes="(max-width: 680px) 90vw, 32vw" /><figcaption>graphite</figcaption></figure>
          <figure className="artPiece p6" data-pencil-target="miami"><Image src="/art/miami.jpg" alt="Color drawing collage of Miami" fill sizes="(max-width: 680px) 90vw, 35vw" /><figcaption>Miami</figcaption></figure>
        </div>
      </section>

      <section className="rowingSection rowingCompact" id="row">
        <div className="sectionRail"><span>11</span><span>ROWING</span><span>GENOA · 2024</span></div>
        <div className="rowingCompactGrid">
          <div className="rowingCompactPhotos">
            <div className="rowingCompactPhoto"><Image src="/rowing/race-close.jpg" alt="Nate Pegg racing for Team USA in the U19 men's coastal double sculls" fill sizes="(max-width: 800px) 90vw, 46vw" /></div>
            <div className="rowingCompactPhoto wide"><Image src="/rowing/race-wide.jpg" alt="Team USA U19 double racing off the beach in Genoa" fill sizes="(max-width: 800px) 90vw, 46vw" /></div>
          </div>
          <div className="rowingCompactCopy">
            <h2>Rowing</h2>
            <p>I joined rowing my sophomore year, and my coach thought another rower and I had what it took to try coastal rowing. After Scholastic Nationals, we started going out on Biscayne Bay at 7 a.m. to train. We went to Lido Key for trials and finished first in the time trial, which qualified us to race in Genoa.</p>
            <p>We took July off, then got back on the water in August and September, including mornings before school. I represented Team USA in the U19 men&apos;s coastal double sculls in Genoa. It was a really good time, and I got to meet other rowers who were aiming for the 2028 Olympics. <a href="https://la28.org/en/games-plan/olympics/coastal-rowing.html" target="_blank" rel="noreferrer">Beach sprint rowing will be part of the Olympics for the first time in 2028.</a></p>
          </div>
        </div>
      </section>

      <section className="aboutSection aboutPlain" id="about">
        <h2>About me</h2>
        <div className="aboutPlainCopy">
          <p>I grew up in Miami and went to Ransom Everglades before starting at UVA this year. I&apos;ve always wanted to be an entrepreneur, and over the years I&apos;ve tried a lot of different ideas. More recently, I&apos;ve been spending a lot of time building with AI and trying to understand how it works by making things myself.</p>
          <p>Outside of that, I like drawing, going to the gym, playing sports, and spending time with friends.</p>
        </div>
      </section>

      <footer className="siteFooter">
        <div><span>NATE PEGG</span><span>2026</span></div>
        <div><a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:nate@natepegg.com">Email ↗</a><a href="#top">Top ↑</a></div>
      </footer>
    </main>
  );
}
