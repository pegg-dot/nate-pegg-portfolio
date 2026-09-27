import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function DellaCase() {
  return (
    <CaseShell
      index="01 / DELLA"
      title="DELLA"
      subtitle="Della is an AI employee for nail salons. The first thing I am hardening is communications: answer the call, remember the customer, look up what is actually available, and make the booking in the salon's real system."
      external={{ label: "LIVE SITE", href: "https://hellodella.com" }}
      actions={[{ label: "OPEN DELLA", href: "https://hellodella.com", external: true }]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "An agent system for nail salons. Right now the narrow product is communications: calls, customer context, live availability, real Square bookings, and the beginning of email and other channels." },
        { label: "WHY", text: "I grew up in Miami where nail salons are everywhere. A missed call can just mean a missed customer, and a small business owner should not have to sit at the desk all day for the business to keep moving." },
        { label: "HOW", text: "I built my own agent harness around tools, memory, retrieval, checks, and the salon's existing software. Static knowledge can come from documents. Live state, like whether Thursday at 4:30 is open, has to come from a tool." },
        { label: "WHEN", text: "I started on March 11, 2026 as OpenOperator. It began with medspas, moved to nail salons, and then narrowed again when I realized I was trying to build the entire business at once." },
      ]} />

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHY NAIL SALONS</span><h2>I WANTED A REAL SMALL-BUSINESS PROBLEM.</h2></div>
          <div className="caseStack">
            <p>At first I was thinking about medspas. Pretty quickly I realized I was choosing a compliance problem before I really understood the agent problem.</p>
            <p>Nail salons made more sense. There are a ton of them in Miami, many are owner-operated, and the basic communication problem is easy to understand: the phone rings whether somebody is free to answer it or not.</p>
            <p>The bigger idea is still an AI employee across the business. I just stopped pretending I had to build all of that on day one.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT I BUILT</span><h2>NOT A CHATBOT WITH A BOOKING LINK.</h2></div>
          <div className="caseStack">
            <p>The call layer can identify the customer, carry context from previous conversations, look up salon knowledge, check actual availability, and create an appointment in Square.</p>
            <p>I separated knowledge from live state. “What is your cancellation policy?” can come from retrieved business knowledge. “Can I come in Wednesday at 5?” has to call the scheduling system.</p>
            <p>I also built the checks around actions because the model saying “done” is not the same thing as the appointment actually existing.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE MOMENT IT FELT REAL</span><h2>THE NEXT CALL STARTED WHERE THE LAST ONE ENDED.</h2></div>
          <div className="caseMemoryStack">
            <div><span>CALL 1</span><p>I chipped my nail.</p></div>
            <i>a couple days later</i>
            <div className="agentMemory"><span>DELLA</span><p>How&apos;s your chipped nail?</p></div>
            <small>I had family and friends test real calls. This was the first time the persistence felt less like a database feature and more like the product actually knew who was calling.</small>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">WHAT GOT HARD</span>
        <div className="lessonGrid">
          <article><span>01</span><h3>RAG is not live state.</h3><p>I had to learn when the model should retrieve knowledge and when it should use a tool. Mixing those up makes the agent sound confident and be wrong.</p></article>
          <article><span>02</span><h3>More tools are not automatically better.</h3><p>The more the model has to inspect, the more latency and routing mistakes show up. I ended up caring a lot more about tool design than I expected.</p></article>
          <article><span>03</span><h3>A write has to be verified.</h3><p>If the model books, sends, or changes something, there has to be a way to know the external system really changed before Della tells the customer it did.</p></article>
          <article><span>04</span><h3>The owner needs control.</h3><p>The product has to make it obvious what Della can do automatically, what needs approval, and what happened after an action.</p></article>
        </div>
      </section>

      <section className="caseBand dellaVisualBand">
        <span className="caseLabel">THE CURRENT WORKSPACE</span>
        <div className="caseImageWide dellaRoomImage"><Image src="/della/room-identity.png" alt="Della workspace showing permissions, state and activity" fill sizes="100vw" /></div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT IS NOW</span><h2>COMMUNICATIONS FIRST.</h2></div>
          <div className="caseStack">
            <p>Real calls have gone through the system and real Square appointments have been created from them.</p>
            <p>Customer context persists across conversations instead of resetting every time somebody calls.</p>
            <p>The repo has grown into a much larger agent system with action receipts, guardrails, permissions, evaluation infrastructure, and channel work around voice and email. I am deliberately narrowing the product experience faster than the codebase.</p>
            <p>It is not finished. The current goal is to make one communication loop reliable enough that I would trust it with an actual salon before expanding the surface again.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
