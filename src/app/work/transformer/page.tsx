import Image from "next/image";
import CaseShell from "../../components/CaseShell";
import ProjectBrief from "../../components/ProjectBrief";

export default function TransformerCase() {
  return (
    <CaseShell
      className="caseCompact transformerCase"
      index="03 / TRANSFORMER"
      title="TRANSFORMER"
      subtitle="I built a small GPT-style transformer and an interactive visualizer because I could explain the basic steps, but I wanted to actually see how they fit together."
      external={{ label: "LIVE VISUALIZER", href: "https://transformer-viz-eight.vercel.app" }}
      actions={[
        { label: "OPEN VISUALIZER", href: "https://transformer-viz-eight.vercel.app", external: true },
        { label: "VIEW CODE", href: "https://github.com/pegg-dot/Transformer", external: true },
      ]}
    >
      <ProjectBrief items={[
        { label: "WHAT", text: "A 10.79M-parameter character-level GPT-style transformer trained on Tiny Shakespeare, plus a browser visualizer that walks through the model step by step." },
        { label: "WHY", text: "I could kind of explain tokenization, attention, MLPs, residual connections, and training, but visualizing and building them made them much easier to understand intuitively." },
        { label: "HOW", text: "I learned from Andrej Karpathy, 3Blue1Brown, and my own studying, then implemented the model in PyTorch, trained it, captured real activations, and built the visualizer around them." },
        { label: "WHEN", text: "Built in 2026 while I was teaching myself the foundations of transformers and model training." },
      ]} />

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHERE IT CAME FROM</span><h2>I COULD EXPLAIN IT. I WANTED TO SEE IT.</h2></div>
          <div className="caseStack">
            <p>During my daily studying I got to the point where I could kind of explain the transformer pipeline: tokenization, attention, the MLP, residual connections, and then the output.</p>
            <p>But being able to repeat the steps was different from really understanding them. Residual connections were one of the things I could not quite picture, and the training side was the same with backpropagation, gradient descent, and Adam.</p>
            <p>I watched a few of Andrej Karpathy&apos;s longer videos and 3Blue1Brown, which gave me a much better foundation. Then I wanted to actually build it, because learning while doing has always made things click more for me than just reading about them.</p>
          </div>
        </div>
      </section>

      <section className="caseBand caseBandDark">
        <div className="modelMetricWall">
          <div><strong>10.79M</strong><span>parameters</span></div>
          <div><strong>6</strong><span>blocks</span></div>
          <div><strong>6</strong><span>attention heads</span></div>
          <div><strong>384</strong><span>residual dim</span></div>
          <div><strong>256</strong><span>context</span></div>
          <div><strong>5,000</strong><span>training iterations</span></div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseGrid two">
          <div><span className="caseLabel">THE MODEL</span><h2>I STARTED WITH A MINI GPT.</h2></div>
          <div className="caseStack">
            <p>The model is basically a small version of the GPT architecture Karpathy teaches: character tokens go through embeddings, attention, the feed-forward part of the block, residual connections, and then eventually to logits for the next token.</p>
            <p>I trained it on Tiny Shakespeare. The point was never to make a good language model. It was small enough that I could follow the whole path from an input token to the next-token prediction without hiding the core architecture behind a library.</p>
            <p>That simplification helped a lot. Once I could see where the residual stream was being updated and how training changed the weights, concepts that had felt separate started fitting together.</p>
          </div>
        </div>
      </section>

      <section className="caseBand">
        <div className="caseImageWide"><Image src="/transformer/qkv.webp" alt="Interactive transformer visualizer showing Q K V projections" fill sizes="100vw" /></div>
        <div className="caseGrid two compactTop">
          <div><span className="caseLabel">THE VISUALIZER</span><h2>MAKING IT VISUAL WAS ANOTHER PROJECT.</h2></div>
          <div className="caseStack">
            <p>I had the basic ideas down, but then I had to figure out how to break the model into steps, make those steps flow into each other, and turn parts of it into 3D without making the explanation wrong.</p>
            <p>I wanted the visualizer to stay connected to the model I had actually trained, so the core scenes use real intermediate activations from the forward pass instead of numbers I made up for the animation.</p>
            <p>The weird part is that none of this literally looks like the animations. I still had to invent a visual language for the computation, so I spent a lot of time trying to make it understandable without turning the mechanism into something prettier but false.</p>
          </div>
        </div>
      </section>

      <section className="caseBand transformerTrainingBand">
        <div className="caseImageWide smaller"><Image src="/transformer/training.webp" alt="Training visualizer showing gradient descent" fill sizes="80vw" /></div>
        <div className="buildFacts"><span>PyTorch</span><span>ONNX</span><span>Next.js</span><span>Three.js</span><span>D3</span><span>ONNX Runtime Web</span><span>real activations</span><span>browser inference</span></div>
      </section>

      <section className="caseBand caseBandBlue">
        <div className="caseGrid two">
          <div><span className="caseLabel">WHAT CHANGED</span><h2>I CAN TRACE IT NOW. I STILL CAN&apos;T EXPLAIN EVERYTHING IT DOES.</h2></div>
          <div className="caseStack">
            <p>The biggest thing that clicked was the path from an input token all the way to an output distribution. I understand the architecture much more intuitively now because I have actually watched the values move through it.</p>
            <p>At the same time, building it made me appreciate how hard interpretation still is. You can trace the computations exactly and still have a much harder time explaining why the model represents something the way it does or why one continuation wins over another.</p>
            <p>And once you sample from that output distribution, the same prompt can produce different continuations. The mechanism is much less mysterious to me now, but the behavior is still not something you can reduce to one simple explanation.</p>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
