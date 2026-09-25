import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL_CONFIG } from "@/lib/legal-config";

type Section = { heading: string; body: string };

// Body text uses a light markdown-like convention so long legal copy can be authored as plain
// strings: blank lines separate paragraphs, and a block made entirely of "- " lines becomes a list.
function renderBody(text: string): ReactNode {
  const blocks = text.trim().split(/\n\s*\n/);
  return blocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length && lines.every((line) => line.startsWith("- "))) {
      return (
        <ul key={index}>
          {lines.map((line, itemIndex) => (
            <li key={itemIndex}>{line.slice(2)}</li>
          ))}
        </ul>
      );
    }
    return <p key={index}>{block.replace(/\n/g, " ")}</p>;
  });
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  sections: Section[];
}) {
  return (
    <main className="info-page">
      <header>
        <Link href="/">← Petbot</Link>
        <Link href="/contact">Contact us</Link>
      </header>
      <section>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {intro && <p className="info-copy">{intro}</p>}
        <div className="policy-card legal-sections">
          {sections.map((item) => (
            <div className="legal-section" key={item.heading}>
              <h2>{item.heading}</h2>
              <div className="legal-body">{renderBody(item.body)}</div>
            </div>
          ))}
        </div>
        <p className="info-email">Last Updated: {LEGAL_CONFIG.effectiveDate}</p>
      </section>
    </main>
  );
}
