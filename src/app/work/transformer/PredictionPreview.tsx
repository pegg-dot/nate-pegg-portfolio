'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import { capture, characterGlyph, readableCharacter } from './capture-model';
import { displayPercent, drawPreview, prefixChoices, previewPrediction } from './reader-model';
import s from './reader.module.css';

const subscribe = (notify: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const getPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverPreference = () => false;

export default function PredictionPreview({ inArticle = false }: { inArticle?: boolean }) {
  const [position, setPosition] = useState(1);
  const [draw, setDraw] = useState<number | null>(null);
  const reduced = useSyncExternalStore(subscribe, getPreference, serverPreference);
  const id = useId();
  const prediction = previewPrediction(position);
  const sample = draw === null ? null : drawPreview(position, draw);
  const highest = prediction.top[0];
  return <div className={`${s.previewWrap} ${inArticle ? s.inArticle : ""}`}>
    <div className={s.preview} data-testid="prediction-preview" data-position={position} data-reduced={reduced}>
      <div className={s.previewHeader}><span>Predicting the next character</span><span>My trained model</span></div>
      <div className={s.promptLine}><div><span>Text so far</span><code data-testid="preview-prefix">{prediction.prefix}</code></div><p>Each character is one token in this model.</p></div>
      <div className={s.distribution}>
        <div className={s.distributionHeading}><span>What might come next</span><span>Probability</span></div>
        {prediction.top.map(entry => <div className={s.probabilityRow} key={entry.index} data-character={readableCharacter(entry.character)}>
          <span className={s.character}><b>{characterGlyph(entry.character)}</b>{readableCharacter(entry.character) !== entry.character && <small>{readableCharacter(entry.character)}</small>}</span>
          <div className={s.probabilityTrack} aria-hidden="true"><motion.span initial={false} animate={{ width: `${entry.probability * 100}%` }} transition={{ duration: reduced ? 0 : .24 }} /></div>
          <span className={s.probabilityValue} data-preview-probability={entry.probability}>{displayPercent(entry.probability)}</span>
        </div>)}
        <div className={s.otherProbability}><span>All other {prediction.otherCount} characters</span><span data-preview-probability={prediction.remainder}>{displayPercent(prediction.remainder)}</span></div>
      </div>
      <p className={s.resultExplanation} data-testid="preview-explanation">{readableCharacter(highest.character) === 'newline' ? 'A new line is the most likely next character here.' : `${readableCharacter(highest.character)} is the most likely next character here.`} Another character can still be picked.</p>
      <div className={s.previewControls} data-interactive="true">
        <fieldset><legend>Earlier or later in the same text</legend>{prefixChoices.map(item => <label key={item.position} data-active={position === item.position}><input type="radio" name={`${id}-prefix`} checked={position === item.position} onChange={() => { setPosition(item.position); setDraw(null); }} aria-label={`Preview after ${item.text}`} /><span>{item.text}</span></label>)}</fieldset>
        <button type="button" onClick={() => setDraw(Math.random())}>Pick a character <span aria-hidden="true">&#8599;</span></button>
      </div>
      {sample !== null && <p className={s.drawResult} role="status" data-testid="preview-draw" data-index={sample}>This draw picked <strong>{readableCharacter(capture.vocab[sample])}</strong>. The probabilities stay the same; this isn&apos;t a new model run.</p>}
    </div>
    <p className={s.previewCaption}>From my model&apos;s saved outputs, not a new run.</p>
  </div>;
}
