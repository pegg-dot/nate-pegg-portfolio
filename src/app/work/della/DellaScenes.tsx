"use client";

import { useEffect, useId, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { callReducer, initialCall, isBooked, lastReply, phaseDuration, phaseLabels } from "./demo-state";
import s from "./della.module.css";

function subscribe(notify: () => void) {
  const q = window.matchMedia("(prefers-reduced-motion: reduce)");
  q.addEventListener("change", notify);
  return () => q.removeEventListener("change", notify);
}
const preference = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverPreference = () => false;

export function DellaMark({ small = false }: { small?: boolean }) {
  return <span className={`${s.mark} ${small ? s.markSmall : ""}`} aria-hidden="true"><span /></span>;
}
export function Icon({ name, size = 18 }: { name: "arrow" | "back" | "check" | "phone" | "calendar" | "replay" | "pause" | "play" | "edit"; size?: number }) {
  const paths = {
    arrow: "M4 12h15m-6-6 6 6-6 6", back: "M20 12H5m6-6-6 6 6 6",
    check: "m5 12 4 4L19 6", phone: "M8 3H5a2 2 0 0 0-2 2c0 9 7 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a14 14 0 0 1-6-6l2-2-2-5Z",
    calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z",
    replay: "M3 10a9 9 0 1 1 2 8M3 4v6h6", pause: "M8 5v14M16 5v14",
    play: "m8 4 12 8-12 8V4Z", edit: "m15 4 5 5M4 20l5-1L21 7l-5-5L4 14v6Z",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export function BookingDemo({ inStory = false }: { inStory?: boolean }) {
  const [state, dispatch] = useReducer(callReducer, initialCall);
  const reduced = useSyncExternalStore(subscribe, preference, serverPreference);
  const root = useRef<HTMLDivElement>(null);
  const booked = isBooked(state);
  const failed = state.phase === 4 && !booked;

  useEffect(() => {
    if (reduced && state.playing) { dispatch({ type: "pause" }); return; }
    if (!state.playing || state.phase >= 4) return;
    const timer = window.setTimeout(() => dispatch({ type: "advance" }), phaseDuration[state.phase]);
    return () => window.clearTimeout(timer);
  }, [state.playing, state.phase, reduced]);
  useEffect(() => {
    const pause = () => { if (document.hidden) dispatch({ type: "pause" }); };
    document.addEventListener("visibilitychange", pause);
    const node = root.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) dispatch({ type: "pause" });
    });
    if (node) observer.observe(node);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pause); };
  }, []);

  const reply = (speaker: string, text: string, phase: number, customer = false) => (
    <motion.div key={phase} initial={false} animate={{ opacity: state.phase >= phase ? 1 : 0 }} style={{ visibility: state.phase >= phase ? "visible" : "hidden" }}
      transition={{ duration: reduced ? 0 : 0.18 }}
      className={`${s.utterance} ${customer ? s.customer : s.dellaReply}`}
      aria-hidden={state.phase < phase || undefined} data-visible={state.phase >= phase}>
      <span className={s.speaker}>{speaker}</span><p>{text}</p>
    </motion.div>
  );
  const status = booked ? "Appointment created" : failed ? "Booking not completed" : state.phase === 3 ? "Booking in progress" : state.phase > 0 ? "4:30 is available" : "Checking the time";

  return <div className={`${s.exampleWrap} ${inStory ? s.inStory : ""}`} ref={root} id="booking">
    <div className={s.callExample} data-testid="booking-demo" data-phase={state.phase} data-scenario={state.scenario} data-booked={booked} data-playing={state.playing && !reduced}>
      <div className={s.exampleHeader}><span><Icon name="phone" size={16} /> A customer calls to book</span><span className={s.exampleLabel}>Example call</span></div>
      <div className={s.callAndCalendar}>
        <div className={s.conversation} aria-label="Example phone conversation">
          {reply("Customer", "Could I book a nail repair at 4:30?", 0, true)}
          {reply("Della", "Let me check... Yes, 4:30 is available. Shall I book it?", 1)}
          {reply("Customer", "Yes, please.", 2, true)}
          {reply("Della", lastReply(state), 3)}
        </div>
        <div className={s.calendar} aria-label="Example salon calendar">
          <div className={s.calendarHeader}><Icon name="calendar" size={15} /><span>The salon&apos;s calendar</span></div>
          <span className={s.calendarSystem}>Connected through Square</span>
          <div className={s.calendarGrid}>
            <div className={s.timeRow}><span>4:00</span><i /></div>
            <div className={s.appointmentRow}><span>4:30</span>
              <div className={`${s.appointment} ${booked ? s.appointmentBooked : ""} ${failed ? s.appointmentFailed : ""}`} data-testid="appointment">
                <span className={s.appointmentStatus}>{booked ? <><Icon name="check" size={13} /> Booked</> : failed ? "Not booked" : state.phase === 3 ? "Booking..." : "Not booked yet"}</span>
                <strong>Nail repair</strong><span className={s.appointmentTime}>4:30 pm</span>
              </div>
            </div>
            <div className={s.timeRow}><span>5:00</span><i /></div>
          </div>
          <div className={s.calendarResult} role="status" aria-atomic="true"><span className={booked ? s.doneDot : s.pendingDot} />{status}</div>
        </div>
      </div>
      <div className={s.callTakeaway} aria-live="polite">{failed ? "If the booking fails, Della shouldn't tell the caller they're booked in." : "Della checks that the appointment exists before telling the caller it's booked."}</div>
      <div className={s.exampleControls} data-interactive="true">
        <div className={s.playback}>
          <button type="button" className={s.replayButton} onClick={() => state.phase === 4 ? dispatch({ type: "replay", automatic: !reduced }) : state.playing && !reduced ? dispatch({ type: "pause" }) : reduced ? dispatch({ type: "advance" }) : dispatch({ type: "resume" })}>
            <Icon name={state.phase === 4 ? "replay" : state.playing && !reduced ? "pause" : reduced ? "arrow" : "play"} size={15} />
            {state.phase === 4 ? "Replay the example" : state.playing && !reduced ? "Pause" : reduced ? "Next step" : "Continue"}
          </button>
          {state.phase < 4 && <button type="button" className={s.finishButton} onClick={() => dispatch({ type: "finish" })}>Show the result</button>}
        </div>
        <button type="button" className={s.failureButton} aria-pressed={state.scenario === "failure"} onClick={() => dispatch({ type: "scenario", scenario: state.scenario === "success" ? "failure" : "success" })}>{state.scenario === "success" ? "What if it doesn't book?" : "Show the successful booking"}</button>
      </div>
      <p className={s.srOnly} aria-live="polite">{phaseLabels[state.phase]}</p>
    </div>
    <p className={s.exampleCaption}>An illustrated conversation, not a recording. Nothing is booked from this page.</p>
  </div>;
}

