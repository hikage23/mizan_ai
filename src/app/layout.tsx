import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { ScaleMark } from '@/components/Scale';

export const metadata: Metadata = {
  title: 'Mizan — zakat verification copilot',
  description:
    'Assembles the evidence for a zakat-eligibility decision and routes it to the right human. Weighs evidence, never issues rulings.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="shell topbar-inner">
            <a href="/" className="row" style={{ gap: 0 }}>
              <span className="wordmark">
                <ScaleMark size={19} />
                Mizan
              </span>
              <span className="wordmark-sub">weighs evidence · never rules</span>
            </a>
            <Nav />
          </div>
        </header>
        <main style={{ padding: '32px 0 80px' }}>{children}</main>
        <footer className="shell" style={{ paddingBottom: 40, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
          <p className="tiny faint" style={{ maxWidth: '80ch' }}>
            Prototype built for a LaunchGood Applied AI Engineer application. All campaigns, organisations,
            documents and figures are synthetic; no case depicts a real organisation or a real decision.
            The encoded policy is a transcription of LaunchGood&rsquo;s published zakat policy, used to
            demonstrate policy execution at scale. This system does not issue religious rulings.
          </p>
        </footer>
      </body>
    </html>
  );
}
