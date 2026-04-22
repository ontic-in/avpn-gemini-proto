import { Course } from "@/types/course";

/**
 * Given the agent's text response, find any courses from the catalogue that are
 * referenced in it and return them (up to `limit`) so the UI can render course
 * cards alongside the text. Matching is deliberately loose — it looks for the
 * course title (case-insensitive) as a substring. Ordering preserves first
 * mention in the text, which usually aligns with the agent's intent.
 */
export function extractMentionedCourses(
  responseText: string,
  catalogue: Course[],
  limit = 3,
): Course[] {
  const haystack = responseText.toLowerCase();

  const scored = catalogue
    .map((course) => {
      const title = course.title.toLowerCase();
      const index = haystack.indexOf(title);
      return { course, index };
    })
    .filter((x) => x.index !== -1)
    .sort((a, b) => a.index - b.index)
    .slice(0, limit)
    .map((x) => x.course);

  return scored;
}
