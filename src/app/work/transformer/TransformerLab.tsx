"use client";

import { useId, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { capture, stages, stageDescriptions, readableCharacter, characterGlyph, rankedPrediction, residualValues, sampleIndex, type Stage, type Branch } from './capture-model';
import s from './transformer.module.css';

const subscribe = (notify: () => void) => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); media.addEventListener('change', notify); return () => media.removeEventListener('change', notify); };
const readPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverPreference = () => false;
const number = (value: number) => value.toFixed(4);
const pct = (value: number) => value > 0 && value < .0001 ? '<0.01%' : `${(value * 100).toFixed(2)}%`;

export default function TransformerLab() {
  const id = useId();
  const reduced = useSyncExternalStore(subscribe, readPreference, serverPreference);
  const [stage, setStage] = useState<Stage>('Characters');
  const [position, setPosition] = useState(5);
  const [block, setBlock] = useState(0);
  const [head, setHead] = useState(0);
  const [branch, setBranch] = useState<Branch>('attention');
  const [temperature, setTemperature] = useState(1);
  const [sample, setSample] = useState<number | null>(null);
  const weights = capture.blocks[block].weights[head];
  const prediction = rankedPrediction(position, temperature);
  const vectors = residualValues(position, block, branch);
  const prefix = capture.characters.slice(0, position + 1).join('');
  const stageIndex = stages.indexOf(stage);
  const { title, text } = stageDescriptions[stage];
  function choosePosition(next: number) { setPosition(next); setSample(null); }
  function reset() { setStage('Characters'); setPosition(5); setBlock(0); setHead(0); setBranch('attention'); setTemperature(1); setSample(null); }

  function vectorTable(input: number[], update: number[], output: number[], labels: [string, string, string]) {
    return <div className={s.tableScroll} role="region" aria-label="Eight captured vector coordinates" tabIndex={0}><table className={s.vectorTable}><caption>Coordinates 1\u20138 of 384. Display rounded to four decimals.</caption><thead><tr><th scope="col">Coordinate</th>{input.map((_, i) => <th scope="col" key={i}>{i + 1}</th>)}</tr></thead><tbody>{[input, update, output].map((row, r) => <tr key={r} className={r === 2 ? s.sumRow : ''}><th scope="row">{labels[r]}</th>{row.map((value, i) => <td key={i} data-value={value} title={String(value)}><span className={value < 0 ? s.negative : s.positive}>{number(value)}</span></td>)}</tr>)}</tbody></table></div>;
  }

  return <div className={s.lab} data-testid="transformer-lab" data-stage={stage} data-position={position} data-reduced={reduced}>
    <div className={s.labHeader}><span className={s.labName}><span aria-hidden="true">[ ]</span> Inside one forward pass</span><span className={s.dataTag}>Captured model values</span></div>
    <div className={s.labIntro}><p>Start with <code>ROMEO:</code>. Pick a character, then follow its values.</p><span>A saved capture, not a live model run.</span></div>
    <fieldset className={s.tokens}><legend>Choose a character position</legend>{capture.characters.map((character, i) => <label key={i} className={position === i ? s.tokenSelected : ''}><input type="radio" name={`${id}-character`} checked={position === i} onChange={() => choosePosition(i)} aria-label={`${character} at position ${i + 1}`} /><strong>{character}</strong><small>position {i + 1}</small></label>)}</fieldset>
    <LayoutGroup id={id}><div className={s.stageNav} role="group" aria-label="Follow the computation">{stages.map((name, i) => <button type="button" key={name} aria-pressed={stage === name} onClick={() => setStage(name)}>{stage === name && <motion.span layoutId={`${id}-stage`} className={s.stageMarker} transition={{ duration: reduced ? 0 : .25 }} aria-hidden="true" />}<span>{String(i + 1).padStart(2, '0')}</span><b>{name}</b></button>)}</div></LayoutGroup>
    <div className={s.stageContent}>
      <div className={s.stageHeading} aria-live="polite"><span>0{stageIndex + 1} / {stage}</span><h3>{title}</h3><p>{text}</p></div>
      {(stage === 'Attention' || stage === 'Residual') && <div className={s.modelControls}><label>Block <select aria-label="Transformer block" value={block} onChange={e => setBlock(Number(e.target.value))}>{capture.blocks.map((_, i) => <option key={i} value={i}>{i + 1} of 6</option>)}</select></label>{stage === 'Attention' && <label>Head <select aria-label="Attention head" value={head} onChange={e => setHead(Number(e.target.value))}>{weights.map((_, i) => <option key={i} value={i}>{i + 1} of 6</option>)}</select></label>}{stage === 'Residual' && <label>Update <select aria-label="Residual branch" value={branch} onChange={e => setBranch(e.target.value as Branch)}><option value="attention">Attention</option><option value="feedforward">Feed-forward</option></select></label>}</div>}
      {stage === 'Characters' && <div className={s.characterScene}>
        <div className={s.characterMapping}><span>Character</span><strong>{capture.characters[position]}</strong><span className={s.mappingArrow} aria-hidden="true">\u2192</span><span>Token ID</span><strong>{capture.tokens[position]}</strong></div>
        <div className={s.prefix}><span>Prefix available at this position</span><code>{prefix}<i aria-hidden="true">|</i></code><p>Position {position + 1} of 6. All positions are computed in this saved pass; this view follows one.</p></div>
      </div>}
      {stage === 'Embeddings' && <div data-testid="embedding-values"><div className={s.equation}><span>token vector</span><b>+</b><span>position vector</span><b>=</b><strong>residual stream</strong></div>{vectorTable(capture.tokenEmbedding[position], capture.positionEmbedding[position], capture.embeddingSum[position], ['Token', '+ Position', '= Sum'])}</div>}
      {stage === 'Attention' && <div className={s.attentionScene}>
        <div className={s.matrixWrap}><table className={s.matrix}><caption>Queries \u2193 / keys \u2192</caption><thead><tr><td /><th scope="col">R\u2081</th><th scope="col">O\u2082</th><th scope="col">M\u2083</th><th scope="col">E\u2084</th><th scope="col">O\u2085</th><th scope="col">:\u2086</th></tr></thead><tbody>{weights.map((row, r) => <tr key={r} className={r === position ? s.activeRow : ''}><th scope="row">{capture.characters[r]}<small>{r + 1}</small></th>{row.map((weight, c) => <td key={c} data-masked={c > r} data-weight={weight} title={`${capture.characters[r]} position ${r + 1} to ${capture.characters[c]} position ${c + 1}: ${c > r ? 'future position, masked to zero' : pct(weight)}`} style={{ '--weight': weight } as CSSProperties}>{c > r ? <span aria-label="Future position: masked to zero">\u00d7</span> : <span>{(weight * 100).toFixed(0)}</span>}</td>)}</tr>)}</tbody></table><p>Cells show percent of the row. \u00d7 = future position, masked.</p></div>
        <div className={s.attentionReadout}><h4>From <code>{capture.characters[position]}</code> at position {position + 1}</h4>{weights[position].map((weight, i) => <div className={s.weightRow} key={i}><span>{capture.characters[i]}<small>{i + 1}</small></span><div className={s.weightTrack}><span className={s.weightFill} style={{ width: `${weight * 100}%` }} /></div><code>{i > position ? 'masked' : pct(weight)}</code></div>)}<p>One head in block {block + 1}. These weights combine value vectors; they are not word importance scores.</p></div>
      </div>}
      {stage === 'Residual' && <div data-testid="residual-values"><svg viewBox="0 0 700 140" className={s.residualDiagram} role="img" aria-label="The original residual stream bypasses the normalized branch and is added to its output"><path d="M35 100H575M90 100V32H485V100H575M615 100H675" fill="none" stroke="currentColor" strokeWidth="2" /><rect x="170" y="10" width="230" height="44" rx="3" /><text x="285" y="37" textAnchor="middle">LayerNorm \u2192 {branch === 'attention' ? 'attention' : 'feed-forward'}</text><circle cx="594" cy="100" r="20" /><text x="594" y="106" textAnchor="middle">+</text><text x="47" y="127">x</text><text x="450" y="77">update</text><text x="634" y="127">x + update</text><text x="250" y="123">original stream</text></svg>{vectorTable(vectors.input, vectors.update, vectors.output, ['Original x', '+ Update', '= New x'])}<p className={s.numericNote}>Actual stored values. Tiny rounding differences reflect float32 arithmetic.</p></div>}
      {stage === 'Prediction' && <div className={s.predictionScene}>
        <div><div className={s.predictionTitle}><span>Next character after <code>{prefix}</code></span><label>Temperature <select aria-label="Sampling temperature" value={temperature} onChange={e => { setTemperature(Number(e.target.value)); setSample(null); }}><option value={.6}>0.6</option><option value={1}>1.0</option><option value={1.5}>1.5</option><option value={2}>2.0</option></select></label></div><div data-testid="probability-list">{prediction.top.map(entry => <div className={s.probabilityRow} key={entry.index}><span><b>{characterGlyph(entry.character)}</b><small>{readableCharacter(entry.character)}</small></span><div className={s.weightTrack}><span className={s.weightFill} style={{ width: `${entry.probability * 100}%` }} /></div><code data-probability={entry.probability}>{pct(entry.probability)}</code></div>)}<div className={s.otherProbability}><span>Other {capture.model.vocab_size - 5} characters</span><code data-probability={prediction.remainder}>{pct(prediction.remainder)}</code></div></div></div>
        <div className={s.samplePanel}><span>One draw, not a new forward pass</span><div className={s.sampleResult} aria-live="polite" data-testid="sample-result">{sample === null ? <span className={s.sampleUnknown}>?</span> : <><strong>{characterGlyph(capture.vocab[sample])}</strong><small>{readableCharacter(capture.vocab[sample])}</small></>}</div><button type="button" onClick={() => setSample(sampleIndex(prediction.distribution, Math.random()))}>Sample one character <span aria-hidden="true">\u2197</span></button><p>Temperature changes the distribution, not the model weights. The top five are not renormalized.</p></div>
      </div>}
    </div>
    <div className={s.labBottom}><button type="button" onClick={() => setStage(stages[stageIndex - 1])} disabled={stageIndex === 0}>\u2190 Previous</button><span>{stageIndex + 1} / {stages.length}</span>{stageIndex < stages.length - 1 ? <button type="button" onClick={() => setStage(stages[stageIndex + 1])}>Next: {stages[stageIndex + 1]} \u2192</button> : <button type="button" onClick={reset}>Start again \u21ba</button>}</div>
    <details className={s.captureNote} open={reduced || undefined}><summary>Where these numbers come from</summary><p>A pinned forward-pass capture from my trained model, not hand-authored animation data. This page includes the six prompt positions in ROMEO:, all six blocks and heads, and the first eight residual coordinates. The full capture also contains a generated continuation. The causal mask prevents those later positions from affecting this prefix.</p><p>Attention comes from the captured weights. Residual tables show stored activations. Next-character probabilities are recalculated from captured logits at the chosen temperature; no model weights load here.</p><a href={`https://github.com/pegg-dot/Transformer/blob/${capture.source.commit}/model/capture.py`} target="_blank" rel="noreferrer">Inspect the capture code \u2197<span className={s.srOnly}> (opens in a new tab)</span></a></details>
  </div>;
}
