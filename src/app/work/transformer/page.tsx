import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function TransformerCase() {
  return (
    <CaseShell
      index="03 / TRANSFORMER"
      title="TRANSFORMER"
      subtitle="I built and trained a small GPT-style transformer from scratch because I did not want attention, loss, backprop, and sampling to stay as words I could repeat without really seeing how they fit together."
      external={{ label: "LIVE VISUALIZER", href: "https://transformer-viz-eight.vercel.app" }}
      actions={[
        { label: "OPEN VISUALIZER", href: "https://transformer-viz-eight.vercel.app", external: true },
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/Transformer", external: true },
      ]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A 10.79M-parameter character-level transformer trained on Tiny Shakespeare, plus a browser visualizer that walks through the tensors from tokenization to attention, residuals, logits, training, and decoding." },
        { label: "WHY", text: "I was learning AI and kept running into the same problem: I could explain the pieces but I still felt like I was treating the model as a black box. Building one forced me to find the parts I did not actually understand." },
        { label: "HOW", text: "I wrote the model directly in PyTorch without Hugging Face transformers or torch.nn.Transformer, trained it, added hooks to capture real intermediate activations, and used those values to drive the visualizer." },
        { label: "WHEN", text: "Built earlier in 2026 while I was working through the fundamentals of training and transformer internals. The visualizer came after the model, not before it." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHY I BUILT IT</span><h2>I WANTED TO TRACE ONE TOKEN ALL THE WAY THROUGH.</h2></div>
          <div className="caseStack">
            <p>I had learned embeddings, Q/K/V, causal masking, residuals, cross-entropy, gradients, and optimizers separately.</p>
            <p>Writing the model made those things collide. A shape mismatch or a bad mask is a much better test of whether you understand attention than saying what attention does.</p>
            <p>Once the model worked, I wanted to be able to open it up and show somebody else what I had finally started to understand.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="modelMetricWall"><div><strong>10.79M</strong><span>parameters</span></div><div><strong>6</strong><span>blocks</span></div><div><strong>6</strong><span>attention heads</span></div><div><strong>384</strong><span>residual dim</span></div><div><strong>256</strong><span>context</span></div><div><strong>5,000</strong><span>training iterations</span></div></div>
      </section>

      <section className="caseBand">
        <div className="caseImageWide"><Image src="/transformer/qkv.webp" alt="Interactive transformer visualizer showing Q K V projections" fill sizes="100vw" /></div>
        <div className="caseGrid two compactTop">
          <div><span className="caseLabel">THE PART I DID NOT EXPECT</span><h2>EXPLAINING IT WAS ITS OWN ENGINEERING PROBLEM.</h2></div>
          <div className="caseStack">
            <p>The first visual ideas were easy to fake. You can draw boxes for Q, K, and V and make something that looks educational without it being connected to the model at all.</p>
            <p>I ended up instrumenting the actual forward pass so the scenes could use real tensors instead of numbers invented for the animation.</p>
            <p>The animations were probably the most annoying part. They had to stay understandable without turning the mechanics into something prettier but wrong.</p>
          </div>
        </div>
      </section>

      <section className="caseBand transformerTrainingBand">
        <div className="caseImageWide smaller"><Image src="/transformer/training.webp" alt="Training visualizer showing gradient descent" fill sizes="80vw" /></div>
        <div className="buildFacts"><span>PyTorch</span><span>ONNX</span><span>Next.js</span><span>Three.js</span><span>D3</span><span>ONNX Runtime Web</span><span>activation checks</span><span>browser inference</span></div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT I TOOK FROM IT</span><h2>THE BLACK BOX GOT SMALLER.</h2></div>
          <div className="caseStack">
            <p>I still do not think building one small transformer means I understand every modern model. It did change how I learn AI, though.</p>
            <p>Now when I hear about a system I want to know what state it has, what gets computed, where the loss comes from, what is deterministic, and what is just a story we tell on top of the mechanism.</p>
            <p>That way of thinking has carried directly into Della and the other agent systems I have built since.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
