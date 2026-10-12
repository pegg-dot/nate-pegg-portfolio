import { compareDocuments, claim, recordFor, type EvidenceCase, type GradeCase } from './evidence-model';

/** Copy for the portfolio only. No collector, upstream verdict engine or product API. */
export const readingCases: { key: EvidenceCase; label: string }[] = [
  { key: 'match', label: 'Details match' },
  { key: 'missing', label: 'No record' },
  { key: 'mismatch', label: 'Different maker' },
];
export const findings: Record<EvidenceCase, { title: string; text: string }> = {
  match: {
    title: 'These details match.',
    text: "The lab record names the same batch, compound and manufacturer as the vendor's claim.",
  },
  missing: {
    title: "There isn't a record to compare yet.",
    text: "No matching lab record is provided here. That leaves the claim unchecked; it doesn't prove the vendor did something wrong.",
  },
  mismatch: {
    title: "The manufacturer doesn't match.",
    text: 'Both records say VG-2410, but the lab record names Example Research B. A matching batch code alone is not enough.',
  },
};
export function readingComparison(example: EvidenceCase) {
  const record = recordFor(example);
  const result = compareDocuments(claim, record);
  return { record, ...result, finding: findings[result.status] };
}
export const gradeSummaries: { key: GradeCase; heading: string; text: string }[] = [
  {
    key: 'unknown', heading: 'Not enough information',
    text: "This example doesn't have enough independent evidence to rate. That isn't a finding against the vendor.",
  },
  {
    key: 'supported', heading: 'A stronger record',
    text: "This example has a positive assessment and three independent tests. The test count alone doesn't earn the grade.",
  },
  {
    key: 'concern', heading: 'A documented problem',
    text: "This example has a verified concern about a certificate. Other tests don't make that finding disappear.",
  },
];
