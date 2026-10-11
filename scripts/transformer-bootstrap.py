"""Bounded, idempotent refinements on the isolated design branch only."""
from pathlib import Path
import runpy

root=Path(__file__).resolve().parents[1]
runpy.run_path(str(root/'scripts/prepare-transformer.py'))
p=root/'src/app/work/transformer/page.tsx'
s=p.read_text()
assert s.count('width={1400} height={900}') in (0,2)
s=s.replace('width={1400} height={900}', 'width={900} height={493}')
s=s.replace('<figcaption>Q / K / V in the full visualizer <span>Open \u2197</span></figcaption></a></figure>', '</a><figcaption>Q / K / V in the full visualizer <span>Open above \u2197</span></figcaption></figure>')
p.write_text(s)
p=root/'src/app/work/transformer/TransformerLab.tsx'
s=p.read_text()
needle="</svg>{vectorTable(vectors.input, vectors.update, vectors.output, ['Original x', '+ Update', '= New x'])}"
if needle in s:
    s=s.replace(needle,"</svg><div className={s.mobileResidual}><span>Original stream <code>x</code></span><b>+</b><span>{branch === 'attention' ? 'Attention' : 'Feed-forward'} update</span><b>=</b><strong>New stream</strong></div>{vectorTable(vectors.input, vectors.update, vectors.output, ['Original x', '+ Update', '= New x'])}")
p.write_text(s)
p=root/'src/app/work/transformer/transformer.module.css'
s=p.read_text()
if 'Native WebKit menu styling' not in s:
    s+='\n/* Native WebKit menu styling must not turn light text into white-on-white controls. */\n.lab select{-webkit-appearance:none;appearance:none;color-scheme:dark;background-color:#213829;color:#f2f7e7;padding-right:30px;background-image:linear-gradient(45deg,transparent 50%,#d9efa7 50%),linear-gradient(135deg,#d9efa7 50%,transparent 50%);background-position:calc(100% - 12px) 50%,calc(100% - 7px) 50%;background-size:5px 5px;background-repeat:no-repeat}.vectorTable th:first-child{position:sticky;left:0;z-index:1}.mobileResidual{display:none}\n@media(max-width:580px){.residualDiagram{display:none}.mobileResidual{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:18px 12px;margin-top:20px;background:#253d2b;border:1px solid #78955d;border-radius:3px;font:11px/1.6 Arial,sans-serif}.mobileResidual code{display:block;color:#d9efa7;font-size:23px}.mobileResidual>b:nth-of-type(2){grid-column:1;text-align:right}.mobileResidual>strong{grid-column:2/4;color:#d9efa7;font-weight:500}.tokens small{white-space:nowrap;font-size:7px}}\n'
p.write_text(s)
