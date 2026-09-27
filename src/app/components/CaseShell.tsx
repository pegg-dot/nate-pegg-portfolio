import Link from "next/link";
import type { ReactNode } from "react";

export default function CaseShell({ index, title, subtitle, children, external }: { index: string; title: string; subtitle: string; children: ReactNode; external?: { label: string; href: string } }) {
  return (
    <main className="caseMain">
      <header className="caseNav">
        <Link href="/">← NATE PEGG</Link>
        <span>{index}</span>
        {external ? <a href={external.href} target="_blank" rel="noreferrer">{external.label} ↗</a> : <span />}
      </header>
      <section className="caseHero">
        <span className="caseKicker">{index}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </section>
      {children}
      <footer className="caseFooter"><Link href="/">← back to the line</Link></footer>
    </main>
  );
}
