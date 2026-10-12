import type { Metadata } from 'next';
import { ProjectNav, ProjectFooter } from '../_authored/ProjectChrome';
import ArtifactViewer from '../_authored/ArtifactViewer';
import TransformerLab from './TransformerLab';
import PredictionPreview from './PredictionPreview';
import { capture } from './capture-model';
import { residualExample } from './reader-model';
import copy from './story-copy.json';
import s from '../_authored/authored.module.css';

export const metadata: Metadata = { title: 'Transformer | Nate Pegg', description: 'The transformer I trained on Tiny Shakespeare and the visualizer I made to understand it.' };
export default function TransformerCase() {
  return <main className={s.transformer} id="main-content" tabIndex={-1} data-transformer-edition="authored">
    <ProjectNav active="transformer" dark />
    <header className={s.transformerCover}>
      <div className={s.transformerMasthead}><div><h1>Transformer</h1><p>A small GPT-style model, trained on Tiny Shakespeare.</p></div><a className={s.textLink} href="https://transformer-viz-eight.vercel.app" target="_blank" rel="noreferrer">Full visualizer <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></div>
      <ArtifactViewer testId="transformer-artifact" dark images={[
        { label: 'Attention', src: '/transformer/attention-capture-e3466fef42.webp', alt: 'My full visualizer showing the query, key and value calculations used in attention', width: 3200, height: 1752, caption: 'The visualizer I built around the model. This scene follows the query, key and value calculations.' },
        { label: 'Training', src: '/transformer/training-capture-71862ab2bc.webp', alt: "My visualizer's teaching illustration of gradient descent during training", width: 3200, height: 1752, caption: 'A gradient-descent illustration, not a measured loss surface.' },
      ]} />
    </header>
    <article className={s.transformerOpening} id="origin"><aside className={s.meta}><span>PyTorch</span><span>2026</span></aside><div className={s.reading}><p className={s.lead}>{copy.intro}</p><p>{copy.orientation}</p>{copy.origin.map(p => <p key={p}>{p}</p>)}<h2 id="residual">A residual connection</h2><p>{copy.residual}</p></div></article>
    <div className={s.residualStudy} data-testid="residual-example"><figure className={s.codeFigure}><figcaption><span>model/gpt.py &middot; lines 87&#8211;89</span><a href="https://github.com/pegg-dot/Transformer/blob/f6ba652589871a0b95f71a41b9910269ec7cf8db/model/gpt.py#L87-L89" target="_blank" rel="noreferrer">Source <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></figcaption><pre tabIndex={0} aria-label="Residual update source code"><code><span className={s.sourceLine}>{'    x = '}<mark>{'x +'}</mark>{' self.attn(self.ln1(x))'}</span><span className={s.sourceLine}>{'    x = '}<mark>{'x +'}</mark>{' self.ffn(self.ln2(x))'}</span><span className={s.sourceLine}>{'    return x'}</span></code></pre></figure><div className={s.marginNote}><p className={s.residualSum}><span data-residual-original={residualExample.original}>{residualExample.original.toFixed(4)}</span><span>+</span><span data-residual-update={residualExample.update}>{residualExample.update.toFixed(4)}</span><span>=</span><span data-residual-result={residualExample.result}>{residualExample.result.toFixed(4)}</span></p><p className={s.caption}>One actual coordinate: original value + attention update. At the colon in <code>ROMEO:</code>, in block 1. Rounded to four decimals; one of 384 coordinates.</p></div></div>
    <article className={s.transformerOpening}><div className={s.reading}>{copy.visualizer.map(p => <p key={p}>{p}</p>)}<p>{copy.training}</p><h2>A prediction from the model</h2><p>After <code>RO</code>, the model puts about 51% on <code>M</code> as the next character. It still gives some probability to other characters. These are values from the model I trained.</p></div></article>
    <div className={s.predictionStudy}><PredictionPreview inArticle /></div>
    <div className={s.explorer} id="inside"><details className={s.details} data-testid="model-explorer-disclosure"><summary>Open the detailed model explorer</summary><p className={s.caption}>The saved capture, including embeddings, attention, both residual updates and the output distribution.</p><TransformerLab /></details><details className={`${s.details} ${s.modelDetails}`}><summary>Model details and sources</summary><p>A 10.79M-parameter character-level GPT-style model, trained on Tiny Shakespeare for 5,000 iterations. The saved model has {capture.model.n_layer} blocks, {capture.model.n_head} heads per block, {capture.model.n_embd} vector dimensions and a {capture.model.block_size}-character context window.</p><p>The visualizer uses Next.js, Three.js and D3, with ONNX export and browser inference in the separate full application. The portfolio examples use saved outputs and do not load a model.</p><a href="https://github.com/pegg-dot/Transformer" target="_blank" rel="noreferrer">Model and visualizer source <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></details></div>
    <div className={`${s.transformerClosing} ${s.reading}`}>{copy.takeaway.map(p => <p key={p}>{p}</p>)}</div>
    <ProjectFooter next="della" name="Della" />
    <noscript><style>{`[data-interactive="true"], [data-testid="model-explorer-disclosure"]{display:none!important}`}</style></noscript>
  </main>;
}
