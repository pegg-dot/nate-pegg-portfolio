'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import { claim, fields, type EvidenceCase } from './evidence-model';
import { findings, readingCases, readingComparison } from './reading-model';
import s from './vial.module.css';

function subscribeMotion(notify: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}
const preference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverPreference = () => false;

export function EvidenceComparison({ inArticle = false }: { inArticle?: boolean }) {
  const [example, setExample] = useState<EvidenceCase>('match');
  const reduced = useSyncExternalStore(subscribeMotion, preference, serverPreference);
  const id = useId();
  const { record, status, disagreements, finding } = readingComparison(example);

  return <div className={`${s.comparisonWrap} ${inArticle ? s.inArticle : ""}`} id="evidence">
    <div className={s.comparison} data-testid="evidence-demo" data-case={example} data-result={status} data-reduced={reduced}>
      <div className={s.comparisonHeader}><span className={s.fileIcon} aria-hidden="true">V</span><span>Checking a vendor&apos;s claim</span><span className={s.exampleLabel}>Fictional example</span></div>
      <div className={s.claimLine}><span>The claim</span><p>&ldquo;Third-party tested.&rdquo;</p></div>
      <div className={s.comparisonBody}>
        <table className={s.records}>
          <caption className={s.srOnly}>Compare the fictional vendor claim with the fictional lab record</caption>
          <thead><tr><th scope="col"><span className={s.srOnly}>Detail being checked</span></th><th scope="col">Vendor says</th><th scope="col">Lab record</th></tr></thead>
          <tbody>{fields.map(({ key, label }) => {
            const differs = disagreements.includes(key);
            return <tr key={key} data-field={key} data-disagrees={differs}>
              <th scope="row">{label === 'Batch' ? <>Batch<small>production run</small></> : label}</th>
              <td data-testid={`claim-${key}`}><span>{claim[key]}</span></td>
              <motion.td initial={false} animate={{ backgroundColor: differs ? '#f8e9e2' : record ? '#f1f3fa' : '#f3f1eb' }} transition={{ duration: reduced ? 0 : .25 }} data-testid={`record-${key}`}>
                <span>{record ? record[key] : 'Not on file'}</span>{differs && <small className={s.different}>Doesn&apos;t match</small>}
              </motion.td>
            </tr>;
          })}</tbody>
        </table>
        <div className={s.finding} data-testid="evidence-finding" data-kind={status} role="status" aria-atomic="true"><span className={s.findingMark} aria-hidden="true">{status === 'match' ? '=' : status === 'missing' ? '?' : '\u2260'}</span><div><strong>{finding.title}</strong><p>{finding.text}</p></div></div>
      </div>
      <fieldset className={s.caseOptions} data-interactive="true"><legend className={s.srOnly}>Compare another fictional record</legend>
        {readingCases.map(item => <label key={item.key} data-active={item.key === example}><input type="radio" name={`${id}-case`} value={item.key} checked={example === item.key} onChange={() => setExample(item.key)} /><span>{item.label}</span></label>)}
      </fieldset>
      <p className={s.documentLimit}>Matching paperwork doesn&apos;t establish what&apos;s in a vial or whether it&apos;s safe for human use.</p>
    </div>
    <details className={s.otherOutcomes}><summary>Read the other outcomes</summary><div>{readingCases.filter(item => item.key !== 'match').map(item => <p key={item.key}><strong>{findings[item.key].title}</strong> {findings[item.key].text}</p>)}</div></details>
  </div>;
}
