export interface CourseModule {
  title: string;
  description: string;
}

export interface Course {
  title: string;
  slug: string;
  description: string | null;
  country: string | null;
  language: string | null;
  targetAudience: string[];
  format: string | string[] | null;
  skillLevel: string | string[] | null;
  phase: string | string[] | null;
  providerType: string | null;
  locations: string[];
  modules: CourseModule[];
  registrationUrl: string | null;
  materialsUrl: string | null;
  heroImageUrl: string | null;
}
