'use client';
import { HOME_COPY } from './copy';
import { RoughBox } from './Rough';
import styles from './sketchbook.module.css';

/** Hand-boxed tabs sticking out of the sketchbook: every subject one click away on every page. */
export default function Tabs() {
  return (
    <nav className={styles.tabs} data-zone="tabs" aria-label="Primary">
      {HOME_COPY.nav.map((n, i) => (
        <a key={n.href} className={styles.tab} href={n.href} target={n.external ? '_blank' : undefined} rel={n.external ? 'noreferrer' : undefined}>
          <RoughBox seed={300 + i} fill="#f3efe3" />
          <span>{n.label}</span>
        </a>
      ))}
    </nav>
  );
}
