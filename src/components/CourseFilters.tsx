"use client";

import { useState } from "react";
import { Course } from "@/types/course";

interface Props {
  courses: Course[];
  onFilter: (filtered: Course[]) => void;
}

export default function CourseFilters({ courses, onFilter }: Props) {
  const [country, setCountry] = useState("");
  const [format, setFormat] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [phase, setPhase] = useState("");

  const countries = [...new Set(courses.map((c) => c.country).filter(Boolean))].sort() as string[];
  const formats = [...new Set(courses.flatMap((c) => Array.isArray(c.format) ? c.format : c.format ? [c.format] : []))].sort();
  const skillLevels = [...new Set(courses.flatMap((c) => Array.isArray(c.skillLevel) ? c.skillLevel : c.skillLevel ? [c.skillLevel] : []))].sort();
  const phases = [...new Set(courses.flatMap((c) => Array.isArray(c.phase) ? c.phase : c.phase ? [c.phase] : []))].sort();

  const applyFilters = (c: string, f: string, s: string, p: string) => {
    let filtered = courses;
    if (c) filtered = filtered.filter((x) => x.country === c);
    if (f) filtered = filtered.filter((x) => {
      const fmt = x.format;
      return Array.isArray(fmt) ? fmt.includes(f) : fmt === f;
    });
    if (s) filtered = filtered.filter((x) => {
      const sl = x.skillLevel;
      return Array.isArray(sl) ? sl.includes(s) : sl === s;
    });
    if (p) filtered = filtered.filter((x) => {
      const ph = x.phase;
      return Array.isArray(ph) ? ph.includes(p) : ph === p;
    });
    onFilter(filtered);
  };

  const hasActiveFilter = country || format || skillLevel || phase;

  const reset = () => {
    setCountry("");
    setFormat("");
    setSkillLevel("");
    setPhase("");
    onFilter(courses);
  };

  const selectClass =
    "filter-select h-10 border border-[var(--slate-light)] rounded-full px-4 text-[14px] font-normal text-[var(--navy)] bg-white hover:border-[var(--teal)] focus:border-[var(--teal)] focus:outline-none transition-colors cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <select value={country} onChange={(e) => { setCountry(e.target.value); applyFilters(e.target.value, format, skillLevel, phase); }} className={selectClass}>
        <option value="">All Countries</option>
        {countries.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={format} onChange={(e) => { setFormat(e.target.value); applyFilters(country, e.target.value, skillLevel, phase); }} className={selectClass}>
        <option value="">All Formats</option>
        {formats.map((f) => <option key={f} value={f}>{f}</option>)}
      </select>
      <select value={skillLevel} onChange={(e) => { setSkillLevel(e.target.value); applyFilters(country, format, e.target.value, phase); }} className={selectClass}>
        <option value="">All Levels</option>
        {skillLevels.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select value={phase} onChange={(e) => { setPhase(e.target.value); applyFilters(country, format, skillLevel, e.target.value); }} className={selectClass}>
        <option value="">All Phases</option>
        {phases.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      {hasActiveFilter && (
        <button onClick={reset} className="h-10 px-4 text-[14px] font-semibold text-[var(--red)] rounded-full hover:bg-[var(--red-light)]/30 transition-colors cursor-pointer">
          Clear all
        </button>
      )}
    </div>
  );
}
