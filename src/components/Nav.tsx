'use client';

import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Queue' },
  { href: '/evals', label: 'Evals' },
  { href: '/policy', label: 'Policy' },
  { href: '/how-it-works', label: 'How it works' },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      {LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className={l.href === '/' ? (path === '/' ? 'on' : '') : path.startsWith(l.href) ? 'on' : ''}
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}
