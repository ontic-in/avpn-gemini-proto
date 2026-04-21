"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center group mr-2">
            <img src="/images/avpn-logo-red.png" alt="AVPN" className="h-8 opacity-90 group-hover:opacity-100 transition-opacity" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/courses">Courses</NavLink>
          </nav>

          <div className="flex-1" />

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[var(--navy)] p-2" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[var(--teal-ice)] border-t border-[var(--slate-light)]/20 px-6 py-4 space-y-1">
          <MobileLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
          <MobileLink href="/courses" onClick={() => setMenuOpen(false)}>Courses</MobileLink>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[15px] font-semibold text-[var(--navy)]/70 hover:text-[var(--navy)] px-4 py-2 rounded-full hover:bg-[var(--navy)]/5 transition-all">
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block text-[15px] font-medium text-[var(--navy)]/70 hover:text-[var(--navy)] py-2.5 px-3 rounded-lg hover:bg-[var(--navy)]/5 transition-all">
      {children}
    </Link>
  );
}
