"use client";

import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import CourseFilters from "@/components/CourseFilters";
import { Course } from "@/types/course";

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setAllCourses(data);
        setFilteredCourses(data);
      });
  }, []);

  const displayCourses = search
    ? filteredCourses.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase()) ||
          c.country?.toLowerCase().includes(search.toLowerCase())
      )
    : filteredCourses;

  const countryCount = allCourses.length > 0
    ? [...new Set(allCourses.map((c) => c.country).filter(Boolean))].length
    : 15;

  return (
    <div className="min-h-screen bg-[var(--gray-light)]">
      {/* Hero */}
      <section className="hero-mesh noise-overlay relative overflow-hidden">
        <div className="relative z-10 max-w-[1120px] mx-auto px-6 pt-16 pb-20">
          <p className="text-[12px] font-semibold tracking-[2px] uppercase text-[var(--teal)] mb-4 animate-in stagger-1">
            Course Catalogue
          </p>
          <h1 className="text-white text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.15] mb-4 animate-in stagger-2">
            Discover AI Courses Across Asia-Pacific
          </h1>
          <p className="text-[16px] text-white/80 max-w-lg animate-in stagger-3">
            Browse training programs from Local Training Providers in {countryCount} countries.
            Filter by region, format, or skill level.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-lg animate-in stagger-4">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by course name, country, or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 bg-white/8 border border-white/20 rounded-full pl-11 pr-5 text-[15px] text-white placeholder-white/60 focus:outline-none focus:border-[var(--teal)]/50 focus:bg-white/12 backdrop-blur-sm transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="max-w-[1120px] mx-auto px-6 -mt-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,41,68,0.06)] border border-[var(--slate-light)]/20 px-5 py-4 mb-8">
          <CourseFilters courses={allCourses} onFilter={setFilteredCourses} />
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] text-[var(--slate)]">
            Showing <span className="font-semibold text-[var(--navy)]">{displayCourses.length}</span> of {allCourses.length} courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {displayCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {displayCourses.length === 0 && allCourses.length > 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[var(--teal-ice)] flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[var(--teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[18px] font-semibold text-[var(--navy)] mb-1">No courses match</p>
            <p className="text-[14px] text-[var(--slate)]">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