const initialDraft = "Hi! Would you like to find a time for your next appointment?";
export function ApprovalDemo({ inStory = false }: { inStory?: boolean }) {
  const [draft, setDraft] = useState(initialDraft);
  const [editing, setEditing] = useState(false);
  const [decision, setDecision] = useState<"waiting" | "approved" | "later">("waiting");
  const id = useId();
  const editor = useRef<HTMLTextAreaElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (editing) editor.current?.focus(); }, [editing]);

  return <div className={`${s.approvalExample} ${inStory ? s.inStory : ""}`} data-testid="approval-demo" data-decision={decision}>
    <div className={s.approvalHeader}><span><DellaMark small /> Della needs your OK</span><span className={s.exampleLabel}>Example follow-up</span></div>
    <div className={s.draftBody}>
      <div className={s.draftHeading}><span>To a returning customer</span><span className={s.draftStatus}>{decision === "approved" ? "Approved" : decision === "later" ? "Left for later" : "Waiting for approval"}</span></div>
      <label id={`${id}-label`} className={s.srOnly}>Edit the follow-up message</label>
      {editing ? <textarea ref={editor} aria-labelledby={`${id}-label`} value={draft} maxLength={300} rows={4} onChange={event => { setDraft(event.target.value); setDecision("waiting"); }} className={s.draftEditor} /> : <p className={s.draftText} data-testid="draft-text">{draft.trim() ? draft : "No message written yet."}</p>}
      <div className={s.draftActions} data-interactive="true">
        <button type="button" ref={editButton} className={s.editButton} onClick={() => {
          if (editing) { setEditing(false); editButton.current?.focus(); }
          else { setDecision("waiting"); setEditing(true); }
        }}><Icon name={editing ? "check" : "edit"} size={15} />{editing ? "Done editing" : "Edit message"}</button>
        <div><button type="button" className={s.laterButton} onClick={() => { setEditing(false); setDecision("later"); }}>Not now</button><button type="button" className={s.approveButton} disabled={!draft.trim() || decision === "approved"} onClick={() => { setEditing(false); setDecision("approved"); }}>{decision === "approved" ? <><Icon name="check" size={15} /> Approved</> : "Approve"}</button></div>
      </div>
      <p className={s.decisionNote} aria-live="polite" aria-atomic="true">{!draft.trim() ? "Write a message before approving it. Nothing is sent from this example." : decision === "approved" ? "The owner approved this draft. Nothing was sent from this example." : decision === "later" ? "The draft is still waiting. Nothing was sent." : "This example waits for the owner. It doesn't send real texts."}</p>
    </div>
  </div>;
}
