import { capture, rankedPrediction, residualValues, sampleIndex } from './capture-model';

/** Reading layer over the existing immutable capture, not another inference engine. */
export const prefixChoices = [
  { position: 1, text: 'RO' },
  { position: 2, text: 'ROM' },
  { position: 5, text: 'ROMEO:' },
] as const;
export function previewPrediction(position: number) {
  if (!Number.isInteger(position) || position < 0 || position >= capture.length) throw new RangeError('Unknown captured position.');
  const prediction = rankedPrediction(position, 1);
  const top = prediction.top.slice(0, 3);
  return {
    prefix: capture.characters.slice(0, position + 1).join(''),
    distribution: prediction.distribution,
    top,
    remainder: prediction.distribution.reduce((sum, value, index) => sum + (top.some(item => item.index === index) ? 0 : value), 0),
    otherCount: capture.model.vocab_size - top.length,
  };
}
export function drawPreview(position: number, draw: number) {
  return sampleIndex(previewPrediction(position).distribution, draw);
}
export function displayPercent(value: number) {
  return value > 0 && value < .001 ? '<0.1%' : `${(value * 100).toFixed(1)}%`;
}
export const residualExample = (() => {
  // The second coordinate at the colon, attention branch in the first block.
  const values = residualValues(5, 0, 'attention');
  return { original: values.input[1], update: values.update[1], result: values.output[1] };
})();
