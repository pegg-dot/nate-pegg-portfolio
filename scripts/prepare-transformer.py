"""Extract a small, immutable slice of Nate's actual forward-pass capture.
Only first-six causal positions and eight residual dimensions are shipped.
The full model and large capture never load in the portfolio browser.
"""
import hashlib
import html
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODEL_COMMIT = 'f6ba652589871a0b95f71a41b9910269ec7cf8db'
PORTFOLIO_COMMIT = 'f96a14763353a4604fac86d24a2a30607106e418'
SOURCE_HASH = 'bf4f514ce66651b4cf9a977167205fa41f043e1f9a9c3fc12f8be6dfb56bb301'

def get(repo, commit, path):
    url = f'https://raw.githubusercontent.com/{repo}/{commit}/{path}'
    with urllib.request.urlopen(url, timeout=90) as response:
        return response.read()

def store(path, value):
    path = ROOT / path
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        assert json.loads(path.read_text()) == value, f'Pinned fixture changed: {path}'
    else:
        path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False) + '\n')

raw = get('pegg-dot/Transformer', MODEL_COMMIT, 'viz/public/activations.json')
assert hashlib.sha256(raw).hexdigest() == SOURCE_HASH, 'Activation source hash mismatch'
a = json.loads(raw)
n = len(a['run']['prompt_token_ids'])
assert n == 6 and a['run']['prompt'] == 'ROMEO:'
assert a['model']['n_embd'] == 384 and a['model']['n_layer'] == 6
cut = lambda x: [row[:8] for row in x[:n]]
data = {
    'source': {'repository': 'pegg-dot/Transformer', 'commit': MODEL_COMMIT, 'path': 'viz/public/activations.json', 'sha256': SOURCE_HASH},
    'model': a['model'], 'length': n, 'shownDimensions': 8,
    'vocab': a['vocab'], 'tokens': a['tokens'][:n], 'characters': a['token_strs'][:n],
    'tokenEmbedding': cut(a['token_emb']), 'positionEmbedding': cut(a['pos_emb']), 'embeddingSum': cut(a['embed_sum']),
    'blocks': [{'weights': [[row[:n] for row in h[:n]] for h in b['attn']['weights']], 'attentionOut': cut(b['attn']['out']), 'residualMid': cut(b['resid_mid']), 'feedForwardOut': cut(b['ffn']['out']), 'residualOut': cut(b['resid_out'])} for b in a['blocks']],
    'logits': a['logits'][:n],
}
store('src/app/work/transformer/capture.json', data)
original = get('pegg-dot/nate-pegg-portfolio', PORTFOLIO_COMMIT, 'src/app/work/transformer/page.tsx')
assert hashlib.sha1(b'blob ' + str(len(original)).encode() + b'\0' + original).hexdigest() == 'b59c4f73b075a5e1ab9c5194777286417f3899b3'
text = original.decode()
clean = lambda value: html.unescape(re.sub(r'<[^>]*>', '', value))
copy = {'sourceCommit': PORTFOLIO_COMMIT, 'intro': clean(re.search(r'subtitle="([^"]+)"', text).group(1)), 'prose': [clean(p) for p in re.findall(r'<p>(.*?)</p>', text)], 'brief': [{'label': label, 'text': clean(value)} for label, value in re.findall(r'label: "([^"]+)", text: "([^"]+)"', text)]}
assert len(copy['prose']) == 12 and len(copy['brief']) == 4
store('src/app/work/transformer/story-copy.json', copy)
store('tests/fixtures/transformer-original-copy.json', copy)
print(json.dumps({'source': data['source'], 'prefix': data['characters'], 'bytes': len(json.dumps(data)), 'proseBlocks': len(copy['prose'])}))
