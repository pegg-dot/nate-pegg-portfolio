import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import TransformerLab from './TransformerLab';
import PredictionPreview from './PredictionPreview';
import { capture } from './capture-model';
import { residualExample } from './reader-model';
import copy from './story-copy.json';
import s from './reader.module.css';

export const metadata: Metadata = {
  title: 'Transformer | Nate Pegg',
  description: 'The small transformer I built to understand language models, and the visualizer I built to see the computation.',
};

export default function TransformerCase() {
  return <main className={s.page} id="main-content" tabIndex={-1} data-transformer-edition="reader-first">
    <nav className={s.nav} aria-label="Project navigation"><Link href="/">&#8592; Nate Pegg</Link><span>03 / Transformer</span><a href="https://transformer-viz-eight.vercel.app" target="_blank" rel="noreferrer">Full visualizer <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></nav>
    <header className={s.hero}>
      <div className={s.heroCopy}><p className={s.kicker}>A small language model, built to understand it</p><h1>Transformer</h1><p className={s.lede}>{copy.intro}</p><p className={s.orientation}>{copy.orientation}</p><a className={s.storyLink} href="#origin">Why I built it <span aria-hidden="true">&#8594;</span></a><span className={s.year}>PyTorch &middot; Tiny Shakespeare &middot; 2026</span></div>
      <PredictionPreview />
    </header>

    <section className={`${s.section} ${s.origin}`} id="origin" aria-labelledby="origin-title"><h2 id="origin-title">Why I wanted<br /> to build it.</h2><div className={s.prose}>{copy.origin.map(p => <p key={p}>{p}</p>)}</div></section>

    <section className={`${s.section} ${s.pathSection}`} aria-labelledby="path-title">
      <div><h2 id="path-title">What happens<br /> to the text.</h2><p className={s.pathIntro}>The model turns characters into numbers, updates them using context, and calculates probabilities for the next character.</p></div>
      <ol className={s.modelPath}>
        <li><strong>Characters become numbers</strong><p>Each character becomes a list of numbers, called an embedding. A second list is added for its position.</p></li>
        <li><strong>The context changes those numbers</strong><p>Attention combines information from the current and earlier positions. The feed-forward part then processes each position. This repeats across six blocks.</p></li>
        <li><strong>The model predicts what comes next</strong><p>After the six blocks, the model gives a score to each of 65 possible characters. Those scores become the probabilities above.</p></li>
      </ol>
    </section>

    <section className={`${s.section} ${s.residualSection}`} id="residual" aria-labelledby="residual-title">
      <div><h2 id="residual-title">One part I couldn&apos;t<br /> quite picture.</h2><div className={s.prose}><p>{copy.residual}</p></div></div>
      <figure className={s.residualExample} data-testid="residual-example"><figcaption>A residual connection, with actual values</figcaption>
        <div className={s.residualNumbers}><div><span>Original value</span><strong data-residual-original={residualExample.original}>{residualExample.original.toFixed(4)}</strong></div><b aria-hidden="true">+</b><div><span>Attention update</span><strong data-residual-update={residualExample.update}>{residualExample.update.toFixed(4)}</strong></div><b aria-hidden="true">=</b><div className={s.updatedValue}><span>Updated value</span><strong data-residual-result={residualExample.result}>{residualExample.result.toFixed(4)}</strong></div></div>
        <p className={s.residualPlain}>The update is added to the original, not swapped in for it.</p><p className={s.numberCaption}>One of 384 coordinates at the colon in <code>ROMEO:</code>, in the first block. Values rounded to four decimals.</p>
      </figure>
    </section>

    <section className={`${s.section} ${s.visualizerSection}`} aria-labelledby="visualizer-title">
      <div className={s.visualizerIntro}><h2 id="visualizer-title">Then I built<br /> the visualizer.</h2><div className={s.prose}>{copy.visualizer.map(p => <p key={p}>{p}</p>)}</div></div>
      <div className={s.screenPair}>
        <figure><a href="https://transformer-viz-eight.vercel.app" target="_blank" rel="noreferrer"><Image src="/transformer/qkv.webp" alt="My full visualizer showing the query, key and value calculations used in attention" width={900} height={493} sizes="(max-width: 700px) 100vw, 570px" /><span className={s.screenLink}>Open the full visualizer <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></span></a><figcaption>Showing how attention is calculated.</figcaption></figure>
        <figure><a href="/transformer/training.webp" target="_blank" rel="noreferrer"><Image src="/transformer/training.webp" alt="My visualizer's teaching illustration of gradient descent during training" width={900} height={493} sizes="(max-width: 700px) 100vw, 570px" /><span className={s.screenLink}>View the training screen <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></span></a><figcaption>A gradient-descent illustration, not a measured loss surface.</figcaption></figure>
      </div>
      <p className={s.trainingNote}>{copy.training}</p>
    </section>

    <section className={`${s.section} ${s.explorerSection}`} id="inside" aria-labelledby="explorer-title">
      <div className={s.explorerHeading}><h2 id="explorer-title">A closer look at the numbers.</h2><p>The detailed explorer follows a character through embeddings, attention and the final prediction. It uses the same saved model capture.</p></div>
      <details className={s.explorerDisclosure} data-testid="model-explorer-disclosure"><summary><span>Open the detailed model explorer</span><span aria-hidden="true">+</span></summary><TransformerLab /></details>
      <details className={s.modelNotes}><summary>Model details and sources <span aria-hidden="true">+</span></summary><p>A 10.79M-parameter character-level GPT-style model, trained on Tiny Shakespeare for 5,000 iterations. The saved model has {capture.model.n_layer} blocks, {capture.model.n_head} heads per block, {capture.model.n_embd} vector dimensions and a {capture.model.block_size}-character context window.</p><p>I learned from Andrej Karpathy and 3Blue1Brown, then built the model in PyTorch and the browser visualizer around its captured values. The visualizer also uses ONNX, Three.js and D3.</p><a href="https://github.com/pegg-dot/Transformer" target="_blank" rel="noreferrer">Model and visualizer source <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></details>
    </section>

    <section className={`${s.section} ${s.takeawaySection}`} aria-labelledby="takeaway-title"><h2 id="takeaway-title">What started<br /> making sense.</h2><div className={s.prose}>{copy.takeaway.map(p => <p key={p}>{p}</p>)}</div></section>
    <noscript><style>{`[data-interactive="true"], [data-testid="model-explorer-disclosure"]{display:none!important}`}</style><p className={s.noScript}>The story and saved prediction above work without JavaScript. The full visualizer is linked above for interactive exploration.</p></noscript>
    <footer className={s.footer}><Link href="/">&#8592; Back to my work</Link><a href="https://github.com/pegg-dot/Transformer" target="_blank" rel="noreferrer">View the code <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></footer>
  </main>;
}
