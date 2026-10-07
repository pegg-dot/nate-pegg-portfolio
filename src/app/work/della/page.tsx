import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function DellaCase() {
  return (
    <CaseShell
      className="dellaCase"
      index="01 / DELLA"
      title="DELLA"
      subtitle="Della is an AI employee for nail salons. I started it because I think frontier models will get extremely good at work on a computer, but they still need the live state, workflows, and data of the actual business."
      external={{ label: "LIVE SITE", href: "https://hellodella.com" }}
      actions={[{ label: "OPEN DELLA", href: "https://hellodella.com", external: true }]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "An AI employee for nail salons, starting with calls, messaging, customer memory, scheduling, and real bookings." },
        { label: "WHY", text: "Frontier models still do not know the live operational state of a specific salon." },
        { label: "HOW", text: "A harness around tools, memory, evaluations, permissions, and the salon's existing software." },
        { label: "WHEN", text: "Started March 11, 2026 as OpenOperator. Medspas first, then nail salons, then communications first." },
      ]} />

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHY THIS</span><h2>FRONTIER MODELS DON&apos;T KNOW THE SALON.</h2></div>
          <div className="caseStack">
            <p>I got really interested in agentic AI during the OpenClaw moment. I think frontier models will eventually be better than humans at a lot of work that happens on a computer.</p>
            <p>What they still do not have on their own is the salon itself: its customers, appointments, messages, software, history, and live state. That is where the harness around the model matters.</p>
            <p>Medspas were first, but the compliance risk was too high. Nail salons were a cleaner start, and communications became the wedge because a missed call is basically found revenue if Della can answer and book it.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT I BUILT</span><h2>IT CAN ACTUALLY DO THE WORK.</h2></div>
          <div className="caseStack">
            <p>A salon can have Della answer all the time, only after hours, or only when nobody picks up. It can answer service and policy questions, book or cancel, hand off the call, and remember the customer from last time.</p>
            <p>If someone asks whether 4:30 is open, Della checks the real schedule. If it says it booked something, the appointment has to actually exist in Square.</p>
            <p>The same system is expanding into texts, Instagram DMs, WhatsApp, Facebook, reviews, and follow-up.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">A CALL I REMEMBER</span><h2>IT REMEMBERED MY CHIPPED NAIL.</h2></div>
          <div className="caseMemoryStack">
            <div><span>CALL 1</span><p>I told Della I had chipped my nail.</p></div>
            <i>a couple days later</i>
            <div className="agentMemory"><span>DELLA</span><p>It asked how my chipped nail was doing and whether I had gone to the doctor for it.</p></div>
            <small>That was cool because it was not starting over from zero. It remembered something from the last conversation and brought it back up on the next call.</small>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <span className="caseLabel">WHAT GOT HARD</span>
        <div className="lessonGrid">
          <article><span>01</span><h3>Latency adds up fast.</h3><p>Database lookups, memory, tools, and everything else around the model can make a voice call feel slower. I can optimize my side, but I am still building on top of model latency I do not control.</p></article>
          <article><span>02</span><h3>The model saying it happened is not enough.</h3><p>Early on, Della would sometimes say it booked something when it had not, or take an action it should not have taken. I had to add verification, guardrails, and checks around what actually happened.</p></article>
          <article><span>03</span><h3>The model needs the right kind of context.</h3><p>Policies and service information can come from salon knowledge, but appointments and other live state have to come from the real systems. Getting that split right matters a lot.</p></article>
          <article><span>04</span><h3>Memory has a cost too.</h3><p>I wanted Della to remember customers across conversations, but storing and retrieving that context without making the call noticeably slower became its own database problem.</p></article>
        </div>
      </section>

      <section className="caseBand dellaVisualBand">
        <span className="caseLabel">THE CURRENT WORKSPACE</span>
        <div className="caseImageWide dellaRoomImage"><Image src="/della/room-identity.png" alt="Della workspace showing permissions, state and activity" fill sizes="100vw" /></div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT IS NOW</span><h2>I&apos;M GETTING IT INTO REAL SALONS.</h2></div>
          <div className="caseStack">
            <p>Real calls have gone through the system, real Square appointments have been created, and customer context carries across conversations.</p>
            <p>I am working on getting clients now. At the same time I am tightening reliability, latency, memory, and guardrails around actual salon use.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
