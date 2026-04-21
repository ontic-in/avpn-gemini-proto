import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-light)]">
      <section className="hero-mesh noise-overlay relative overflow-hidden">
        <div className="relative z-10 max-w-[1120px] mx-auto px-6 pt-16 pb-20">
          <p className="text-[12px] font-semibold tracking-[2px] uppercase text-[var(--teal)] mb-4 animate-in stagger-1">
            About
          </p>
          <h1 className="text-white text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.15] mb-4 animate-in stagger-2">
            AI Opportunity Fund
          </h1>
          <p className="text-[16px] text-white/80 max-w-lg animate-in stagger-3">
            Empowering workers in Asia-Pacific for the AI-driven future while
            fostering inclusivity and readiness in the evolving economy.
          </p>
        </div>
      </section>

      <section className="max-w-[1120px] mx-auto px-6 -mt-6 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,41,68,0.06)] border border-[var(--slate-light)]/20 overflow-hidden">
          <div className="p-8 md:p-12 space-y-14">
            <div className="max-w-2xl">
              <SectionLabel>The Initiative</SectionLabel>
              <h2 className="text-[var(--navy)] text-[24px] font-bold leading-[1.2] mb-4">
                Mobilizing AI literacy at scale
              </h2>
              <div className="divider-teal mb-5" />
              <p className="text-[16px] text-[var(--slate)] leading-relaxed">
                The AI Opportunity Fund is a philanthropic initiative supported by
                Google.org and managed by AVPN (Asian Venture Philanthropy Network).
                It partners with the Asian Development Bank to mobilize AI literacy
                across Asia-Pacific, with a target of reaching 300,000+ learners
                through certified Local Training Providers.
              </p>
            </div>

            <div className="max-w-2xl">
              <SectionLabel>Delivery Model</SectionLabel>
              <h2 className="text-[var(--navy)] text-[24px] font-bold leading-[1.2] mb-4">
                Local providers, global standard
              </h2>
              <div className="divider-teal mb-5" />
              <p className="text-[16px] text-[var(--slate)] leading-relaxed">
                AVPN selects and partners with Local Training Providers (LTPs)
                across the region — organizations with deep community reach in
                education, workforce development, and digital skills. Each LTP
                delivers a standardized 5-module AI curriculum, adapted for local
                context and language, covering AI fundamentals, productivity tools,
                prompt engineering, responsible AI, and staying ahead of AI trends.
              </p>
            </div>

            <div className="bg-[var(--teal-ice)]/50 rounded-2xl p-8">
              <SectionLabel>Phase 3</SectionLabel>
              <h2 className="text-[var(--navy)] text-[24px] font-bold leading-[1.2] mb-4">
                Building the platform layer
              </h2>
              <p className="text-[16px] text-[var(--slate)] leading-relaxed">
                This platform is Phase 3 of the AI Fund. Phases 1 and 2 established
                the training provider network and initial course delivery. Phase 3
                builds the technology layer — a learner portal, LTP coordinator
                portal, admin dashboard, and AI-powered chatbot (using Google Gemini)
                — to scale the program to its 300K learner target.
              </p>
            </div>

            <div>
              <SectionLabel>Supporters</SectionLabel>
              <h2 className="text-[var(--navy)] text-[24px] font-bold leading-[1.2] mb-6">
                Backed by global partners
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl p-6 border border-[var(--slate-light)]/15 bg-[var(--teal-ice)]">
                  <h3 className="font-semibold text-[var(--navy)] text-[16px] mb-2">Google.org</h3>
                  <p className="text-[14px] text-[var(--slate)] leading-relaxed">
                    Primary funder of the AI Opportunity Fund, enabling free AI
                    literacy training powered by the Gemini ecosystem.
                  </p>
                </div>
                <div className="rounded-xl p-6 border border-[var(--slate-light)]/15 bg-[var(--yellow-light)]">
                  <h3 className="font-semibold text-[var(--navy)] text-[16px] mb-2">Asian Development Bank</h3>
                  <p className="text-[14px] text-[var(--slate)] leading-relaxed">
                    Co-supporter ensuring the program reaches underserved
                    communities across developing Asia-Pacific nations.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link href="/courses" className="btn-pill btn-primary">
                Explore Courses
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold tracking-[2px] uppercase text-[var(--red)] mb-3">
      {children}
    </p>
  );
}
