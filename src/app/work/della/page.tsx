import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function DellaCase() {
  return (
    <CaseShell
      index="01 / DELLA"
      title="DELLA"
      subtitle="Della is an AI employee for nail salons. I started it after the OpenClaw moment, when I became convinced agentic AI and frontier models were going to get better than humans at a lot of work that happens on a computer. The question for me was what they still would not commoditize on their own."
      external={{ label: "LIVE SITE", href: "https://hellodella.com" }}
      actions={[{ label: "OPEN DELLA", href: "https://hellodella.com", external: true }]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "An agent system for nail salons. Right now the narrow product is communications: calls, customer context, live availability, real Square bookings, and the beginning of email and other channels." },
        { label: "WHY", text: "I thought the part frontier models would not commoditize on their own was vertical AI: the live operational state, workflows, and proprietary data inside a specific business." },
        { label: "HOW", text: "I built my own agent harness around tools, memory, retrieval, evaluations, permissions, and the salon's existing software. A frontier model can reason about a nail salon, but it does not know that salon's live state unless the system around it gives it access." },
        { label: "WHEN", text: "I started on March 11, 2026 as OpenOperator. It began with medspas, moved to nail salons, and then narrowed again when I realized I was trying to build the entire business at once." },
      ]} />

      <section className="caseBand caseBandInk">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHY VERTICAL AI</span><h2>FRONTIER MODELS STILL DO NOT KNOW THE BUSINESS.</h2></div>
          <div className="caseStack">
            <p>When the OpenClaw moment happened, I got really interested in agentic AI. I became convinced frontier models were going to get better than humans at a lot of work that happens on a computer, if not immediately then eventually.</p>
            <p>What I did not think they would commoditize on their own was the live operational state inside a business. Every salon has its own customers, appointments, messages, workflows, software, and history. The model can help, but it still needs a harness around all of that.</p>
            <p>The bigger idea behind Della is an AI employee that can eventually work across the business because it has access to that state, can recognize patterns across workflows, and can actually take actions instead of just chatting.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHY NAIL SALONS</span><h2>MEDSPAS WERE THE FIRST IDEA. NAIL SALONS WERE THE CLEANER START.</h2></div>
          <div className="caseStack">
            <p>I started with medspas because the appointments are high-ticket and a missed call can mean a lot of lost revenue. Pretty quickly I realized there was way more compliance and liability than I wanted to take on while I was still figuring out the agent problem itself.</p>
            <p>Nail salons had a similar foundation without as much of that risk. There are a lot of them, AI has not penetrated much of the day-to-day business yet, and the communication problem is obvious: if nobody answers the phone, that customer can just disappear.</p>
            <p>At first I was trying to build everything around them: CRM, payments, scheduling, and more. After talking it through with a friend, I realized I needed one wedge. I picked communications because it is directly tied to revenue and it touches a lot of the rest of the business anyway.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT I BUILT</span><h2>IT ANSWERS LIKE A RECEPTIONIST AND CAN ACTUALLY DO THE WORK.</h2></div>
          <div className="caseStack">
            <p>A salon can have Della answer all the time, only after hours, or when nobody at the salon can pick up. On a call it can answer questions about services and policies, book or cancel appointments, hand the call off to a person, and remember who the customer is and what they talked about last time.</p>
            <p>The important part is that it is connected to the real salon systems. If someone asks whether a time is open, Della has to check the actual schedule. If it books something, the appointment has to really exist in Square.</p>
            <p>The same communications idea extends beyond voice into texts, Instagram DMs, WhatsApp, Facebook, reviews, follow-up, and the other places a salon talks to customers.</p>
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
          <div><span className="caseLabel">WHERE IT IS NOW</span><h2>I&apos;M TRYING TO GET IT INTO REAL SALONS.</h2></div>
          <div className="caseStack">
            <p>Real calls have gone through the system, real Square appointments have been created, and customer context carries across conversations instead of resetting every time somebody calls.</p>
            <p>At this point I am not just sitting there adding features. I am working on getting clients and putting Della in front of actual salon owners.</p>
            <p>I am still improving the reliability, latency, memory, guardrails, and all the stuff around the model as I do that, but getting real salons using it is the main thing I care about right now.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
