'use client';

import Image from 'next/image';
import { useState } from 'react';
import s from './authored.module.css';

export type Artifact = { label: string; src: string; alt: string; width: number; height: number; caption: string };
/** Real project artifacts. A switch selects another capture, never a simulated app state. */
export default function ArtifactViewer({ images, testId, dark = false }: { images: Artifact[]; testId: string; dark?: boolean }) {
  const [selected, setSelected] = useState(0);
  const image = images[selected];
  return <figure className={`${s.artifact} ${dark ? s.darkArtifact : ''}`} data-testid={testId}>
    <div className={s.imageStage}><a href={image.src} target="_blank" rel="noreferrer" aria-label={`Open full image: ${image.alt}`}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 720px) 100vw, 1100px" loading="eager" fetchPriority="high" /></a></div>
    <figcaption>
      <div className={s.artifactControls} role="group" aria-label="Choose a project screenshot" data-interactive="true">{images.map((item, index) => <button type="button" key={item.src} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}</button>)}</div>
      <p aria-live="polite">{image.caption}</p>
      <a className={s.fullImage} href={image.src} target="_blank" rel="noreferrer">Full size <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a>
    </figcaption>
  </figure>;
}
