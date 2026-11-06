import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nate Pegg — Work",
  description: "Things Nate Pegg has built, drawn, and pulled apart to understand.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} /><a className="skipLink" href="#main-content">Skip to content</a>{children}</body></html>;
}
