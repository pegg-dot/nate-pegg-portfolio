import Link from 'next/link';
import s from './authored.module.css';

const projects = [['della', 'Della'], ['vialgrade', 'VialGrade'], ['transformer', 'Transformer']] as const;
export function ProjectNav({ active, dark = false }: { active: string; dark?: boolean }) {
  return <nav className={`${s.nav} ${dark ? s.darkNav : ''}`} aria-label="Project navigation">
    <Link href="/" className={s.homeLink}>&#8592; Nate Pegg</Link>
    <div>{projects.map(([slug, name]) => <Link key={slug} href={`/work/${slug}`} aria-current={active === slug ? 'page' : undefined}>{name}</Link>)}</div>
  </nav>;
}
export function ProjectFooter({ next, name }: { next: string; name: string }) {
  return <footer className={s.footer}><Link href="/">Back to my work</Link><Link href={`/work/${next}`}>{name} <span aria-hidden="true">&#8594;</span></Link></footer>;
}
