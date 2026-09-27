import Image from "next/image";
import CaseShell from "../../components/CaseShell";

export default function DellaCase() {
  return (
    <CaseShell index="01 / DELLA" title="DELLA" subtitle="An AI employee for nail salons. It answers calls, remembers customers across conversations, checks live availability, creates real Square appointments, and is being hardened around communications first." external={{ label: "LIVE SITE", href: "https://hellodella.com" }} actions={[{ label: "OPEN DELLA", href: "https://hellodella.com", external: true }]}>
      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT STARTED</span><h2>FROM “AGENTS ARE COMING” TO ONE SALON PHONE.</h2></div>
          <div className="caseStack"><p>I first tried to understand OpenClaw-style agent systems and how tools, memory and actions fit together.</p><p>The first vertical was medspas. I changed course when I realized I was choosing a compliance problem before I even understood the agent problem.</p><p>Nail salons made more sense to me. I grew up in Miami around them, missed calls matter, and the owner cannot always be at the desk.</p></div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">THE SECOND PIVOT</span>
        <div className="caseGrid two compactTop">
          <div><h2>I WAS BUILDING WAY TOO MUCH AT ONCE.</h2></div>
          <div className="caseStack"><p>At first I wanted Della to reach across the entire business.</p><p>That made everything harder to tell apart: bad model behavior, bad tools, bad state, bad product design.</p><p>So I narrowed the product to communications and started hardening one path at a time.</p></div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE MOMENT I CARED ABOUT</span><h2>THE NEXT CALL STARTED WHERE THE LAST ONE ENDED.</h2></div>
          <div className="caseMemoryStack"><div><span>CALL 1</span><p>I chipped my nail.</p></div><i>a couple days later</i><div className="agentMemory"><span>DELLA</span><p>How&apos;s your chipped nail?</p></div><small>The sentence is simple. The part I cared about was persistent context across conversations.</small></div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">WHAT BUILDING IT TAUGHT ME</span>
        <div className="lessonGrid">
          <article><span>01</span><h3>RAG is not live state.</h3><p>A policy can come from documents. Wednesday at 5 PM availability has to come from the actual system.</p></article>
          <article><span>02</span><h3>A tool result is not enough.</h3><p>If Della books something, the important question becomes whether the write really happened and what state the business is in now.</p></article>
          <article><span>03</span><h3>More tools can make the agent worse.</h3><p>Every extra thing the model has to consider adds latency and more ways to choose the wrong path.</p></article>
          <article><span>04</span><h3>Permissions are product design.</h3><p>The owner should understand what Della can do, what still needs approval and why, without reading a matrix of internal settings.</p></article>
        </div>
      </section>

      <section className="caseBand dellaVisualBand">
        <span className="caseLabel">WHAT IT TURNED INTO</span>
        <div className="caseImageWide dellaRoomImage"><Image src="/della/room-identity.png" alt="Della workspace showing permissions, state and activity" fill sizes="100vw" /></div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT IS NOW</span><h2>COMMUNICATIONS FIRST.</h2></div>
          <div className="caseStack"><p>Voice calls can check live availability and create real appointments in Square.</p><p>Customer context can survive across conversations instead of resetting to a fresh prompt.</p><p>Email, telephony and channel integrations are being pulled into the same model: retrieve what is knowledge, call a tool for what is live, verify what changed.</p><p>It is still being polished. That is the point of the current phase.</p></div>
        </div>
      </section>
    </CaseShell>
  );
}
