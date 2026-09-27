import Image from "next/image";
import CaseShell from "../../components/CaseShell";

export default function TransformerCase() {
  return (
    <CaseShell index="03 / TRANSFORMER" title="TRANSFORMER" subtitle="A GPT-style transformer I built and trained from scratch in PyTorch, then instrumented so the real tensors from its forward pass could drive an interactive visualizer." external={{ label: "LIVE VISUALIZER", href: "https://transformer-viz-eight.vercel.app" }} actions={[{ label: "OPEN VISUALIZER", href: "https://transformer-viz-eight.vercel.app", external: true }, { label: "VIEW CODE", href: "https://github.com/pegg-dot/Transformer", external: true }]}>
      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHY</span><h2>I WANTED TO TRACE A TOKEN ALL THE WAY THROUGH.</h2></div>
          <div className="caseStack"><p>I had learned the parts separately: embeddings, attention, Q/K/V, residuals, logits, loss and training.</p><p>Implementing the stack made them stop feeling like a list of concepts and start feeling like one mechanism.</p><p>Only after the model worked did I build the visualizer.</p></div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="modelMetricWall"><div><strong>10.79M</strong><span>parameters</span></div><div><strong>6</strong><span>blocks</span></div><div><strong>6</strong><span>attention heads</span></div><div><strong>384</strong><span>residual dim</span></div><div><strong>256</strong><span>context</span></div><div><strong>5,000</strong><span>training iterations</span></div></div>
      </section>

      <section className="caseBand">
        <div className="caseImageWide"><Image src="/transformer/qkv.webp" alt="Interactive transformer visualizer showing Q K V projections" fill sizes="100vw" /></div>
        <div className="caseGrid two compactTop"><div><span className="caseLabel">THE RULE I KEPT</span><h2>MODEL FIRST.<br/>DIAGRAM SECOND.</h2></div><div className="caseStack"><p>The visual scenes are anchored to tensors captured from my own forward pass.</p><p>That meant the explanation had to bend around what the model actually did, instead of the code being written to match a pretty diagram.</p><p>The hard part became translating something numerical into something another person could follow without making it fake.</p></div></div>
      </section>

      <section className="caseBand transformerTrainingBand">
        <div className="caseImageWide smaller"><Image src="/transformer/training.webp" alt="Training visualizer showing gradient descent" fill sizes="80vw" /></div>
        <div className="buildFacts"><span>PyTorch</span><span>ONNX</span><span>Next.js</span><span>Three.js</span><span>D3</span><span>ONNX Runtime Web</span><span>activation checks</span><span>browser inference</span></div>
      </section>
    </CaseShell>
  );
}
