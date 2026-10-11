// Structural type snapshot from pegg-dot/vial, 5a08f288. No server imports.
export type Verdict = "trusted" | "caution" | "avoid" | "high-risk" | "unproven" | "info";
export type SignalConfidence = "verified" | "reported" | "inferred";
export interface Signal { ok: boolean | null; label: string; detail: string; confidence?: SignalConfidence }
export interface ComposedVerdict {
  verdict: Verdict;
  headline: string;
  summary: string;
  factors: Signal[];
  weighed: number;
  verifiedCount: number;
}
