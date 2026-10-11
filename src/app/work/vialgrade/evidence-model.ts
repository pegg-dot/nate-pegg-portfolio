import type { ComposedVerdict, Signal } from "./grade-types";
import { gradeFromVerdict } from "./grade-projection";

/** Fictional, locally evaluated document examples. No live lab or vendor data. */
export type EvidenceCase = "match" | "missing" | "mismatch";
export type Field = "batch" | "compound" | "manufacturer";
export const fields: { key: Field; label: string }[] = [
  { key: "batch", label: "Batch" },
  { key: "compound", label: "Compound" },
  { key: "manufacturer", label: "Manufacturer" },
];
export type DocumentFields = Record<Field, string>;
export const claim: DocumentFields = { batch: "VG-2410", compound: "Compound Q", manufacturer: "Example Research A" };
export const caseLabels: Record<EvidenceCase, string> = { match: "Matching record", missing: "No matching record", mismatch: "Conflicting record" };
export function recordFor(example: EvidenceCase): DocumentFields | null {
  if (example === "missing") return null;
  return { ...claim, manufacturer: example === "mismatch" ? "Example Research B" : claim.manufacturer };
}
export function compareDocuments(a: DocumentFields, b: DocumentFields | null) {
  if (!b) return { status: "missing" as const, disagreements: [] as Field[] };
  const disagreements = fields.filter(({ key }) => a[key] !== b[key]).map(({ key }) => key);
  return { status: disagreements.length ? "mismatch" as const : "match" as const, disagreements };
}
export const evidenceConclusions: Record<EvidenceCase, { title: string; text: string; limit: string }> = {
  match: { title: "The fields match. The scope matters.", text: "The batch, compound and manufacturer agree with the independent-source record in this example.", limit: "A document match is not a safety certification, and does not establish what is in a physical vial." },
  missing: { title: "Unbacked here. Not proven false.", text: "There is no matching independent record in this example file. A record could exist elsewhere or have not been collected yet.", limit: "Missing evidence is a gap in what we know, not evidence of wrongdoing." },
  mismatch: { title: "Same batch code. Different manufacturer.", text: "The claim names Example Research A. The source record names Example Research B. That discrepancy must stay visible.", limit: "This fictional document conflict does not by itself explain why the mismatch happened." },
};
export const fieldNotes: Record<Field, string> = {
  batch: "A repeated batch code is a starting point, not the whole check. The compound and manufacturer must agree too.",
  compound: "A certificate for a different compound cannot support this claim just because its batch code looks similar.",
  manufacturer: "The named manufacturer must support this attribution. A record about somebody else is not evidence for this claim.",
};

export type GradeCase = "unknown" | "supported" | "concern";
export const gradeCaseLabels: Record<GradeCase, string> = { unknown: "Missing evidence", supported: "Supported record", concern: "Verified concern" };
const noEnforcement: Signal = { label: "Government enforcement", ok: true, detail: "No adverse record in this prepared file. Absence is not verified positive evidence." };
const missingTests: Signal = { label: "Independent testing", ok: false, detail: "No independent tests in this prepared file. Missing, not adverse." };
const tests: Signal = { label: "Independent testing", ok: true, confidence: "verified", detail: "Three fictional independent lab records are included in this prepared example." };
const storefront: Signal = { label: "Storefront signal", ok: null, confidence: "inferred", detail: "A storefront observation, not a laboratory finding." };
const documentedConcern: Signal = { label: "COA integrity", ok: false, confidence: "verified", detail: "A substantiated document concern is supplied in this fictional input. Other tests do not cancel it out." };
export const gradeExamples: Record<GradeCase, { verdict: ComposedVerdict; input: { coaCount: number; listingCount: number; vendorKind: string }; note: string }> = {
  unknown: { verdict: { verdict: "unproven", headline: "Prepared input", summary: "Fictional inputs", factors: [missingTests, noEnforcement, storefront], weighed: 1, verifiedCount: 0 }, input: { coaCount: 0, listingCount: 1, vendorKind: "storefront" }, note: "The supplied verdict is unproven. The real projection returns no letter. Missing tests are not a negative finding." },
  supported: { verdict: { verdict: "trusted", headline: "Prepared input", summary: "Fictional inputs", factors: [tests, noEnforcement, storefront], weighed: 2, verifiedCount: 1 }, input: { coaCount: 3, listingCount: 1, vendorKind: "storefront" }, note: "The supplied verdict is trusted, with three independent tests. In this band, the real projection returns A-. Three tests alone do not establish that verdict." },
  concern: { verdict: { verdict: "caution", headline: "Prepared input", summary: "Fictional inputs", factors: [tests, documentedConcern, noEnforcement, storefront], weighed: 3, verifiedCount: 2 }, input: { coaCount: 3, listingCount: 1, vendorKind: "storefront" }, note: "The supplied verdict is caution, with a verified negative finding. The real projection returns C-, even with three independent tests." },
};
export function exampleGrade(example: GradeCase) {
  const { verdict, input } = gradeExamples[example];
  return gradeFromVerdict(verdict, input);
}
export const dimensionLabels = { supported: "Supported", clear: "No adverse record", adverse: "Adverse evidence", conflicting: "Conflicting", noted: "Observation", absent: "Not established" };

export const exampleDestination = "https://vendor.example/research/compound-q";
export const exampleTaggedUrl = exampleDestination + "?utm_source=vialgrade&utm_medium=referral&vg=DEMO-CLICK-01&utm_campaign=compound-q&utm_content=example-listing";
export const linkParts = [
  { key: "utm_source", value: "vialgrade", meaning: "Where the referral came from." },
  { key: "utm_medium", value: "referral", meaning: "How this visit was referred." },
  { key: "vg", value: "DEMO-CLICK-01", meaning: "An illustrative click reference. It does not prove a purchase." },
  { key: "utm_campaign", value: "compound-q", meaning: "The related compound." },
  { key: "utm_content", value: "example-listing", meaning: "The listing that led to the handoff." },
];
