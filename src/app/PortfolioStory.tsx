"use client";

import Image from "next/image";
import Link from "next/link";
import HandwrittenName from "./components/HandwrittenName";
import ScrollTrace from "./components/ScrollTrace";
import RowingSketch from "./components/RowingSketch";
import PortfolioFooter from "./components/PortfolioFooter";

const workbench = [
  { title: "LOT", what: "Real-estate workspace for finding, underwriting, and tracking houses around Charlottesville.", origin: "My uncle said he could help me learn real estate, so I built a tool to help me.", meta: "parcel data · underwriting · owner research", href: "/work/lot", action: "story" },
  { title: "WeBuddy", what: "Salon website builder that starts with public business data, asks the owner for what the internet can’t know, and turns it into a site they can edit.", origin: "Getting my foot in the door with nail salons was rough. I thought if I could send something useful, like a site I’d already built from the business’s data, I’d have a better way in.", meta: "Google listing import · 96-field model · templates", href: "/work/webuddy", action: "story" },
  { title: "NPGKTrades", what: "Polymarket copy-trading system that tails one trader, sizes each copy to my bankroll, and blocks trades when things like slippage or exposure get too high.", origin: "I knew the trader and thought it would be an interesting challenge to mirror his allocation instead of blindly copying the dollar amounts.", meta: "detect · aggregate · size · risk · execute", href: "/work/npgktrades", action: "story" },
  { title: "Say No To Plastic", what: "Website about microplastics built around Dr. Haddad’s book, with the science, 3D anatomy, newsletters, and practical guides.", origin: "Dr. Haddad asked me to make a website for his new book, Homo Plasticus, with plans to eventually expand into newsletters, affiliates, and merchandise.", meta: "research communication · 3D anatomy · guides", href: "/work/say-no-to-plastic", action: "story" },
  { title: "Grounds Guide", what: "Campus mapping and routing tool where entrances and pedestrian access matter more than drawing a clean-looking line between two buildings.", origin: "Starting at the University of Virginia, I didn’t know my way around Grounds. I noticed Google Maps missed shortcuts and smaller paths, so I wanted a guide specifically for UVA students that could also import your schedule and tell you when to leave.", meta: "GIS · entrances · pedestrian routing", href: "/work/grounds-guide", action: "story" },
  { title: "MoveMate", what: "Move-in and move-out help for UVA students, with a student marketplace underneath it.", origin: "In my entrepreneurship class, we have to start something. My friends and I started a marketplace for buying and selling furniture, mapped out our top 20 assumptions, and realized moving itself was the better problem to solve first.", meta: "UVA · moving help · marketplace backbone", href: "/work/movemate", action: "story" },
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
        <p>Growing up, I always wanted to be an entrepreneur. I tried a clothing brand, a marketplace for fitness clubs and organizations, and a bunch of other stuff I thought would be cool. Once I got really into AI, building side projects became a way to learn and be prepared for the future. Some started as problems I saw, but others were just because I wanted to understand something better, challenge myself, and see if I could build it.</p>
      </section>

      <section className="dellaStorySection projectSpotlight">
        <div className="sectionRail"><span>01</span><span>DELLA</span><span>MAR 11 → NOW</span></div>
        <div className="projectDefinition">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="della">Della is an AI employee for nail salons.</strong> It answers calls, remembers customers across conversations, checks live schedule availability, creates and cancels real appointments in Square, and communications is the first wedge I’m going after.</p>
          <div className="projectActions"><Link href="/work/della">READ THE STORY →</Link><a href="https://hellodella.com" target="_blank" rel="noreferrer">OPEN DELLA ↗</a></div>
        </div>
        <div className="spotlightGrid">
          <div className="spotlightImage"><Image src="/della/room-identity.png" alt="Della workspace showing the AI employee's permissions, activity and state" fill sizes="(max-width: 980px) 90vw, 50vw" /></div>
          <div className="spotlightText"><span className="microLabel">WHY I STARTED</span><h2>I thought these models were going to get really good at work on a computer, but they still needed to know how the actual business worked.</h2><p>A nail salon has live appointments, missed calls, repeat customers, texts, DMs, cancellations, and a lot of information a generic model doesn’t start with. I wanted to connect Della into those systems and see if it could actually do the work, starting with communications.</p><div className="spotlightChips"><span>voice</span><span>persistent context</span><span>Square bookings</span><span>knowledge + tools</span></div></div>
        </div>
      </section>

      <section className="vialStorySection projectSpotlight">
        <div className="sectionRail dark"><span>02</span><span>VIALGRADE</span><span>LIVE</span></div>
        <div className="projectDefinition">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="vial">VialGrade is a research platform for the peptide market.</strong> It aggregates public data from batches, COAs, lab reports, test results, vendor records, and other sources into one place, then grades vendors and storefronts against a rubric so you can see what the grade is based on.</p>
          <div className="projectActions"><Link href="/work/vialgrade">READ THE STORY →</Link><a href="https://vialgrade.com" target="_blank" rel="noreferrer">OPEN VIALGRADE ↗</a><a href="https://github.com/pegg-dot/vial" target="_blank" rel="noreferrer">CODE ↗</a></div>
        </div>
        <div className="spotlightGrid reverse">
          <div className="spotlightImage vialPreview"><Image src="/vialgrade/home.jpg" alt="VialGrade homepage and search interface" fill sizes="(max-width: 980px) 90vw, 50vw" /></div>
          <div className="spotlightText"><span className="microLabel">WHY I STARTED</span><h2>A friend of mine was really into biomedicine and peptide research, and he told me a lot of people around him wanted to buy peptides but didn’t really trust the vendors.</h2><p>I thought it would be useful to have one place that compares the vendors, grades them against the same rubric, and lets you see the records behind the grade instead of just taking the storefront’s word for it.</p><div className="spotlightChips"><span>vendors</span><span>compounds</span><span>lab evidence</span><span>source history</span></div></div>
        </div>
      </section>

      <section className="transformerStorySection projectSpotlight">
        <div className="sectionRail light"><span>03</span><span>TRANSFORMER</span><span>FROM SCRATCH</span></div>
        <div className="projectDefinition projectDefinitionDark">
          <span className="microLabel">WHAT IT IS</span>
          <p><strong data-pencil-target="transformer">A GPT-style transformer I coded from scratch in PyTorch and trained on Tiny Shakespeare.</strong> I worked through tokenization, embeddings, attention, the forward pass, normalization, and decoding, then built an animation in the browser around what the model was actually doing so I could understand it more intuitively.</p>
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
        <div className="sectionRail"><span>10</span><span>DRAWINGS</span><span>GRAPHITE / COLOR</span></div>
        <div className="artLead"><h2>Drawings</h2><div className="artIntro"><p>I started drawing in preschool. I still remember drawing some fish, and my teacher being so impressed that she took me around the school to show the principal and other teachers. Since then, I’ve kept drawing whatever interests me and trying to get better.</p><p>These are a few of my drawings from over the years. Around COVID, people started commissioning dog portraits, including drawings to remember pets they’d lost. A lot of those requests now come through my Instagram, <a href="https://www.instagram.com/nate_draws07/" target="_blank" rel="noreferrer">@nate_draws07</a>.</p></div></div>
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
        <RowingSketch />
      </section>

      <section className="aboutSection aboutPlain" id="about">
        <h2>About me</h2>
        <div className="aboutPlainCopy">
          <p>I grew up in Miami and went to Ransom Everglades before starting at UVA this year. I&apos;ve always wanted to be an entrepreneur, and over the years I&apos;ve tried a lot of different ideas. More recently, I&apos;ve been spending a lot of time building with AI and trying to understand how it works by making things myself.</p>
          <p>Outside of that, I like drawing, going to the gym, playing sports, and spending time with friends.</p>
          <p>Fun fact: when I was four, I had two of the same blue and red striped shirt with a little green alien on it. I wore it nearly every day and refused to wear other shirts.</p>
        </div>
      </section>

      <PortfolioFooter />
    </main>
  );
}
