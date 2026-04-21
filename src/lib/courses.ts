import { Course } from "@/types/course";
import path from "path";
import fs from "fs";

let _cache: Course[] | null = null;

export function getAllCourses(): Course[] {
  if (_cache) return _cache;

  const filePath = path.join(process.cwd(), "src/data/courses.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  _cache = data;
  return data;
}

export function getCourseBySlug(slug: string): Course | undefined {
  return getAllCourses().find((c) => c.slug === slug);
}
