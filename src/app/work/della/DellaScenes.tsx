"use client";

import { useEffect, useId, useReducer, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { LayoutGroup, motion } from "motion/react";
import { bookingExplanation, bookingReducer, bookingSteps, bookingVerified, initialBooking } from "./demo-state";
import copy from "./story-copy.json";
import s from "./della.module.css";

// Subscribe directly so SSR hydration and live preference changes agree.
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotionPreference(notify: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
const readMotionPreference = () => window.matchMedia(motionQuery).matches;
const serverMotionPreference = () => false;
function useMotionPreference() {
  return useSyncExternalStore(subscribeMotionPreference, readMotionPreference, serverMotionPreference);
}

type IconName = "arrow" | "back" | "check" | "phone" | "calendar" | "clock" | "close" | "replay" | "message" | "lock";
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const shapes: Record<IconName, string> = {
    arrow: "M4 12h15m-6-6 6 6-6 6", back: "M20 12H5m6-6-6 6 6 6", check: "m5 12 4 4L19 6",
    phone: "M8 3H5a2 2 0 0 0-2 2c0 9 7 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a14 14 0 0 1-6-6l2-2-2-5Z",
    calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Zm3 10h3m3 0h3m-9 3h3",
    clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", close: "m6 6 12 12M18 6 6 18",
    replay: "M3 10a9 9 0 1 1 2 8M3 4v6h6", message: "M4 4h16v12H9l-5 4V4Z",
    lock: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5V10Zm7 4v3",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={shapes[name]} /></svg>;
}

export function DellaMark({ small = false }: { small?: boolean }) {
  return <span className={`${s.mark} ${small ? s.markSmall : ""}`} aria-hidden="true"><span /></span>;
}

export function HeroScene() {
  return <div className={s.heroVisual}>
    <div className={s.heroWindow}>
      <div className={s.windowBar}><span className={s.wordmark}><DellaMark small /> Della</span><span>One appointment</span><span className={s.demoTag}>Illustration</span></div>
      <div className={s.heroWindowBody}>
        <div className={s.heroRequest}><span className={s.iconRound}><Icon name="phone" /></span><div><span className={s.tiny}>THE REQUEST</span><strong>A nail repair. At 4:30.</strong><span>One call, followed through.</span></div></div>
        <div className={s.heroCalendar}>
          <div className={s.calendarTop}><span><Icon name="calendar" /> The salon&apos;s schedule</span><span>Example afternoon</span></div>
          <div className={s.miniTime}><span>3:30</span><i /></div>
          <div className={s.miniTime}><span>4:00</span><i /></div>
          <div className={`${s.miniTime} ${s.miniActive}`}><span>4:30</span><div className={s.heroAppointment}><DellaMark small /><div><strong>Nail repair</strong><span>The requested time</span></div><span className={s.outlineCheck}><Icon name="clock" size={14} /></span></div></div>
          <div className={s.miniTime}><span>5:00</span><i /></div>
        </div>
        <a className={s.heroVisualLink} href="#booking">See what has to happen first <Icon name="arrow" /></a>
      </div>
    </div>
    <span className={s.handNote}>the appointment has to actually exist<svg viewBox="0 0 110 40" fill="none" aria-hidden="true"><path d="M3 29c42 15 61-20 99-19m-11-7 12 7-8 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></span>
    <p className={s.sceneCaption}>A simplified walkthrough. Not a live booking or a customer transcript.</p>
  </div>;
}

export function BookingDemo() {
  const [state, dispatch] = useReducer(bookingReducer, initialBooking);
  const reduced = useMotionPreference();
  const id = useId();
  const verified = bookingVerified(state);
  const failed = state.step === 4 && !verified;
  const explanation = bookingExplanation(state);
  const duration = reduced ? 0 : .4;
  const ticket = <motion.div layoutId={`${id}-request`} layout="position" transition={{ duration, ease: [.22, 1, .36, 1] }} className={`${s.requestTicket} ${verified ? s.verifiedTicket : ""}`} data-testid="request-ticket">
    <div className={s.ticketTop}><DellaMark small /><span>{verified ? "Verified in this demo" : state.step >= 3 ? "Checking the outcome" : "Booking request"}</span>{verified && <Icon name="check" size={16} />}</div>
    <strong>Nail repair</strong><div className={s.ticketTime}><span>4:30</span><small>pm</small></div>
    <span className={s.ticketFoot}>{verified ? "DEMO-0430 · illustrative record" : "Same request, all the way through"}</span>
  </motion.div>;
  const labels = ["Check availability", "Confirm the time", "Attempt booking", "Check the outcome"];
  return <div className={s.bookingDemo} data-testid="booking-demo" data-step={state.step} data-verified={verified} data-scenario={state.scenario}>
    <div className={s.windowBar}><span className={s.wordmark}><DellaMark small /> Della</span><span className={s.demoTag}>Interactive illustration</span></div>
    <fieldset className={s.scenario}><legend>Try an outcome</legend><label><input type="radio" name={`${id}-scenario`} checked={state.scenario === "success"} onChange={() => dispatch({ type: "scenario", scenario: "success" })} /> Booking succeeds</label><label><input type="radio" name={`${id}-scenario`} checked={state.scenario === "failure"} onChange={() => dispatch({ type: "scenario", scenario: "failure" })} /> Booking fails</label></fieldset>
    <LayoutGroup id={id}>
      <div className={s.bookingStage}>
        <div className={s.callSide}><span className={s.stageLabel}><Icon name="phone" size={14} /> THE CALL</span><div className={s.ticketWell}>{state.step < 3 || failed ? ticket : <div className={s.forwarded}><Icon name="arrow" /><span>The request is with<br />the booking system.</span></div>}</div><span className={s.callState}>{["A time is requested", "An available time is found", "The caller agrees", "Still waiting for the result", failed ? "No booking to confirm" : "A result to confirm"][state.step]}</span></div>
        <div className={s.scheduleSide}><span className={s.stageLabel}><Icon name="calendar" size={14} /> THE BOOKING SYSTEM</span><div className={s.scheduleTime}><span>4:00</span><i /></div><div className={`${s.bookingSlot} ${state.step >= 1 && state.step < 3 ? s.availableSlot : ""} ${failed ? s.failedSlot : ""}`}><span className={s.slotTime}>4:30</span><div className={s.slotBody}>{state.step >= 3 && !failed ? ticket : <><span className={s.slotMark}>{failed ? "!" : state.step > 0 ? <Icon name="check" /> : "?"}</span><strong>{failed ? "Not booked" : state.step > 0 ? "Available in this example" : "Not checked yet"}</strong><small>{failed ? "No appointment record exists" : state.step > 0 ? "Availability is not a booking" : "Ask the schedule, not the model"}</small></>}</div></div><div className={s.scheduleTime}><span>5:00</span><i /></div></div>
      </div>
    </LayoutGroup>
    <ol className={s.stepTrack} aria-label="Booking progress">{bookingSteps.map((step, i) => <li key={step} aria-current={state.step === i ? "step" : undefined} className={i <= state.step ? s.stepReached : ""}><span>{i < state.step ? <Icon name="check" size={12} /> : String(i + 1).padStart(2, "0")}</span><small>{step}</small></li>)}</ol>
    <div className={`${s.explanation} ${failed ? s.failureExplanation : ""}`} aria-live="polite" aria-atomic="true"><strong>{explanation.title}</strong><p>{explanation.text}</p></div>
    <div className={s.demoControls}><button type="button" className={s.textButton} onClick={() => dispatch({ type: "previous" })} disabled={state.step === 0}><Icon name="back" size={16} /> Previous</button>{state.step < 4 ? <button type="button" className={s.primaryButton} onClick={() => dispatch({ type: "next" })}>{labels[state.step]} <Icon name="arrow" size={16} /></button> : <button type="button" className={s.primaryButton} onClick={() => dispatch({ type: "reset" })}><Icon name="replay" size={16} /> Replay the booking</button>}</div>
    <p className={s.safetyNote}><Icon name="lock" size={12} /> Local demonstration only. Nothing is booked or sent.</p>
    <details className={s.readSteps} open={reduced || undefined}><summary>Read the whole sequence without playing it</summary><ol><li>A customer requests 4:30 for a nail repair.</li><li>Availability comes from the booking system, not remembered context.</li><li>The caller agrees to the available time.</li><li>The system attempts the booking. An attempt is not confirmation.</li><li>A matching appointment record permits confirmation. A failed attempt leaves the appointment unbooked.</li></ol></details>
  </div>;
}

export function MemoryDemo() {
  const [nextCall, setNextCall] = useState(false);
  const reduced = useMotionPreference();
  const id = useId();
  const memory = <motion.div layoutId={`${id}-memory`} layout="position" transition={{ duration: reduced ? 0 : .65, ease: [.22, 1, .36, 1] }} className={s.memoryToken} data-testid="memory-token"><span className={s.memoryDot} /><span>Chipped nail</span><small>customer context</small></motion.div>;
  return <div className={s.memoryDemo} data-testid="memory-demo" data-call={nextCall ? "2" : "1"}>
    <p className={s.memoryDisclosure}>Nate&apos;s recollection, not a verbatim transcript.</p>
    <LayoutGroup id={id}><div className={s.memoryPages}>
      <div className={`${s.memoryPage} ${!nextCall ? s.memoryPageActive : ""}`}><span className={s.memoryPageNumber} aria-hidden="true">01</span><span className={s.tiny}>THE FIRST CALL</span><p>{copy.memoryFirst}</p><div className={s.memoryPocket}>{!nextCall ? memory : <span className={s.memoryPlaceholder}>Carried into the next conversation <Icon name="arrow" size={16} /></span>}</div></div>
      <div className={`${s.memoryPage} ${nextCall ? s.memoryPageActive : ""}`}><span className={s.memoryPageNumber} aria-hidden="true">02</span><span className={s.tiny}>A COUPLE DAYS LATER</span><p>{copy.memorySecond}</p><div className={s.memoryPocket}>{nextCall ? memory : <span className={s.memoryPlaceholder}>The conversation doesn&apos;t start from zero.</span>}</div></div>
    </div></LayoutGroup>
    <div className={s.memoryControls}><span aria-live="polite">{nextCall ? "The same detail is here on the next call." : "One detail, kept between conversations."}</span><button type="button" className={s.textButton} onClick={() => setNextCall(!nextCall)}>{nextCall ? <><Icon name="replay" size={16} /> Replay the memory</> : <>Carry it into the next call <Icon name="arrow" size={16} /></>}</button></div>
  </div>;
}

export function ApprovalDemo() {
  const [open, setOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const doneButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open) {
      const before = document.body.style.overflow;
      if (!el.open) el.showModal();
      document.body.style.overflow = "hidden";
      closeButton.current?.focus();
      return () => { document.body.style.overflow = before; };
    }
    if (el.open) { el.close(); trigger.current?.focus(); }
  }, [open]);
  useEffect(() => { if (open && approved) doneButton.current?.focus(); }, [open, approved]);
  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
    if (!controls.length) return;
    const index = controls.indexOf(document.activeElement as HTMLElement);
    const next = event.shiftKey ? (index <= 0 ? controls.length - 1 : index - 1) : (index + 1) % controls.length;
    event.preventDefault();
    controls[next].focus();
  };
  return <div className={s.approvalDemo} data-testid="approval-demo">
    <div className={s.windowBar}><span className={s.wordmark}><DellaMark small /> Della</span><span className={s.demoTag}>Illustrative workspace</span></div>
    <div className={s.approvalBody}>
      <div className={s.queueTitle}><h3>Della needs your OK</h3><span>1 example draft</span></div>
      <div className={s.approvalRow}><span className={s.iconRound}><Icon name="message" /></span><div><strong>Follow up with a customer</strong><span>Rebooking offer · example draft</span></div><button ref={trigger} type="button" className={s.darkButton} onClick={() => setOpen(true)}>{approved ? "View decision" : "Review"}</button></div>
      <div className={s.permissionTrail}><span><Icon name="check" size={14} /> Draft prepared</span><span className={s.permissionBoundary}><Icon name="lock" size={14} /> {approved ? "Approved in this demo" : "Waiting for your OK"}</span><span>Nothing sent</span></div>
      <div className={s.approvalFooter} aria-live="polite">{approved ? <><span>Approved locally. No message was sent.</span><button type="button" className={s.textButton} onClick={() => setApproved(false)}>Reset demo <Icon name="replay" size={14} /></button></> : <span>The draft stops here until you make a decision.</span>}</div>
    </div>
    <dialog ref={dialog} onKeyDown={trapFocus} className={s.approvalDialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className={s.dialogInside}>
        <header className={s.dialogHeader}><span className={s.wordmark}><DellaMark small /> Review a draft</span><button type="button" ref={closeButton} className={s.iconButton} aria-label="Close review" onClick={() => setOpen(false)}><Icon name="close" /></button></header>
        <div className={s.dialogContent}>
          <span className={s.demoTag}>Illustration · no live customer</span><h2 id={`${id}-title`}>You have the last word.</h2><p id={`${id}-description`}>This is a local example of the review flow. Approving it cannot send a message or change a real appointment.</p>
          <div className={s.draftSheet}><span className={s.tiny}>EXAMPLE DRAFT</span><p>Hi! Would you like to find a time for your next appointment?</p><span>Rebooking follow-up</span></div>
          <dl className={s.reviewContext}><div><dt>Proposed action</dt><dd>Follow up with a customer</dd></div><div><dt>Permission boundary</dt><dd>Owner approval required in this example</dd></div><div><dt>Connected to a real service?</dt><dd>No. This page cannot send messages.</dd></div></dl>
          {approved && <div role="status" className={s.approvedNotice}><Icon name="check" /><div><strong>Approved in this demo.</strong><span>No message was sent.</span></div></div>}
        </div>
        <footer className={s.dialogFooter}>{approved ? <button ref={doneButton} type="button" className={s.primaryButton} onClick={() => setOpen(false)}>Back to the story <Icon name="arrow" size={16} /></button> : <><button type="button" className={s.textButton} onClick={() => setOpen(false)}>Keep for review</button><button type="button" className={s.primaryButton} onClick={() => setApproved(true)}>Approve in demo <Icon name="check" size={16} /></button></>}<p>Nothing is texted or booked from this page.</p></footer>
      </div>
    </dialog>
  </div>;
}

export function ContextDemo() {
  const [live, setLive] = useState(false);
  return <div className={s.contextDemo} data-testid="context-demo">
    <div className={s.contextTabs} role="group" aria-label="Choose an information source"><button type="button" aria-pressed={!live} onClick={() => setLive(false)}>Salon knowledge</button><button type="button" aria-pressed={live} onClick={() => setLive(true)}>Live availability</button></div>
    <div className={s.sourceRecord} aria-live="polite"><span className={s.tiny}>{live ? "AN APPOINTMENT QUESTION" : "A SALON QUESTION"}</span><strong>{live ? "Is 4:30 open?" : "What is the cancellation policy?"}</strong><div className={s.sourceConnector}><span /><Icon name="arrow" size={18} /><span /></div><span className={s.sourceName}><Icon name={live ? "calendar" : "message"} />{live ? "The booking system" : "Confirmed salon knowledge"}</span><p>{live ? "Check availability at the time of the request. A remembered opening may no longer exist." : "Use the salon's own confirmed information. Don't invent a policy."}</p></div>
    <p className={s.sceneCaption}>Illustrative questions and sources, not a live lookup.</p>
  </div>;
}
