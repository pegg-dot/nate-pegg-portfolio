/**
 * Every word on the home page, verbatim from PortfolioStory.tsx at commit 0b8dbd0.
 * The autobiography cannot be edited by AI (VOICE_PASS.md). tests/sketchbook-copy.spec.ts
 * checks this file and the rendered page against tests/fixtures/home-original-copy.json.
 */
export type Action = { label: string; href: string; external?: boolean };
export type ProjectCopy = {
  rail: [string, string, string];
  whatLabel: string;
  /** Whole paragraph; the first sentence is rendered bold. */
  what: string;
  actions: Action[];
  buildLabel: string;
  buildHeading: string;
  buildBody: string;
  chips: string[];
};
export type DeskRow = { num: string; title: string; what: string; meta: string; href: string; liveHref?: string };
export type Piece = { src: string; alt: string; caption: string; note?: string };

export const HOME_COPY = {
  h1: "Nate Pegg: things I build and draw",
  chrome: ["NATE PEGG / 2026", "SCROLL"],
  intro: "I'm a first-year at UVA. I like building things, drawing, and messing around with AI.",
  rightNow: "RIGHT NOW: DELLA · VIALGRADE · MOVEMATE · GROUNDS GUIDE",
  rightNowLinks: [
    { label: "DELLA", href: "#della" },
    { label: "VIALGRADE", href: "#vialgrade" },
    { label: "MOVEMATE", href: "/work/movemate" },
    { label: "GROUNDS GUIDE", href: "/work/grounds-guide" },
  ],
  nav: [
    { label: "work", href: "#work" },
    { label: "drawings", href: "#draw" },
    { label: "rowing", href: "#row" },
    { label: "about", href: "#about" },
    { label: "github ↗", href: "https://github.com/pegg-dot", external: true },
  ],
  origin: {
    label: "HOW I GOT INTO THIS",
    heading: ["I've always liked", "creating things."],
    body: "I've always liked making things. More recently, most of my side projects have come from a problem I wanted to solve or something in AI I wanted to understand by actually building it.",
  },
  projects: {
    della: {
      rail: ["01", "DELLA", "APR 2026 → NOW"],
      whatLabel: "WHAT IT IS",
      what: "Della is an AI-native operating system I'm building for nail salons. It starts with calls and bookings, but the larger goal is to connect enough of the business that agents can recognize what needs doing and eventually handle more of the operation.",
      actions: [
        { label: "READ THE STORY →", href: "/work/della" },
        { label: "OPEN DELLA ↗", href: "https://hellodella.com", external: true },
      ],
      buildLabel: "THE BUILD",
      buildHeading: "From answering the phone to running the salon.",
      buildBody: "I'm starting with communication and booking, then connecting the systems and context Della needs to do more of the work the owner handles manually.",
      chips: ["calls", "live schedule", "customer context", "Square bookings"],
    },
    vialgrade: {
      rail: ["02", "VIALGRADE", "LIVE"],
      whatLabel: "WHAT IT IS",
      what: "VialGrade is becoming a research intelligence platform for peptide and biotech research. It brings together lab reports, clinical trials, regulatory records, papers, and company data, then uses AI to help compare the evidence and trace it back to the original sources.",
      actions: [
        { label: "READ THE STORY →", href: "/work/vialgrade" },
        { label: "OPEN VIALGRADE ↗", href: "https://vialgrade.com", external: true },
        { label: "CODE ↗", href: "https://github.com/pegg-dot/vial", external: true },
      ],
      buildLabel: "THE BUILD",
      buildHeading: "Research intelligence for peptide and biotech research.",
      buildBody: "Pull the evidence together, compare sources, and keep everything traceable back to where it came from.",
      chips: ["clinical trials", "papers", "regulatory records", "lab evidence"],
    },
    transformer: {
      rail: ["03", "TRANSFORMER", "FROM SCRATCH"],
      whatLabel: "WHAT IT IS",
      what: "A GPT-style transformer I built and trained from scratch. Then I made a browser visualizer around the model's real activations.",
      actions: [
        { label: "READ THE STORY →", href: "/work/transformer" },
        { label: "OPEN VISUALIZER ↗", href: "https://transformer-viz-eight.vercel.app", external: true },
        { label: "CODE ↗", href: "https://github.com/pegg-dot/Transformer", external: true },
      ],
      buildLabel: "THE BUILD",
      buildHeading: "Transformer from scratch + visualizer.",
      buildBody: "Train the model, capture what happens inside it, and make the computation easier to see.",
      chips: ["10.79M params", "6 blocks", "6 heads", "real activations"],
    },
  } satisfies Record<string, ProjectCopy>,
  desk: {
    rail: ["04", "OTHER THINGS", "THE REST OF THE DESK"] as [string, string, string],
    label: "MORE BUILDS",
    heading: "A few other things I've built or am still working on.",
    rows: [
      { num: "04", title: "LOT", what: "Real-estate workspace for finding, underwriting, and tracking houses around Charlottesville.", meta: "parcel data · underwriting · owner research", href: "/work/lot" },
      { num: "05", title: "WeBuddy", what: "Salon website builder that turns a Google listing and a few owner answers into an editable site.", meta: "Google listing import · templates · owner editing", href: "/work/webuddy" },
      { num: "06", title: "NPGKTrades", what: "Polymarket copy-trading system that sizes each copy to my bankroll and blocks trades when risk limits are hit.", meta: "detect · aggregate · size · risk · execute", href: "/work/npgktrades" },
      { num: "07", title: "Say No To Plastic", what: "Microplastics education site with 3D anatomy, newsletters, the book, and practical guides.", meta: "research communication · 3D anatomy · guides", href: "/work/say-no-to-plastic" },
      { num: "08", title: "Grounds Guide", what: "UVA routing tool built around real paths, entrances, class schedules, and leave-by times.", meta: "GIS · entrances · pedestrian routing", href: "/work/grounds-guide" },
      { num: "09", title: "MoveMate", what: "Move-in and move-out help for UVA students. We are now partnering with a new local apartment complex in Charlottesville as we test the service around real moves.", meta: "UVA · moving help · local apartment partnership", href: "/work/movemate", liveHref: "https://movemate-dcy8.onrender.com" },
    ] satisfies DeskRow[],
    rowActions: { story: "READ THE STORY →", live: "OPEN MOVEMATE ↗", arrowStory: "story →", arrowLive: "live ↗" },
  },
  drawings: {
    rail: ["10", "DRAWINGS", "GRAPHITE / COLOR"] as [string, string, string],
    heading: "Drawings",
    p1: "I started drawing in preschool. I still remember drawing some fish, and my teacher being so impressed that she took me around the school to show the principal and other teachers. Since then, I’ve kept drawing whatever interests me and trying to get better.",
    /** Whole paragraph; igHandle is rendered as the Instagram link. */
    p2: "These are a few of my drawings from over the years. Around COVID, people started commissioning dog portraits, including drawings to remember pets they’d lost. A lot of those requests now come through my Instagram, @nate_draws07.",
    igHandle: "@nate_draws07",
    igHref: "https://www.instagram.com/nate_draws07/",
    pieces: [
      { src: "/art/bob-marley.jpg", alt: "Graphite portrait of Bob Marley", caption: "graphite portrait", note: "Bob Marley" },
      { src: "/art/dog-scarf.jpg", alt: "Graphite dog portrait", caption: "commission portrait", note: "Mowgli" },
      { src: "/art/house.jpg", alt: "Architectural graphite drawing of a house", caption: "architecture study" },
      { src: "/art/moose.jpg", alt: "Graphite moose drawing", caption: "graphite" },
      { src: "/art/coke-can.jpg", alt: "Drawing of a crushed Coca-Cola can", caption: "colored pencil" },
      { src: "/art/miami.jpg", alt: "Color drawing collage of Miami", caption: "Miami", note: "a little Miami" },
    ] satisfies Piece[],
  },
  rowing: {
    rail: ["11", "ROWING", "GENOA · 2024"] as [string, string, string],
    heading: "Rowing",
    p1: "I joined rowing my sophomore year, and my coach thought another rower and I had what it took to try coastal rowing. After Scholastic Nationals, we started going out on Biscayne Bay at 7 a.m. to train. We went to Lido Key for trials and finished first in the time trial, which qualified us to race in Genoa.",
    /** Whole paragraph; la28Text is rendered as the LA28 link. */
    p2: "We took July off, then got back on the water in August and September, including mornings before school. I represented Team USA in the U19 men's coastal double sculls in Genoa. It was a really good time, and I got to meet other rowers who were aiming for the 2028 Olympics. Beach sprint rowing will be part of the Olympics for the first time in 2028.",
    la28Text: "Beach sprint rowing will be part of the Olympics for the first time in 2028.",
    la28Href: "https://la28.org/en/games-plan/olympics/coastal-rowing.html",
    photos: [
      { src: "/rowing/race-close.jpg", alt: "Nate Pegg racing for Team USA in the U19 men's coastal double sculls" },
      { src: "/rowing/race-wide.jpg", alt: "Team USA U19 double racing off the beach in Genoa" },
    ],
  },
  about: {
    heading: "About me",
    p1: "I grew up in Miami and went to Ransom Everglades before starting at UVA this year. I've always wanted to be an entrepreneur, and over the years I've tried a lot of different ideas. More recently, I've been spending a lot of time building with AI and trying to understand how it works by making things myself.",
    p2: "Outside of that, I like drawing, going to the gym, playing sports, and spending time with friends.",
    p3: "Fun fact: when I was four, I had two of the same blue and red striped shirt with a little green alien on it. I wore it nearly every day and refused to wear other shirts.",
  },
  footer: ["one more thing...", "After Abundance", "Read the paper"],
};
export type HomeCopy = typeof HOME_COPY;
