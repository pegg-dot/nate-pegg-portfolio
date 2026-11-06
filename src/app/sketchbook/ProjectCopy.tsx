'use client';
import { useMemo } from 'react';
import type { ProjectCopy as ProjectCopyType } from './copy';
import { seq } from './pencil';
import { copyOn, headOn } from './pages';
import { RoughBox } from './Rough';
import ShadedHeading from './ShadedHeading';
import Sketch from './Sketch';
import styles from './sketchbook.module.css';

const UNDERLINE = [[[0, 6], [25, 9], [50, 5], [75, 8], [100, 6]] as [number, number][]];

/** WHAT IT IS, the actions, THE BUILD and the chips, verbatim from copy.ts. The first sentence is bold. */
export default function ProjectCopy({ project, progress, entering, vw, active, boil, seen }: { project: ProjectCopyType; progress: number; entering: number; vw: number; active: boolean; boil: number; seen: boolean }) {
  const cut = project.what.indexOf('. ') + 1;
  const lead = project.what.slice(0, cut), rest = project.what.slice(cut);
  const underlines = useMemo(() => project.chips.map((_, i) => seq(UNDERLINE, 0.3 + i * 0.05, 0.36 + i * 0.05, undefined, 0.6)), [project]);
  return (
    <div className={[styles.copy, copyOn(progress, seen, entering, vw) ? styles.on : ''].join(' ')} data-zone="copy">
      <span className={styles.micro}>{project.whatLabel}</span>
      <p><strong>{lead}</strong>{rest}</p>
      <div className={styles.actions}>
        {project.actions.map((a, i) => (
          <a key={a.href} className={styles.rbtn} href={a.href} target={a.external ? '_blank' : undefined} rel={a.external ? 'noreferrer' : undefined}><RoughBox seed={700 + i * 9} />{a.label}</a>
        ))}
      </div>
      <span className={styles.micro}>{project.buildLabel}</span>
      <ShadedHeading lines={[project.buildHeading]} progress={headOn(progress, entering, vw, 0.1, 0.3)} className={styles.buildHeading} />
      <p>{project.buildBody}</p>
      <ul className={styles.chips}>
        {project.chips.map((c, i) => (
          <li key={c} className={styles.chip}><span>{c}</span><Sketch strokes={underlines[i]} progress={progress} active={active} boil={boil} viewBox="0 0 100 12" preserveAspectRatio="none" className={styles.chipLine} strokeWidth={1.4} /></li>
        ))}
      </ul>
    </div>
  );
}
