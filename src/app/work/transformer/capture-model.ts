import snapshot from './capture.json';

export const capture = snapshot;
export const stages = ['Characters', 'Embeddings', 'Attention', 'Residual', 'Prediction'] as const;
export type Stage = (typeof stages)[number];
export type Branch = 'attention' | 'feedforward';
export const readableCharacter = (character: string) => character === '\n' ? 'newline' : character === ' ' ? 'space' : character;
export const characterGlyph = (character: string) => character === '\n' ? '\u21b5' : character === ' ' ? '\u2423' : character;
export function probabilities(logits: number[], temperature = 1): number[] {
  if (!Number.isFinite(temperature) || temperature <= 0) throw new Error('Temperature must be positive and finite.');
  if (!logits.length || logits.some(value => !Number.isFinite(value))) throw new Error('Finite logits are required.');
  const max = Math.max(...logits);
  const exponentials = logits.map(value => Math.exp((value - max) / temperature));
  const total = exponentials.reduce((a, b) => a + b, 0);
  return exponentials.map(value => value / total);
}
export function rankedPrediction(position: number, temperature: number) {
  const distribution = probabilities(capture.logits[position], temperature);
  const ranked = distribution.map((probability, index) => ({ index, character: capture.vocab[index], probability })).sort((a, b) => b.probability - a.probability);
  return { distribution, top: ranked.slice(0, 5), remainder: ranked.slice(5).reduce((sum, entry) => sum + entry.probability, 0) };
}
export function sampleIndex(distribution: number[], draw: number): number {
  if (!(draw >= 0 && draw < 1)) throw new Error('The sample draw must be in [0, 1).');
  let cumulative = 0;
  for (let i = 0; i < distribution.length; i++) { cumulative += distribution[i]; if (draw < cumulative) return i; }
  return distribution.length - 1;
}
export function residualValues(position: number, block: number, branch: Branch) {
  const current = capture.blocks[block];
  return branch === 'attention'
    ? { input: block === 0 ? capture.embeddingSum[position] : capture.blocks[block - 1].residualOut[position], update: current.attentionOut[position], output: current.residualMid[position] }
    : { input: current.residualMid[position], update: current.feedForwardOut[position], output: current.residualOut[position] };
}
export const stageDescriptions: Record<Stage, { title: string; text: string }> = {
  Characters: { title: 'One character is one token here.', text: 'This small model uses characters, not word pieces. The two O characters have the same token ID, but occupy different positions.' },
  Embeddings: { title: 'The character gets a position.', text: 'A learned token vector and a learned position vector are added. These are eight of the 384 actual coordinates, not named meanings or a complete picture of the representation.' },
  Attention: { title: 'It can use what came before. Not what comes next.', text: 'Each row is one query position. Its weights distribute over the visible keys. Future positions are masked to zero. A large weight is not a complete explanation of the model\u2019s reasoning.' },
  Residual: { title: 'The stream is updated, not replaced.', text: 'Layer normalization feeds the branch. The branch\u2019s output is then added to the original stream. Inspect attention or the feed-forward update, with the same addition in both cases.' },
  Prediction: { title: 'A distribution, not a single answer.', text: 'After all six blocks and the final normalization, the output layer produces 65 logits. Softmax turns them into probabilities for the next character. Sampling draws from that distribution.' },
};
