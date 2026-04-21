import { getAllCourses, getCourseBySlug } from "@/lib/courses";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return notFound();

  const fmt = Array.isArray(course.format) ? course.format.join(", ") : course.format;
  const lvl = Array.isArray(course.skillLevel) ? course.skillLevel.join(", ") : course.skillLevel;
  const ph = Array.isArray(course.phase) ? course.phase.join(", ") : course.phase;

  return (
    <div className="min-h-screen bg-[var(--gray-light)]">
      {/* Hero with image */}
      <section className="relative overflow-hidden bg-[var(--navy)]">
        {course.heroImageUrl && (
          <div className="absolute inset-0">
            <img src={course.heroImageUrl} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/80 to-[var(--navy)]/60" />
          </div>
        )}

        <div className="relative z-10 max-w-[1120px] mx-auto px-6 pt-10 pb-16">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--teal)]/70 hover:text-[var(--teal)] transition-colors mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </Link>

          <div className="flex flex-wrap gap-2 mb-5">
            {course.country && (
              <span className="text-[11px] font-medium bg-white/10 text-white/60 px-3 py-1 rounded-full">
                {course.country}
              </span>
            )}
            {ph && (
              <span className="text-[11px] font-medium bg-[var(--teal)]/15 text-[var(--teal)] px-3 py-1 rounded-full">
                {ph}
              </span>
            )}
          </div>

          <h1 className="text-white text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.2] max-w-3xl mb-4">
            {course.title}
          </h1>
          {course.description && (
            <p className="text-[16px] text-white/80 max-w-2xl leading-relaxed">
              {course.description}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1120px] mx-auto px-6 -mt-6 relative z-20 pb-20">
        {/* Metadata bar */}
        <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,41,68,0.06)] border border-[var(--slate-light)]/20 p-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {course.country && <MetaItem label="Country" value={course.country} />}
            {course.language && <MetaItem label="Language" value={typeof course.language === 'string' ? course.language : Array.isArray(course.language) ? (course.language as string[]).join(', ') : ''} />}
            {fmt && <MetaItem label="Format" value={fmt} />}
            {lvl && <MetaItem label="Level" value={lvl} />}
            {ph && <MetaItem label="Phase" value={ph} />}
            {course.providerType && <MetaItem label="Provider" value={course.providerType} />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-10">
            {course.targetAudience.length > 0 && (
              <section>
                <SectionHeading>Who is this for</SectionHeading>
                <div className="flex flex-wrap gap-2">
                  {course.targetAudience.map((a) => (
                    <span key={a} className="text-[14px] font-normal bg-[var(--teal-ice)] text-[var(--navy-light)] px-3.5 py-1.5 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {course.modules.length > 0 && (
              <section>
                <SectionHeading>Course Modules</SectionHeading>
                <div className="space-y-3">
                  {course.modules.map((mod, i) => (
                    <div key={i} className="group bg-white rounded-xl border border-[var(--slate-light)]/20 p-5 hover:border-[var(--teal)]/30 hover:shadow-[0_2px_12px_rgba(145,199,214,0.08)] transition-all">
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--teal-ice)] group-hover:bg-[var(--teal)]/15 flex items-center justify-center text-[14px] font-semibold text-[var(--navy)] transition-colors">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[16px] text-[var(--navy)] mb-0.5">{mod.title}</h3>
                          {mod.description && (
                            <p className="text-[14px] text-[var(--slate)] leading-relaxed">{mod.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {course.locations.length > 0 && (
              <section>
                <SectionHeading>Available Locations</SectionHeading>
                <div className="flex flex-wrap gap-2">
                  {course.locations.map((loc) => (
                    <span key={loc} className="text-[13px] font-normal bg-white text-[var(--slate)] border border-[var(--slate-light)]/30 px-3 py-1.5 rounded-full">
                      {loc}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column — sticky CTA */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {course.registrationUrl && (
                <div className="bg-white rounded-2xl border border-[var(--slate-light)]/20 shadow-[0_4px_30px_rgba(0,41,68,0.06)] overflow-hidden">
                  <div className="bg-[var(--yellow-light)] p-6">
                    <p className="text-[20px] font-bold text-[var(--navy)] mb-1.5">Ready to start?</p>
                    <p className="text-[14px] text-[var(--slate)]">Register now and begin building your AI skills.</p>
                  </div>
                  <div className="p-6">
                    <a href={course.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-primary w-full text-center">
                      Register for this Course
                    </a>
                    {course.materialsUrl && (
                      <a href={course.materialsUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-outline w-full text-center mt-3 !text-[13px]">
                        View Course Materials
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-[var(--slate-light)]/20 p-6">
                <p className="text-[12px] font-semibold tracking-[2px] uppercase text-[var(--slate)]/40 mb-4">Quick Facts</p>
                <div className="space-y-3">
                  {course.modules.length > 0 && <QuickFact label="Modules" value={`${course.modules.length} modules`} />}
                  {fmt && <QuickFact label="Delivery" value={fmt} />}
                  {lvl && <QuickFact label="Level" value={lvl} />}
                  {course.locations.length > 0 && <QuickFact label="Locations" value={`${course.locations.length} available`} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-[var(--slate)]/40 mb-1">{label}</p>
      <p className="text-[14px] font-medium text-[var(--navy)]">{value}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-[18px] font-bold text-[var(--navy)]">{children}</h2>
      <div className="flex-1 h-px bg-[var(--slate-light)]/30" />
    </div>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[14px]">
      <span className="text-[var(--slate)]">{label}</span>
      <span className="font-medium text-[var(--navy)]">{value}</span>
    </div>
  );
}
