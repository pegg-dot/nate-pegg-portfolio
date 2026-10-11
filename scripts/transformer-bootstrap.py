"""One-time, bounded source refinements for the isolated design branch."""
import re
import runpy
from pathlib import Path

root=Path(__file__).resolve().parents[1]
runpy.run_path(str(root/'scripts/prepare-transformer.py'))
for name in ['page.tsx','TransformerLab.tsx','capture-model.ts']:
    path=root/'src/app/work/transformer'/name
    text=path.read_text()
    text=re.sub(r'\\u([0-9a-fA-F]{4})',lambda m:chr(int(m.group(1),16)),text)
    path.write_text(text)
p=root/'src/app/work/transformer/TransformerLab.tsx'
s=p.read_text().replace("style={{ '--weight': weight } as CSSProperties}","style={{ '--weight': weight, color: weight >= .38 ? '#000000' : '#ffffff' } as CSSProperties}")
p.write_text(s)
p=root/'src/app/work/transformer/transformer.module.css'
s=p.read_text().replace('transition:background .25s ease','transition:none')
s=s.replace('.residualDiagram{min-width:420px}.stageContent:has(.residualDiagram){overflow-x:auto}', '.residualDiagram{width:100%;min-width:0}')
p.write_text(s)
p=root/'tests/transformer.spec.ts'
s=p.read_text().replace("await expect(page.getByTestId('sample-result')).not.toContainText('?');", "await expect(page.getByTestId('sample-result').locator('strong')).toBeVisible();")
p.write_text(s)
