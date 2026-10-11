import styles from "./portfolio-footer.module.css";

/** Native disclosure: the writing stays optional and works without JavaScript. */
export default function PortfolioFooter() {
  return (
    <footer className={`siteFooter ${styles.footer}`} id="footer">
      <details className={styles.note} id="after-abundance" data-testid="writing-note">
        <summary className={styles.trigger}>
          <svg className={styles.noteIcon} width="26" height="30" viewBox="0 0 26 30" fill="none" aria-hidden="true">
            <path d="M4 3.5 17 2l6 6-1 18-18 1L4 3.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="m17 2-.5 7 6.5-1M8 13l10-1M8 17l9-1M8 21l6-.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          <span>one more thing...</span>
          <span className={styles.expand} aria-hidden="true">+</span>
        </summary>
        <article className={styles.paper} aria-labelledby="writing-title">
          <span className={styles.category}>A bit of writing</span>
          <h2 id="writing-title">After Abundance</h2>
          <p className={styles.subtitle}>My response to the <em>Techno-Optimist Manifesto.</em></p>
          <blockquote>
            <p>&ldquo;If everything is cheap, what does a person actually do?&rdquo;</p>
          </blockquote>
          <div className={styles.paperBottom}>
            <a className={styles.readLink} href="/writing/after-abundance.pdf" target="_blank" rel="noopener noreferrer">
              Read the paper <span aria-hidden="true">&#8599;</span>
              <span className="srOnly"> (PDF, opens in a new tab)</span>
            </a>
            <span className={styles.fileInfo}>July 2026 &middot; 42-page PDF</span>
          </div>
          <p className={styles.credit}>Nathaniel Pegg, with AI-assisted drafting and human direction.</p>
        </article>
      </details>
      <div className={styles.identity}><span>NATE PEGG</span><span>2026</span></div>
      <nav className={styles.links} aria-label="Footer">
        <a href="https://github.com/pegg-dot" target="_blank" rel="noreferrer">GitHub &#8599;</a>
        <a href="mailto:nate@natepegg.com">Email &#8599;</a>
        <a href="#top">Top &#8593;</a>
      </nav>
    </footer>
  );
}
