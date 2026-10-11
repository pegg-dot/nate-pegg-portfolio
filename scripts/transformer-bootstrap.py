"""Bounded layout refinement on the isolated design branch only."""
from pathlib import Path
import runpy
root=Path(__file__).resolve().parents[1]
runpy.run_path(str(root/'scripts/prepare-transformer.py'))
p=root/'src/app/work/transformer/transformer.module.css'
s=p.read_text()
if 'Small-screen intrinsic sizing' not in s:
    s+='\n/* Small-screen intrinsic sizing: the native fieldset must not clip its last token. */\n.tokens{min-width:0;min-inline-size:0}.stageNav{grid-template-columns:repeat(5,minmax(0,1fr))}.stageNav button{min-width:0}\n@media(max-width:580px){.tokens{gap:4px;padding-inline:10px}.tokens label{flex:1 1 0;min-width:0;padding-inline:2px}.tokens small{font-size:7px;letter-spacing:-.02em}}\n'
p.write_text(s)
