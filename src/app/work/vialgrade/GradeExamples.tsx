import { exampleGrade, gradeExamples } from './evidence-model';
import { gradeSummaries } from './reading-model';
import s from './vial.module.css';

/** Precompute the existing pure projection; don't imply that a document match earns a grade. */
export default function GradeExamples() {
  return <div className={s.gradeExamples} data-testid="grade-demo">
    <div className={s.gradeIntro}>How that changes the grade</div>
    <div className={s.gradeRows}>
      {gradeSummaries.map(item => {
        const result = exampleGrade(item.key);
        return <div key={item.key} className={s.gradeRow} data-testid={`grade-${item.key}`} data-letter={result.letter ?? 'none'}>
          <span className={`${s.gradeLetter} ${!result.letter ? s.noGrade : ''}`}>{result.letter ?? <>No<br />grade</>}</span>
          <div><h3>{item.heading}</h3><p>{item.text}</p></div>
        </div>;
      })}
    </div>
    <p className={s.gradeScope}>Separate fictional examples, not ratings of the records above. These grades describe evidence, not product safety.</p>
    <details className={s.methodDetails}>
      <summary>What goes into these examples <span aria-hidden="true">+</span></summary>
      <p>These results use VialGrade&apos;s grading rules with prepared inputs. The assessment is supplied here; this page doesn&apos;t collect evidence or run the earlier checks that determine it.</p>
      <dl className={s.inputList}>{gradeSummaries.map(item => <div key={item.key}><dt>{item.heading}</dt><dd>Assessment: <code>{gradeExamples[item.key].verdict.verdict}</code>. Independent tests: {gradeExamples[item.key].input.coaCount}. Grade: {exampleGrade(item.key).letter ?? 'none'}.</dd></div>)}</dl>
      <p>The full system groups evidence into independent testing, regulatory and operator records, reputation, and business signals. Missing information is different from a substantiated negative finding.</p>
    </details>
  </div>;
}
