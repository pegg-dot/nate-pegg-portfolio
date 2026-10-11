// Exact pure grade projection from pegg-dot/vial at 5a08f288a136d2af232e224770e07408902878bd.
// Only comments and type import paths are changed. Inputs on this page are fictional.
import type { Signal, ComposedVerdict } from "./grade-types";

export type GradeLetter = "A" | "A-" | "B+" | "B" | "C+" | "C" | "C-" | "D" | "F";
export type GradeBand = "strong" | "mixed" | "adverse" | "insufficient" | "reference";
export type DimensionKey = "testing" | "regulatory" | "reputation" | "operations";
export type DimensionState = "supported" | "clear" | "adverse" | "conflicting" | "noted" | "absent";
export interface GradeDimension {
    key: DimensionKey;
    label: string;
    state: DimensionState;
    factors: Signal[];
}
export interface VialGradeResult {
    letter: GradeLetter | null;
    band: GradeBand;
    headline: string;
    rationale: string;
    dimensions: GradeDimension[];
    weighed: number;
    verifiedCount: number;
}
const DIMENSION_OF: Record<string, DimensionKey> = {
    "Independent testing": "testing",
    "COA integrity": "testing",
    "Dose accuracy": "testing",
    "Government enforcement": "regulatory",
    "Operator network": "regulatory",
    "Scam & red flags": "reputation",
    "Conflicting evidence": "reputation",
    "Third-party trackers": "reputation",
    "Buyer reviews": "reputation",
    "Community": "reputation",
    "Domain age": "operations",
    "Storefront signal": "operations",
    "Research-use notice": "operations",
    "Site status": "operations",
};
const DIMENSION_LABEL: Record<DimensionKey, string> = {
    testing: "Independent testing",
    regulatory: "Regulatory & network",
    reputation: "Reputation",
    operations: "Business signals",
};
const DIMENSION_ORDER: DimensionKey[] = ["testing", "regulatory", "reputation", "operations"];
function isAdverse(signal: Signal): boolean {
    return signal.ok === false && signal.confidence != null;
}
const CONFLICT_LABELS = new Set(["Conflicting evidence"]);
function stateOf(factors: Signal[]): DimensionState {
    if (factors.length === 0)
        return "absent";
    if (factors.some(isAdverse))
        return "adverse";
    if (factors.some(f => f.ok === null && CONFLICT_LABELS.has(f.label)))
        return "conflicting";
    if (factors.some(f => f.ok === null))
        return "noted";
    if (factors.some(f => f.ok === true && f.confidence != null))
        return "supported";
    if (factors.some(f => f.ok === true))
        return "clear";
    return "absent";
}
function buildDimensions(factors: Signal[]): GradeDimension[] {
    return DIMENSION_ORDER.map(key => {
        const members = factors.filter(f => DIMENSION_OF[f.label] === key);
        return { key, label: DIMENSION_LABEL[key], state: stateOf(members), factors: members };
    });
}
function verifiedNegativeLabels(composed: ComposedVerdict): string[] {
    return [...new Set(composed.factors.filter((f) => f.ok === false && f.confidence === "verified").map((f) => f.label))];
}
const listLabels = (labels: string[]): string => labels.length <= 1 ? (labels[0] ?? "") : `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
export function gradeFromVerdict(composed: ComposedVerdict, input: {
    coaCount: number;
    listingCount?: number;
    vendorKind?: string | null;
}): VialGradeResult {
    const dimensions = buildDimensions(composed.factors);
    const base = {
        dimensions,
        weighed: composed.weighed,
        verifiedCount: composed.verifiedCount,
    };
    const hasVerifiedNegative = composed.factors.some(f => f.ok === false && f.confidence === "verified");
    const adverseTiers = composed.factors.filter(f => f.ok === false).map(f => f.confidence);
    const adverseIsInferredOnly = adverseTiers.length > 0 && adverseTiers.every(t => t == null || t === "inferred");
    const tested = input.coaCount > 0;
    const adverseVerdict = composed.verdict === "avoid" || composed.verdict === "high-risk" || composed.verdict === "caution";
    const nothingListed = input.listingCount === 0;
    const adverseIsSubstantiated = composed.factors.some((f) => f.ok === false && (f.confidence === "verified" || f.confidence === "reported"));
    if (nothingListed && (!adverseVerdict || !adverseIsSubstantiated)) {
        const tests = `${input.coaCount} independent lab test${input.coaCount === 1 ? "" : "s"}`;
        const isKnownStorefront = input.vendorKind === "storefront";
        return {
            ...base,
            letter: null,
            band: "reference",
            headline: isKnownStorefront ? "No listings on record" : "Maker — not a shop",
            rationale: isKnownStorefront
                ? (input.coaCount > 0
                    ? `This is a storefront, but we have not captured any current listings for it, so there is nothing here to rate. We do hold ${tests} naming them.`
                    : "This is a storefront, but we have not captured any current listings or lab tests for it yet, so there is nothing here to rate.")
                : (input.coaCount > 0
                    ? `We hold ${tests} naming this maker, but they don't sell direct — nothing here is a storefront you can buy from, so there is nothing to rate. Their tests may back a listing sold by someone else.`
                    : "We hold a record of this maker but no lab tests and nothing listed for sale, so there is nothing to rate."),
        };
    }
    const notListedNote = nothingListed
        ? " We hold nothing listed for sale from them here, so this is a warning about the operator rather than about a specific listing."
        : "";
    switch (composed.verdict) {
        case "unproven":
        case "info": {
            return {
                ...base,
                letter: null,
                band: "insufficient",
                headline: "Not enough evidence to grade",
                rationale: tested
                    ? "This is not a warning. We track this vendor but have not found enough independent evidence to rate them yet. No news is not the same as good news — check the specific listing before you buy."
                    : "This is not a warning — it means we have not found independent lab tests for them yet. That is different from finding something bad. It also is not a clean bill of health: check the specific listing before you buy.",
            };
        }
        case "avoid":
        case "high-risk": {
            if (adverseIsInferredOnly) {
                return {
                    ...base,
                    letter: null,
                    band: "insufficient",
                    headline: "Not enough evidence to grade",
                    rationale: "The only red flags here came from our own automated scan — reading their storefront, or one failed attempt to load their site. That is not solid enough to grade a real company on, so we are not going to. What we saw is listed below.",
                };
            }
            const letter: GradeLetter = hasVerifiedNegative ? "F" : "D";
            return {
                ...base,
                letter,
                band: "adverse",
                headline: `${letter} — avoid`,
                rationale: hasVerifiedNegative
                    ? `The strongest evidence we hold counts against this vendor — ${listLabels(verifiedNegativeLabels(composed)).toLowerCase()}. That is independently documented, and it caps the grade here.${notListedNote}`
                    : `Buyers and the community report problems, but we have no official record to point at. That is why this is a D rather than an F.${notListedNote}`,
            };
        }
        case "caution": {
            const letter: GradeLetter = hasVerifiedNegative ? "C-" : tested ? "C+" : "C";
            return {
                ...base,
                letter,
                band: "mixed",
                headline: `${letter} — proceed with caution`,
                rationale: hasVerifiedNegative
                    ? `Something independently documented counts against this vendor — ${listLabels(verifiedNegativeLabels(composed)).toLowerCase()}. Real lab tests would not cancel that out, so the grade stops here.${notListedNote}`
                    : tested
                        ? `There are real reasons to be careful with this vendor, but they do have independent lab tests on file, which counts for something.${notListedNote}`
                        : `There are real reasons to be careful with this vendor, and no independent lab tests to weigh against them.${notListedNote}`,
            };
        }
        case "trusted": {
            const coa = input.coaCount;
            const letter: GradeLetter = coa >= 10 ? "A" : coa >= 3 ? "A-" : coa >= 1 ? "B+" : "B";
            const tests = `${coa} independent lab test${coa === 1 ? "" : "s"}`;
            return {
                ...base,
                letter,
                band: "strong",
                headline: `${letter} — generally trusted`,
                rationale: coa === 0
                    ? composed.verifiedCount === 0
                        ? "No red flags on record — but nothing here is independently verified and nothing has been lab-tested. This rests on third-party accounts, which is the ceiling without hard evidence."
                        : "No red flags on record — but nothing here has been independently tested, so this is the ceiling without lab evidence."
                    : `No red flags on record, and ${tests} on file. A grade reflects the evidence we hold, not the safety of any vial you receive.`,
            };
        }
    }
}
