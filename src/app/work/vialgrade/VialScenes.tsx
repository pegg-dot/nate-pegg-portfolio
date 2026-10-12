'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import { claim, fields, type EvidenceCase } from './evidence-model';
import { findings, readingCases, readingComparison } from './reading-model';
import { ProductIcon } from './ProductIcon';
import s from './product.module.css';

function subscribeMotion(notify: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}
const preference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverPreference = () => false;

export function EvidenceComparison() {
  const [example, setExample] = useState<EvidenceCase>('match');
  const reduced = useSyncExternalStore(subscribeMotion, preference, serverPreference);
  const id = useId();
  const { record, status, disagreements, finding } = readingComparison(example);
  return <div className={s.comparisonWrap} id="evidence">
    <div data-testid="evidence-demo" data-case={example} data-result={status} data-reduced={reduced}>
      <div className={s.exampleBar}><p>A fictional example of the check</p><fieldset className={s.caseOptions} data-interactive="true"><legend className={s.srOnly}>Compare another fictional record</legend>{readingCases.map(item => <label key={item.key} data-active={item.key === example}><input type="radio" name={`${id}-case`} value={item.key} checked={example === item.key} onChange={() => setExample(item.key)} /><span>{item.label}</span></label>)}</fieldset></div>
      <div className={s.documentPair} role="group" aria-label="Compare the vendor claim and lab record">
        <article className={s.claimCard} aria-labelledby={`${id}-claim`}>
          <p className={s.cardLabel}>What the vendor says</p><h3 id={`${id}-claim`}>&ldquo;Third-party tested.&rdquo;</h3>
          <dl className={s.documentFields}>{fields.map(({ key, label }) => <div key={key} data-field={key}><dt>{label}{key === 'batch' && <small>production run</small>}</dt><dd data-testid={`claim-${key}`}>{claim[key]}</dd></div>)}</dl>
          <p className={s.cardFooter}><ProductIcon name="document" size={16} />The claim is the starting point.</p>
        </article>
        <article className={s.recordCard} aria-labelledby={`${id}-record`}>
          <p className={s.cardLabel}>What the record says</p><h3 id={`${id}-record`}>{record ? 'Check the lab record.' : 'No record on file.'}</h3>
          <dl className={s.documentFields}>{fields.map(({ key, label }) => {
            const differs = disagreements.includes(key);
            return <div key={key} data-field={key} data-disagrees={differs}><dt>{label}{key === 'batch' && <small>production run</small>}</dt><motion.dd initial={false} animate={{ backgroundColor: differs ? '#ffecea' : record ? '#eef0ff' : '#f0f0ec' }} transition={{ duration: reduced ? 0 : .25 }} data-testid={`record-${key}`}><span>{record ? record[key] : 'Not on file'}</span>{differs && <small className={s.different}>Doesn&apos;t match</small>}</motion.dd></div>;
          })}</dl>
          <p className={s.cardFooter}><ProductIcon name={record ? 'search' : 'question'} size={16} />{record ? 'A batch code alone is not enough.' : 'Missing is not the same as false.'}</p>
        </article>
      </div>
      <div className={s.finding} data-testid="evidence-finding" data-kind={status} role="status" aria-atomic="true"><span className={s.findingMark}><ProductIcon name={status === 'match' ? 'check' : status === 'missing' ? 'question' : 'close'} size={19} /></span><div><strong>{finding.title}</strong><p>{finding.text}</p></div></div>
      <p className={s.documentLimit}>This compares the paperwork; it doesn&apos;t establish what&apos;s in a vial or whether it&apos;s safe for human use.</p>
    </div>
    <details className={s.otherOutcomes}><summary>Read the other outcomes</summary>{readingCases.filter(item => item.key !== 'match').map(item => <p key={item.key}><strong>{findings[item.key].title}</strong> {findings[item.key].text}</p>)}</details>
  </div>;
}
