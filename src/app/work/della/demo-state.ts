// All data in this module is illustrative and local. There are no provider calls.
export type Scenario = "success" | "failure";
export type DemoReceipt = { source: "illustration"; id: string; service: string; time: string; exists: true };
export type BookingState = { step: number; scenario: Scenario; receipt: DemoReceipt | null };
export type BookingAction = { type: "next" | "previous" | "reset" } | { type: "scenario"; scenario: Scenario };

export const bookingSteps = ["Requested", "Schedule checked", "Caller confirmed", "Booking attempted", "Outcome checked"] as const;
export const initialBooking: BookingState = { step: 0, scenario: "success", receipt: null };

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  if (action.type === "scenario") return { ...initialBooking, scenario: action.scenario };
  if (action.type === "reset") return { ...initialBooking, scenario: state.scenario };
  if (action.type === "previous") return { ...state, step: Math.max(0, state.step - 1), receipt: null };
  if (state.step >= 4) return state;
  const step = state.step + 1;
  // Only the final outcome check can create a receipt. An attempt is not success.
  const receipt: DemoReceipt | null = step === 4 && state.scenario === "success"
    ? { source: "illustration", id: "DEMO-0430", service: "Nail repair", time: "16:30", exists: true }
    : null;
  return { ...state, step, receipt };
}

export function bookingVerified(state: BookingState): boolean {
  return state.step === 4 && state.scenario === "success" && state.receipt?.source === "illustration"
    && state.receipt.exists === true && state.receipt.service === "Nail repair" && state.receipt.time === "16:30";
}

export function bookingExplanation(state: BookingState): { title: string; text: string } {
  if (state.step === 4) return bookingVerified(state)
    ? { title: "The demo appointment exists.", text: "A matching appointment record is present in this example. Only now does the walkthrough show a verified booking." }
    : { title: "Not booked. No false confirmation.", text: "The example booking failed. There is no appointment record, so Della must not tell the caller that it is booked." };
  return [
    { title: "A time is requested, not promised.", text: "The customer wants a nail repair at 4:30. The requested time is not yet a confirmed appointment." },
    { title: "The schedule is the source.", text: "In this example, the booking system returns 4:30 as available. Availability is checked instead of recalled from memory." },
    { title: "The caller confirms the time.", text: "The customer agrees to the available appointment. Their confirmation permits the booking attempt, but is not proof it succeeded." },
    { title: "An attempt is not a result.", text: "The booking request has been made in the demonstration. The outcome still has to be checked before a confirmation can be shown." },
  ][state.step];
}
