import { Course } from "@/types/course";
import type { FormComponent } from "@/types/chat-component";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  courses?: Course[];
  component?: FormComponent;
  formSubmitted?: boolean;
  typing?: boolean;
}

interface MatchResult {
  text: string;
  courses: Course[];
}

function matchCourses(input: string, allCourses: Course[]): MatchResult {
  const lower = input.toLowerCase();

  // Country-based matching
  const countries: Record<string, string> = {
    indonesia: "Indonesia",
    india: "India",
    vietnam: "Vietnam",
    malaysia: "Malaysia",
    singapore: "Singapore",
    japan: "Japan",
    "south korea": "South Korea",
    korea: "South Korea",
    philippines: "Philippines",
    taiwan: "Taiwan",
    australia: "Australia",
    thailand: "Thailand",
    pakistan: "Pakistan",
    bangladesh: "Bangladesh",
    "sri lanka": "Sri Lanka",
    "new zealand": "New Zealand",
  };

  for (const [keyword, country] of Object.entries(countries)) {
    if (lower.includes(keyword)) {
      const matches = allCourses.filter((c) => c.country === country);
      if (matches.length > 0) {
        return {
          text: `Great choice! I found ${matches.length} training program${matches.length > 1 ? "s" : ""} available in ${country}. These are delivered by certified Local Training Providers and cover practical AI skills — from fundamentals to prompt engineering.\n\nHere are some options for you:`,
          courses: matches.slice(0, 3),
        };
      }
    }
  }

  // Role-based matching
  if (lower.match(/teacher|educator|teach|school|professor|instructor/)) {
    const matches = allCourses.filter((c) =>
      c.targetAudience.some(
        (a) => a.includes("Education") || a.includes("Teacher") || a.includes("TVET")
      )
    );
    return {
      text: `There are ${matches.length} programs specifically designed for educators and trainers. These courses include modules on integrating AI into classroom settings, responsible AI practices, and building lesson plans with AI tools.\n\nHere are a few I'd recommend:`,
      courses: matches.slice(0, 3),
    };
  }

  if (lower.match(/student|university|college|studying/)) {
    const matches = allCourses.filter((c) =>
      c.targetAudience.some((a) => a.includes("College") || a.includes("University") || a.includes("Vocational"))
    );
    return {
      text: `I found ${matches.length} programs open to students. These are a great way to build AI skills before entering the workforce — many include certificate credentials and interview preparation support.\n\nCheck these out:`,
      courses: matches.slice(0, 3),
    };
  }

  if (lower.match(/business|msme|small business|entrepreneur|shop|store/)) {
    const matches = allCourses.filter((c) =>
      c.targetAudience.some((a) => a.includes("MSME") || a.includes("entrepreneur"))
    );
    const fallback = matches.length > 0 ? matches : allCourses.filter((c) => c.title.toLowerCase().includes("msme") || c.description?.toLowerCase().includes("business"));
    return {
      text: `There are programs designed for small business owners and MSME employees. You'll learn practical AI applications — like using AI for customer communication, product descriptions, and streamlining operations.\n\nHere are some programs that fit:`,
      courses: (fallback.length > 0 ? fallback : allCourses).slice(0, 3),
    };
  }

  if (lower.match(/farmer|agriculture|farming|fishery/)) {
    const matches = allCourses.filter(
      (c) =>
        c.targetAudience.some((a) => a.includes("Agricultur") || a.includes("Fisher")) ||
        c.title.toLowerCase().includes("farmer") ||
        c.title.toLowerCase().includes("agri")
    );
    return {
      text: `There are programs specifically for agricultural and fishery workers. These focus on practical applications of AI in farming, crop management, and market access.\n\nTake a look:`,
      courses: (matches.length > 0 ? matches : allCourses.slice(0, 3)).slice(0, 3),
    };
  }

  // Format-based matching
  if (lower.match(/online|remote|self.?paced|from home/)) {
    const matches = allCourses.filter((c) => {
      const fmt = c.format;
      const fmtStr = Array.isArray(fmt) ? fmt.join(" ") : fmt || "";
      return fmtStr.includes("Online") || fmtStr.includes("Self-Paced");
    });
    return {
      text: `There are ${matches.length} programs available online — some self-paced, some instructor-led. You can learn from anywhere at your own pace.\n\nHere are some popular ones:`,
      courses: matches.slice(0, 3),
    };
  }

  if (lower.match(/in.?person|offline|face.?to.?face|classroom/)) {
    const matches = allCourses.filter((c) => {
      const fmt = c.format;
      const fmtStr = Array.isArray(fmt) ? fmt.join(" ") : fmt || "";
      return fmtStr.includes("Hybrid") || fmtStr.includes("In Person");
    });
    return {
      text: `There are ${matches.length} programs with in-person or hybrid delivery — great if you prefer learning alongside others with hands-on support.\n\nHere are some options:`,
      courses: matches.slice(0, 3),
    };
  }

  // Topic-based matching
  if (lower.match(/beginner|new to ai|never used|don.?t know|getting started|start|basic/)) {
    const matches = allCourses.filter((c) => {
      const lvl = c.skillLevel;
      const lvlStr = Array.isArray(lvl) ? lvl.join(" ") : lvl || "";
      return lvlStr.includes("Beginner");
    });
    return {
      text: `Most of our programs are designed for beginners — no prior AI experience needed. Each one starts with the fundamentals and builds up to practical applications. You'll be comfortable with AI tools by the end.\n\nHere are some great starting points:`,
      courses: matches.slice(0, 3),
    };
  }

  if (lower.match(/what.*(learn|cover|module|curriculum|teach)/)) {
    return {
      text: `Every program follows a proven 5-module curriculum:\n\n**1. Introduction to AI** — What AI is, how it works, its capabilities and limitations\n**2. Productivity with AI Tools** — Using generative AI to get work done faster\n**3. Prompt Engineering** — How to communicate effectively with AI\n**4. Responsible AI** — Ethics, bias, privacy, and security\n**5. Staying Ahead** — Building a plan to keep growing your AI skills\n\nLocal Training Providers adapt this for their specific audience and language. Want me to find a program that fits your background?`,
      courses: [],
    };
  }

  if (lower.match(/free|cost|pay|price|fee/)) {
    return {
      text: `All programs through the AI Opportunity Fund are **free of charge**. The fund is supported by Google.org and the Asian Development Bank — their goal is to make AI skills accessible to everyone across Asia-Pacific, regardless of background.\n\nWould you like me to find a program near you?`,
      courses: [],
    };
  }

  if (lower.match(/certificate|credential|proof|certified/)) {
    return {
      text: `Yes — you'll receive a verifiable certificate upon completing your program. This can be shared with employers and added to your professional profile. Each certificate is tied to the specific Local Training Provider and course you completed.\n\nWant me to help you find the right program to get started?`,
      courses: [],
    };
  }

  if (lower.match(/scared|afraid|worried|replace|take my job|lose my job|anxious/)) {
    return {
      text: `That's a very common concern, and it's completely valid. The truth is — AI is changing how we work, but the people who learn to work *with* AI will be in a stronger position than ever.\n\nThese programs are designed specifically for people like you. No technical background needed. You'll learn practical skills at your own pace, in your own language, with support from local trainers who understand your community.\n\nThe best time to start is now. What kind of work do you do? I can find the right program for you.`,
      courses: [],
    };
  }

  // Greeting
  if (lower.match(/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|greetings)/)) {
    return {
      text: `Hello! Welcome to the AI Learning Hub. I'm here to help you find the right AI training program.\n\nYou can tell me:\n• Where you're based (e.g. "I'm in Indonesia")\n• What you do (e.g. "I'm a teacher" or "I run a small business")\n• What you're looking for (e.g. "beginner courses" or "online programs")\n\nWhat would you like to explore?`,
      courses: [],
    };
  }

  // Fallback — show popular courses
  return {
    text: `I'd love to help you find the right program! To give you the best recommendation, could you tell me:\n\n• **Where are you based?** (e.g. Indonesia, India, Vietnam)\n• **What do you do?** (e.g. teacher, student, business owner, worker)\n• **Any preference on format?** (online, in-person, or hybrid)\n\nOr if you'd like, you can [browse all ${allCourses.length} courses](/courses) directly.`,
    courses: allCourses.slice(0, 3),
  };
}

export function getMockResponse(
  userMessage: string,
  allCourses: Course[]
): { text: string; courses: Course[] } {
  return matchCourses(userMessage, allCourses);
}
