/** Local illustration only. There are deliberately no API clients in this module. */
export type Scenario = "success" | "failure";
export type CallState = {
  phase: number;
  playing: boolean;
  scenario: Scenario;
  receipt: { service: string; time: string } | null;
};
export type CallAction =
  | { type: "replay"; automatic: boolean }
  | { type: "advance" }
  | { type: "previous" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "finish" }
  | { type: "scenario"; scenario: Scenario };

const receipt = () => ({ service: "Nail repair", time: "16:30" });
// The whole example is readable on arrival, and with JavaScript disabled.
export const initialCall: CallState = { phase: 4, playing: false, scenario: "success", receipt: receipt() };
export const phaseDuration = [1600, 2500, 1000, 1600] as const;

function atPhase(state: CallState, phase: number): CallState {
  const next = Math.max(0, Math.min(4, phase));
  return { ...state, phase: next, playing: next < 4 && state.playing,
    receipt: next === 4 && state.scenario === "success" ? receipt() : null };
}
export function callReducer(state: CallState, action: CallAction): CallState {
  switch (action.type) {
    case "replay": return { ...state, phase: 0, playing: action.automatic, receipt: null };
    case "advance": return atPhase(state, state.phase + 1);
    case "previous": return atPhase({ ...state, playing: false }, state.phase - 1);
    case "pause": return { ...state, playing: false };
    case "resume": return { ...state, playing: state.phase < 4 };
    case "finish": return atPhase({ ...state, playing: false }, 4);
    case "scenario": return atPhase({ ...state, scenario: action.scenario, playing: false, receipt: null }, 4);
  }
}
export function isBooked(state: CallState): boolean {
  return state.phase === 4 && state.scenario === "success" &&
    state.receipt?.time === "16:30" && state.receipt.service === "Nail repair";
}
export const phaseLabels = ["The customer asks for a time", "Della checks the calendar", "The customer agrees", "Della tries to book it", "The result comes back"];
export function lastReply(state: CallState): string {
  if (state.phase < 4) return "Just booking that for you.";
  return isBooked(state) ? "You're booked for 4:30." : "That booking didn't go through. Let me get someone to help.";
}
