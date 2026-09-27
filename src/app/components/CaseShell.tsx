import Link from "next/link";
import type { ReactNode } from "react";

type Action = { label: string; href: string; external?: boolean };

export default function CaseShell({
  index,
  title,
  subtitle,
  children,
  external,
  actions = []
}: {
  index: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  external?: { label: string; href: string };
  actions?: Action[];
}) {
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
        {actions.length > 0 ? (
          <div className="caseHeroActions">
            {actions.map((action) =>
              action.external ? (
                <a key={action.href} href={action.href} target="_blank" rel="noreferrer">{action.label} ↗</a>
              ) : (
                <Link key={action.href} href={action.href}>{action.label} →</Link>
              )
            )}
          </div>
        ) : null}
      </section>

      {children}
      <footer className="caseFooter"><Link href="/">← back to the line</Link></footer>
    </main>
  );
}
