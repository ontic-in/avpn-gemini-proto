import Link from "next/link";
import { Course } from "@/types/course";

export default function CourseCard({ course }: { course: Course }) {
  const phase = Array.isArray(course.phase) ? course.phase[0] : course.phase;
  const format = Array.isArray(course.format) ? course.format.join(" / ") : course.format;
  const level = Array.isArray(course.skillLevel) ? course.skillLevel.join(", ") : course.skillLevel;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block bg-white rounded-[20px] overflow-hidden card-glow"
    >
      {/* Image */}
      <div className="aspect-[16/10] relative overflow-hidden bg-[var(--teal-ice)]">
        {course.heroImageUrl ? (
          <img
            src={course.heroImageUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--teal)]/20 to-[var(--navy)]/10" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

        {phase && (
          <span className="absolute top-3 left-3 bg-[var(--navy)]/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {phase}
          </span>
        )}
        {course.country && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--navy)] text-[12px] font-medium px-2.5 py-1 rounded-full">
            {course.country}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 pb-6">
        <h3 className="font-semibold text-[var(--navy)] text-[18px] leading-snug line-clamp-2 mb-2 group-hover:text-[var(--navy-light)] transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-[14px] text-[var(--slate)] line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          {format && (
            <span className="text-[11px] font-medium text-[var(--cyan)] bg-[var(--teal-ice)] px-2.5 py-0.5 rounded-full">
              {format}
            </span>
          )}
          {level && (
            <span className="text-[11px] font-medium text-[var(--orange)] bg-[var(--yellow-light)] px-2.5 py-0.5 rounded-full">
              {level}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
