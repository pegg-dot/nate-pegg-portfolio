"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { LayoutGroup, motion } from "motion/react";
import {
  claim, fields, caseLabels, recordFor, compareDocuments, evidenceConclusions, fieldNotes,
  gradeCaseLabels, gradeExamples, exampleGrade, dimensionLabels,
  type EvidenceCase, type Field, type GradeCase,
} from "./evidence-model";
import s from "./vial.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribe(notify: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
const readPreference = () => window.matchMedia(motionQuery).matches;
const serverPreference = () => false;
function useMotionPreference() { return useSyncExternalStore(subscribe, readPreference, serverPreference); }
const subscribeHydration = () => () => {};
const hydratedSnapshot = () => true;
const serverHydration = () => false;

export function EvidenceComparison() {
  const hydrated = useSyncExternalStore(subscribeHydration, hydratedSnapshot, serverHydration);
  const [example, setExample] = useState<EvidenceCase>("match");
  const [field, setField] = useState<Field>("batch");
  const reduced = useMotionPreference();
  const id = useId();
  const record = recordFor(example);
  const comparison = compareDocuments(claim, record);
  const conclusion = evidenceConclusions[comparison.status];
  const duration = reduced ? 0 : .28;
  function chooseCase(next: EvidenceCase) {
    setExample(next);
    setField(next === "mismatch" ? "manufacturer" : "batch");
  }

  function rows(side: "claim" | "record") {
    const values = side === "claim" ? claim : record;
    if (!values) return null;
    return <div className={s.documentRows}>
      {fields.map(({ key, label }) => {
        const selected = field === key;
        const conflict = comparison.disagreements.includes(key);
        return <button
          key={key} type="button" disabled={!hydrated}
          aria-label={`Inspect ${side === "claim" ? "claim" : "source"} ${label.toLowerCase()}: ${values[key]}`}
          aria-pressed={selected}
          onClick={() => setField(key)}
          className={`${s.documentField} ${selected ? s.fieldSelected : ""} ${selected && conflict ? s.fieldConflict : ""}`}
          data-field={key} data-selected={selected} data-testid={`${side}-${key}`}
        >
          {selected && <motion.span layoutId={`${id}-${side}-highlight`} className={s.fieldHighlight} data-testid={`${side}-highlight`} transition={{ duration, ease: [.22, 1, .36, 1] }} aria-hidden="true" />}
          <span className={s.fieldName}>{label}</span>
          <strong>{values[key]}</strong>
          <span className={s.fieldIndicator} aria-hidden="true">{conflict ? "!" : selected ? record ? "↔" : "?" : "↗"}</span>
        </button>;
      })}
    </div>;
  }

  return <div className={s.evidenceDesk} data-testid="evidence-demo" data-case={example} data-result={comparison.status} data-reduced={reduced}>
    <div className={s.deskToolbar}>
      <span className={s.fileLabel}>EXAMPLE FILE / 001</span>
      <span className={s.demoLabel}>Fictional records · local illustration</span>
    </div>
    <fieldset className={s.caseSwitcher}>
      <legend>Choose a record</legend>
      {(Object.keys(caseLabels) as EvidenceCase[]).map(key => <label key={key} className={example === key ? s.caseSelected : ""}>
        <input type="radio" name={`${id}-evidence`} checked={example === key} onChange={() => chooseCase(key)} />
        {caseLabels[key]}
      </label>)}
    </fieldset>
    <LayoutGroup id={id}>
      <div className={s.documents}>
        <article className={`${s.document} ${s.claimDocument}`} aria-label="Fictional storefront claim">
          <div className={s.documentTop}><span>01 / THE CLAIM</span><span>Vendor source</span></div>
          <div className={s.documentIntro}><div className={s.documentHeading}><span className={s.miniMonogram} aria-hidden="true">A</span><div><h3>Example Research A</h3><p>Illustrative listing, not a real vendor</p></div></div>
          <p className={s.claimStatement}>“Third-party tested.”</p>
          <span className={s.claimCaption}>What the storefront says</span></div>
          {rows("claim")}
          <div className={s.documentFoot}><span className={s.sourceDot} aria-hidden="true" /><span>A claim is not its own corroboration.</span></div>
        </article>
        <span className={s.connectionMark} aria-hidden="true">↔</span>
        <article className={`${s.document} ${s.sourceDocument} ${record ? "" : s.emptyDocument}`} aria-label="Fictional independent source record">
          <div className={s.documentTop}><span>02 / THE SOURCE</span><span>Independent record</span></div>
          {record ? <>
            <div className={s.documentIntro}><div className={s.labHeading}><span className={s.labIcon} aria-hidden="true">⌑</span><div><h3>Example Lab</h3><p>Fictional laboratory record</p></div><span className={s.recordSeal}>SOURCE<br />COPY</span></div>
            <div className={s.certificateHeading}><strong>Certificate of analysis</strong><span>Record EX-0041 · illustrative fields only</span></div></div>
            {rows("record")}
            <div className={s.documentFoot}><span className={s.sourceDot} aria-hidden="true" /><span>Compare the fields, not the appearance.</span></div>
          </> : <div className={s.noRecord}>
            <div className={s.emptyLines} aria-hidden="true"><span /><span /><span /></div>
            <h3>No matching record<br />in this example file.</h3>
            <p>That describes the evidence available here. It does not prove that a record doesn&apos;t exist elsewhere.</p>
            <span className={s.unknownTag}>Unresolved, not an accusation</span>
          </div>}
        </article>
      </div>
    </LayoutGroup>
    <div className={s.inspectionStrip}>
      <span className={s.inspectionLabel}>Inspect a field</span>
      <div role="group" aria-label="Choose a field to compare" className={s.fieldPicker}>
        {fields.map(({ key, label }) => <button type="button" key={key} aria-pressed={field === key} onClick={() => setField(key)}>{label}</button>)}
      </div>
      <div className={s.selectedComparison} data-testid="selected-comparison" aria-live="polite" aria-atomic="true">
        <dl><div><dt>Claim: {fields.find(item => item.key === field)?.label}</dt><dd>{claim[field]}</dd></div><div><dt>Source: {fields.find(item => item.key === field)?.label}</dt><dd>{record ? record[field] : "Not on file"}</dd></div></dl>
        <span className={s.selectedStatus}>{!record ? "No source to compare" : comparison.disagreements.includes(field) ? "This field disagrees" : "This field matches"}</span>
      </div>
      <p data-testid="field-explanation">{fieldNotes[field]}</p>
    </div>
    <div className={`${s.finding} ${comparison.status === "mismatch" ? s.findingConflict : comparison.status === "missing" ? s.findingMissing : ""}`} aria-live="polite" aria-atomic="true" data-testid="evidence-finding">
      <span className={s.findingSymbol} aria-hidden="true">{comparison.status === "match" ? "=" : comparison.status === "mismatch" ? "≠" : "?"}</span>
      <div><h3>{conclusion.title}</h3><p>{conclusion.text}</p><small>{conclusion.limit}</small></div>
    </div>
    <details className={s.readAll} open={reduced || undefined}>
      <summary>Read all three outcomes without switching records</summary>
      <div>{(Object.keys(evidenceConclusions) as EvidenceCase[]).map(key => <section key={key}><h4>{caseLabels[key]}</h4><p>{evidenceConclusions[key].text} {evidenceConclusions[key].limit}</p></section>)}</div>
    </details>
  </div>;
}

