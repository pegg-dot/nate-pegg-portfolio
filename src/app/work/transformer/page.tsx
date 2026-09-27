import Image from "next/image";
import CaseShell from "../../components/CaseShell";

export default function TransformerCase() {
  return (
    <CaseShell index="03 / TRANSFORMER" title="TRANSFORMER" subtitle="A GPT-style transformer built from scratch in PyTorch, then instrumented and turned into an interactive browser visualizer." external={{ label: "LIVE VISUALIZER", href: "https://transformer-viz-eight.vercel.app" }}>
      <section className="caseBand caseBandDark">
        <div className="modelMetricWall"><div><strong>10.79M</strong><span>parameters</span></div><div><strong>6</strong><span>blocks</span></div><div><strong>6</strong><span>attention heads</span></div><div><strong>384</strong><span>residual dim</span></div><div><strong>256</strong><span>context</span></div><div><strong>5,000</strong><span>training iterations</span></div></div>
      </section>

      <section className="caseBand">
        <div className="caseImageWide"><Image src="/transformer/qkv.webp" alt="Interactive transformer visualizer showing Q K V projections" fill sizes="100vw" /></div>
        <div className="caseGrid two compactTop"><div><span className="caseLabel">THE RULE</span><h2>MODEL FIRST.<br/>DIAGRAM SECOND.</h2></div><div className="caseStack"><p>Token + positional embeddings.</p><p>Causal self-attention and Q/K/V projections.</p><p>Multi-head attention, MLPs, residuals and layer norm.</p><p>Hooks capture tensors from a real forward pass.</p></div></div>
      </section>

      <section className="caseBand transformerTrainingBand">
        <div className="caseImageWide smaller"><Image src="/transformer/training.webp" alt="Training visualizer showing gradient descent" fill sizes="80vw" /></div>
        <div className="buildFacts"><span>PyTorch</span><span>ONNX</span><span>Next.js</span><span>Three.js</span><span>D3</span><span>ONNX Runtime Web</span><span>activation checks</span><span>browser inference</span></div>
      </section>
    </CaseShell>
  );
}
