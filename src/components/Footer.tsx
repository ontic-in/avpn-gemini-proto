import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--navy)] noise-overlay">
      <div className="relative z-10">
        <div className="max-w-[1120px] mx-auto px-6 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <img
                src="/images/avpn-logo-white.png"
                alt="AVPN"
                className="h-7 opacity-70 mb-5"
              />
              <p className="text-[14px] text-white/40 leading-relaxed max-w-sm">
                AI Learning for the Future of Work — a curated training hub
                empowering workers across Asia-Pacific with essential AI skills,
                supported by Google.org and the Asian Development Bank.
              </p>
              <div className="divider-teal mt-6 opacity-40" />
            </div>

            <div className="md:col-span-3 md:col-start-7">
              <p className="text-[12px] font-semibold tracking-[2px] uppercase text-white/25 mb-4">
                Platform
              </p>
              <ul className="space-y-2.5">
                <FooterLink href="/courses">Course Catalogue</FooterLink>
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="text-[12px] font-semibold tracking-[2px] uppercase text-white/25 mb-4">
                Supported by
              </p>
              <ul className="space-y-2.5">
                <li className="text-[14px] text-white/40">Google.org</li>
                <li className="text-[14px] text-white/40">Asian Development Bank</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="max-w-[1120px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-white/25">
              &copy; {new Date().getFullYear()} AVPN — Asian Venture Philanthropy Network
            </p>
            <p className="text-[12px] text-white/15">
              AI Opportunity Fund &middot; Phase 3
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[14px] text-white/40 hover:text-[var(--teal)] transition-colors">
        {children}
      </Link>
    </li>
  );
}