export function GradeExplorer() {
  const [example, setExample] = useState<GradeCase>("unknown");
  const id = useId();
  const reduced = useMotionPreference();
  const prepared = gradeExamples[example];
  const result = exampleGrade(example);
  return <div className={s.gradeExplorer} data-testid="grade-demo" data-case={example} data-letter={result.letter ?? "none"}>
    <fieldset className={s.gradeSwitcher}>
      <legend>Prepared evidence examples</legend>
      {(Object.keys(gradeCaseLabels) as GradeCase[]).map(key => <label key={key} className={example === key ? s.gradeSelected : ""}><input type="radio" name={`${id}-grade`} checked={example === key} onChange={() => setExample(key)} />{gradeCaseLabels[key]}</label>)}
    </fieldset>
    <div className={s.gradeBody}>
      <div className={s.gradeVerdict}>
        <span className={s.smallLabel}>THE RESULT / EXAMPLE INPUTS</span>
        <div className={`${s.letter} ${!result.letter ? s.noLetter : ""}`} data-testid="grade-letter" aria-live="polite">{result.letter ?? <>No<br />grade.</>}</div>
        <span className={s.gradeMeaning}>{example === "unknown" ? "Insufficient evidence" : example === "supported" ? "Supported example record" : "A documented concern remains"}</span>
        <p>A vendor evidence grade.<br />Not a product safety rating.</p>
      </div>
      <div className={s.dimensionList} aria-label="Evidence behind the example grade">
        {result.dimensions.map(dimension => <details key={dimension.key} className={s.dimension} data-state={dimension.state}>
          <summary><span>{dimension.label}</span><span className={s.dimensionState}><i aria-hidden="true" />{dimensionLabels[dimension.state]}<b aria-hidden="true">+</b></span></summary>
          <div>{dimension.factors.length ? dimension.factors.map((factor, i) => <p key={i}><strong>{factor.label}</strong>{factor.detail}<small>Source tier: {factor.confidence ?? "not established"}</small></p>) : <p>No evidence is supplied for this dimension. It is not treated as a negative finding.</p>}</div>
        </details>)}
        <div className={s.ruleNote} aria-live="polite" data-testid="grade-rule"><span>WHY THIS RESULT</span><p>{prepared.note}</p></div>
      </div>
    </div>
    <details className={s.methodNote} open={reduced || undefined}>
      <summary>What this example does and does not run</summary>
      <p>This runs a pinned copy of VialGrade&apos;s actual letter-grade projection with prepared, fictional inputs. It does not run collection or the upstream verdict engine, and it does not rate the document example above.</p>
      <p>Supplied verdict: <code>{prepared.verdict.verdict}</code>. Independent test count: <code>{prepared.input.coaCount}</code>. No live vendor record is queried or changed.</p>
      <a href="https://github.com/pegg-dot/vial/blob/5a08f288a136d2af232e224770e07408902878bd/src/server/verify/grade.ts" target="_blank" rel="noreferrer">Inspect the source rule <span aria-hidden="true">↗</span><span className={s.srOnly}> (opens in a new tab)</span></a>
      <div className={s.staticGrades}><h4>All prepared outcomes</h4><p>Missing evidence: no grade. Supported record: A-. Verified concern: C-. These are outcomes of the specific inputs described here, not universal rules for all vendors.</p></div>
    </details>
  </div>;
}
