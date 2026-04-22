"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Course } from "@/types/course";
import { ChatMessage } from "@/lib/mock-chat";
import InlineForm from "@/components/InlineForm";
import type { FormComponent, FormResponse } from "@/types/chat-component";

const SUGGESTIONS = [
  "How can AI help me in my daily work?",
  "Which course is best for beginners?",
  "Show me courses available in my country",
  "What practical AI skills will I learn?",
  "Are there courses for teachers?",
  "How do I earn a certificate?",
];

const COUNTRY_FLAGS: Record<string, string> = {
  Indonesia: "🇮🇩", India: "🇮🇳", Vietnam: "🇻🇳", Malaysia: "🇲🇾",
  Singapore: "🇸🇬", Japan: "🇯🇵", "South Korea": "🇰🇷", Philippines: "🇵🇭",
  Taiwan: "🇹🇼", Australia: "🇦🇺", Thailand: "🇹🇭", Pakistan: "🇵🇰",
  Bangladesh: "🇧🇩", "Sri Lanka": "🇱🇰", "New Zealand": "🇳🇿",
};

// Generic AI sparkle icon — a four-point star (no provider branding)
function SparkleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Large 4-point star: main sparkle */}
      <path
        d="M12 2L13.8 9.2C14.1 10.3 14.9 11.2 16 11.6L21 12L16 12.4C14.9 12.8 14.1 13.7 13.8 14.8L12 22L10.2 14.8C9.9 13.7 9.1 12.8 8 12.4L3 12L8 11.6C9.1 11.2 9.9 10.3 10.2 9.2L12 2Z"
        fill="url(#sparkle-grad)"
      />
      {/* Small 4-point star accent: top-right */}
      <path
        d="M19 3L19.6 5.4C19.7 5.8 20 6.1 20.4 6.2L22.5 6.8L20.4 7.4C20 7.5 19.7 7.8 19.6 8.2L19 10.6L18.4 8.2C18.3 7.8 18 7.5 17.6 7.4L15.5 6.8L17.6 6.2C18 6.1 18.3 5.8 18.4 5.4L19 3Z"
        fill="url(#sparkle-grad)"
      />
      <defs>
        <linearGradient id="sparkle-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#91C7D6" />
          <stop offset=".5" stopColor="#1A3A5C" />
          <stop offset="1" stopColor="#E42919" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetch("/api/courses").then((r) => r.json()).then(setCourses); }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isTyping]);

  // Core call to /api/chat. `visibleText` is what's shown in the user bubble
  // (empty = don't render a user bubble, useful for form submissions that
  // already appended their own summary bubble). `historyText` is what gets
  // sent to the agent.
  const postToAgent = async (params: {
    visibleText: string;
    historyText: string;
    history: { role: "user" | "assistant"; content: string }[];
  }) => {
    const { visibleText, historyText, history } = params;
    setChatActive(true);
    if (visibleText) {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-u`, role: "user", content: visibleText },
      ]);
    }
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: historyText, history }),
      });
      if (!res.ok) throw new Error(`Chat API returned ${res.status}`);
      const data = (await res.json()) as {
        content: string;
        courses?: Course[];
        component?: FormComponent | null;
      };
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-a`,
          role: "assistant",
          content: data.content || "",
          courses: data.courses,
          component: data.component || undefined,
        },
      ]);
    } catch (err) {
      console.error("Chat request failed", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-err`,
          role: "assistant",
          content:
            "Sorry — I couldn't reach the assistant right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    setInput("");
    const history = messages
      .filter((m) => m.content?.trim())
      .map((m) => ({ role: m.role, content: m.content }));
    await postToAgent({
      visibleText: trimmed,
      historyText: trimmed,
      history,
    });
  };

  const handleFormSubmit = async (
    messageId: string,
    response: FormResponse,
  ) => {
    if (isTyping) return;
    // Mark the original form as submitted so the CTA shows "Submitted"
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, formSubmitted: true } : m,
      ),
    );
    const visible = response.summary || "Here are my answers.";
    const history = messages
      .filter((m) => m.content?.trim())
      .map((m) => ({ role: m.role, content: m.content }));
    await postToAgent({
      visibleText: visible,
      historyText: visible,
      history,
    });
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const featured = courses.slice(0, 6);
  const countriesCount = courses.length > 0 ? [...new Set(courses.map((c) => c.country).filter(Boolean))].length : 15;
  const countries = [...new Set(courses.map((c) => c.country).filter(Boolean))].sort() as string[];
  const countryHighlights = countries.slice(0, 6).map((c) => ({
    name: c, flag: COUNTRY_FLAGS[c] || "🌏", count: courses.filter((x) => x.country === c).length,
  }));

  // ── Chat active ──
  if (chatActive) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-[var(--gray-light)]">
        <div className="bg-[var(--teal-ice)] border-b border-[var(--slate-light)]/15 flex-shrink-0 px-6 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <SparkleIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[var(--navy)]">AI Learning Assistant</p>
              </div>
            </div>
            <button onClick={() => { setMessages([]); setChatActive(false); }} className="text-[12px] font-medium text-[var(--slate)] hover:text-[var(--navy)] transition-colors cursor-pointer">New chat</button>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in`}>
                <div className={`max-w-[85%] ${msg.role === "user" ? "bg-[var(--navy)] text-white rounded-2xl rounded-br-sm px-5 py-3.5" : "bg-white border border-[var(--slate-light)]/15 rounded-2xl rounded-bl-sm px-5 py-4 shadow-[0_2px_12px_rgba(0,41,68,0.04)]"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2.5">
                      <SparkleIcon className="w-4 h-4" />
                      <span className="text-[11px] font-semibold text-[var(--slate)]">AI Learning Assistant</span>
                    </div>
                  )}
                  {msg.content && (
                    <div className={`text-[15px] leading-relaxed whitespace-pre-line ${msg.role === "user" ? "text-white" : "text-[var(--navy)]"}`}
                      dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline text-[var(--red)] font-medium">$1</a>') }} />
                  )}
                  {msg.courses && msg.courses.length > 0 && (
                    <div className="mt-4 space-y-2">{msg.courses.map((course) => <MiniCourseCard key={course.slug} course={course} />)}</div>
                  )}
                  {msg.component && msg.role === "assistant" && (
                    <InlineForm
                      form={msg.component}
                      submitted={msg.formSubmitted}
                      onSubmit={(response) => handleFormSubmit(msg.id, response)}
                    />
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in">
                <div className="bg-white border border-[var(--slate-light)]/15 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <SparkleIcon className="w-4 h-4" />
                    <span className="text-[12px] text-[var(--slate)]">Thinking</span>
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-[var(--slate-light)]/10 bg-white px-6 py-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a follow-up question..." disabled={isTyping}
              className="w-full h-12 bg-[var(--gray-light)] rounded-2xl pl-5 pr-14 text-[15px] text-[var(--navy)] placeholder-[var(--slate-light)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/30 focus:bg-white transition-all disabled:opacity-60" />
            <button type="submit" disabled={!input.trim() || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[var(--red)] text-white flex items-center justify-center hover:bg-[var(--red-dark)] transition-colors disabled:opacity-30 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            </button>
          </form>
          <div className="max-w-2xl mx-auto flex items-center justify-end mt-2">
            <Link href="/courses" className="text-[11px] text-[var(--slate)] hover:text-[var(--navy)] font-medium transition-colors">Browse all courses &rarr;</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Landing: Warm Collage hero ──
  return (
    <div className="min-h-screen">
      {/* Hero — animated mesh gradient background */}
      <section className="relative overflow-hidden hero-warm-mesh">

        <div className="relative z-10 max-w-[1120px] mx-auto px-6 pt-16 pb-24 md:pt-20 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
            {/* Left */}
            <div className="max-w-[520px]">
              <div className="flex items-center gap-5 mb-8 animate-in stagger-1">
                <div className="flex items-center gap-1.5 text-[13px] text-[var(--slate)]">
                  <span className="w-1 h-1 rounded-full bg-[var(--green)]" />
                  <span>{courses.length || 72} free courses across {countriesCount} countries</span>
                </div>
              </div>

              <h1 className="text-[var(--navy)] text-[clamp(2.25rem,4.5vw,3rem)] font-extrabold leading-[1.08] mb-4 animate-in stagger-2">
                Build AI skills for the future of work
              </h1>
              <p className="text-[17px] text-[var(--slate)] leading-relaxed mb-8 animate-in stagger-3">
                Tell us who you are and we&apos;ll match you with the right training program — free, in your language, near you.
              </p>

              {/* Modern input — shadow-based, no border */}
              <form onSubmit={handleSubmit} className="mb-6 animate-in stagger-4">
                <div className="relative group">
                  <div className="flex items-center bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,41,68,0.08)] group-focus-within:shadow-[0_4px_24px_rgba(145,199,214,0.25)] transition-shadow">
                    <SparkleIcon className="w-5 h-5 ml-5 flex-shrink-0 opacity-40 group-focus-within:opacity-70 transition-opacity" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything about AI courses..."
                      className="flex-1 h-14 bg-transparent pl-3 pr-4 text-[15px] text-[var(--navy)] placeholder-[var(--slate-light)] focus:outline-none"
                    />
                    <button type="submit" disabled={!input.trim()} className="mr-2.5 w-9 h-9 rounded-xl bg-[var(--red)] text-white flex items-center justify-center hover:bg-[var(--red-dark)] transition-all disabled:opacity-20 cursor-pointer flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                    </button>
                  </div>
                </div>
              </form>

              {/* Suggestion chips — natural, curious questions */}
              <div className="flex flex-wrap gap-2 animate-in stagger-5">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="text-[13px] text-[var(--navy)]/70 bg-white/70 backdrop-blur-sm rounded-full px-3.5 py-2 hover:bg-white hover:text-[var(--navy)] hover:shadow-[0_2px_8px_rgba(0,41,68,0.08)] transition-all cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — floating image collage (enlarged) */}
            <div className="hidden lg:block relative h-[600px] ml-6">
              {/* Floating tags — each on its own float animation */}
              <span className="absolute -top-2 left-8 z-20 bg-[var(--navy)] text-white text-[12px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(0,41,68,0.25)]" style={{ animation: "collageFloat2 5s ease-in-out infinite" }}>
                🇮🇩 Indonesia &middot; 13 courses
              </span>
              <span className="absolute bottom-[60px] -right-3 z-20 bg-[var(--red)] text-white text-[12px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(228,41,25,0.25)]" style={{ animation: "collageFloat3 6s ease-in-out infinite 0.3s" }}>
                300K+ learners
              </span>
              <span className="absolute top-[275px] -left-6 z-20 bg-[var(--yellow)] text-[var(--navy)] text-[12px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(255,213,82,0.3)]" style={{ animation: "collageFloat1 7s ease-in-out infinite 0.5s" }}>
                Free & certified ✓
              </span>

              {/* Images — larger sizes */}
              <img src="/images/courses/ai-capacity-building-program-for-vietnamese-workforce.jpg" alt="" className="absolute w-[290px] h-[340px] rounded-[22px] object-cover shadow-[0_16px_48px_rgba(0,41,68,0.18)] top-0 left-8 z-[3]" style={{ animation: "collageFloat1 6s ease-in-out infinite" }} />
              <img src="/images/courses/ai-for-fpos-farmers-agricultural-workers.jpg" alt="" className="absolute w-[220px] h-[280px] rounded-[22px] object-cover shadow-[0_16px_48px_rgba(0,41,68,0.18)] top-5 left-[290px] z-[2]" style={{ animation: "collageFloat2 7s ease-in-out infinite" }} />
              <img src="/images/courses/ai-skills-for-tomorrows-educators.webp" alt="" className="absolute w-[270px] h-[190px] rounded-[22px] object-cover shadow-[0_16px_48px_rgba(0,41,68,0.18)] top-[320px] left-0 z-[4]" style={{ animation: "collageFloat3 5s ease-in-out infinite" }} />
              <img src="/images/courses/electives-ai-training.webp" alt="" className="absolute w-[220px] h-[240px] rounded-[22px] object-cover shadow-[0_16px_48px_rgba(0,41,68,0.18)] top-[330px] left-[260px] z-[1]" style={{ animation: "collageFloat1 8s ease-in-out infinite" }} />
              <img src="/images/courses/ai-training-for-youth.jpg" alt="" className="absolute w-[160px] h-[120px] rounded-[18px] object-cover shadow-[0_8px_32px_rgba(0,41,68,0.14)] top-[230px] left-[360px] z-[5]" style={{ animation: "collageFloat2 6s ease-in-out infinite 0.5s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured courses ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[12px] font-semibold tracking-[2px] uppercase text-[var(--red)] mb-2">Featured</p>
              <h2 className="text-[var(--navy)] text-[24px] font-bold">Recommended Programs</h2>
            </div>
            <Link href="/courses" className="text-[14px] font-medium text-[var(--slate)] hover:text-[var(--navy)] transition-colors">View all {courses.length || 72} &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {featured.slice(0, 2).map((course, i) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className={`group relative rounded-2xl overflow-hidden ${i === 0 ? "md:col-span-3" : "md:col-span-2"}`} style={{ minHeight: "260px" }}>
                <img src={course.heroImageUrl || ""} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/50 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end h-full p-6">
                  {course.country && <span className="text-[11px] font-semibold bg-[var(--teal)]/20 text-[var(--teal-light)] backdrop-blur-sm rounded-full px-2.5 py-0.5 self-start mb-3">{COUNTRY_FLAGS[course.country] || ""} {course.country}</span>}
                  <h3 className="text-white text-[20px] font-bold leading-snug mb-1 group-hover:text-[var(--teal-light)] transition-colors">{course.title}</h3>
                  {course.description && <p className="text-white/60 text-[14px] line-clamp-2 leading-relaxed">{course.description}</p>}
                </div>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.slice(2, 6).map((course) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="group relative rounded-xl overflow-hidden" style={{ minHeight: "180px" }}>
                <img src={course.heroImageUrl || ""} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/90 via-[var(--navy)]/40 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end h-full p-4">
                  {course.country && <span className="text-[10px] font-medium text-white/60 mb-1">{COUNTRY_FLAGS[course.country] || ""} {course.country}</span>}
                  <h3 className="text-white text-[14px] font-semibold leading-snug line-clamp-2 group-hover:text-[var(--teal-light)] transition-colors">{course.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by country ── */}
      <section className="bg-[var(--gray-light)] py-16 px-6">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[12px] font-semibold tracking-[2px] uppercase text-[var(--teal)] mb-2">Explore</p>
          <h2 className="text-[var(--navy)] text-[24px] font-bold mb-8">Browse by Country</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {countryHighlights.map((c) => (
              <button key={c.name} onClick={() => sendMessage(`What's available in ${c.name}?`)}
                className="group bg-white rounded-xl p-4 border border-[var(--slate-light)]/20 hover:border-[var(--teal)]/40 hover:shadow-[0_4px_20px_rgba(145,199,214,0.12)] transition-all text-left cursor-pointer">
                <span className="text-[28px] block mb-2">{c.flag}</span>
                <p className="text-[14px] font-semibold text-[var(--navy)]">{c.name}</p>
                <p className="text-[12px] text-[var(--slate)]">{c.count} program{c.count > 1 ? "s" : ""}</p>
              </button>
            ))}
          </div>
          {countries.length > 6 && (
            <p className="text-center mt-6"><Link href="/courses" className="text-[14px] font-medium text-[var(--slate)] hover:text-[var(--navy)] transition-colors">+ {countries.length - 6} more countries &rarr;</Link></p>
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-semibold tracking-[2px] uppercase text-[var(--red)] mb-2">How it works</p>
            <h2 className="text-[var(--navy)] text-[24px] font-bold">Three steps to AI literacy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard step="01" title="Tell us about yourself" description="Share your role, location, and learning goals. Our AI assistant finds the perfect match from 72+ certified programs." color="var(--teal-ice)" />
            <StepCard step="02" title="Learn practical AI skills" description="Each program covers 5 modules — from AI fundamentals to prompt engineering — adapted for your language and context." color="var(--yellow-light)" />
            <StepCard step="03" title="Earn your certificate" description="Complete your training, get a verifiable certificate, and join 300,000+ learners across Asia-Pacific." color="var(--teal-ice)" />
          </div>
        </div>
      </section>

    </div>
  );
}

function StepCard({ step, title, description, color }: { step: string; title: string; description: string; color: string }) {
  return (
    <div className="rounded-2xl p-6 border border-[var(--slate-light)]/20" style={{ background: color }}>
      <span className="text-[32px] font-bold text-[var(--navy)]/10 block mb-3">{step}</span>
      <h3 className="text-[16px] font-semibold text-[var(--navy)] mb-2">{title}</h3>
      <p className="text-[14px] text-[var(--slate)] leading-relaxed">{description}</p>
    </div>
  );
}

function MiniCourseCard({ course }: { course: Course }) {
  const fmt = Array.isArray(course.format) ? course.format[0] : course.format;
  const lvl = Array.isArray(course.skillLevel) ? course.skillLevel[0] : course.skillLevel;
  return (
    <Link href={`/courses/${course.slug}`} className="group flex gap-3.5 bg-[var(--gray-light)] rounded-xl p-3 hover:bg-[var(--teal-ice)]/60 transition-all">
      {course.heroImageUrl && <img src={course.heroImageUrl} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />}
      <div className="min-w-0 flex-1">
        <h4 className="text-[14px] font-semibold text-[var(--navy)] group-hover:text-[var(--navy-light)] transition-colors line-clamp-1">{course.title}</h4>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {course.country && <span className="text-[12px] text-[var(--slate)]">{course.country}</span>}
          {fmt && <><span className="text-[var(--slate-light)]">&middot;</span><span className="text-[12px] text-[var(--slate)]">{fmt}</span></>}
          {lvl && <><span className="text-[var(--slate-light)]">&middot;</span><span className="text-[12px] text-[var(--slate)]">{lvl}</span></>}
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[var(--slate-light)] group-hover:text-[var(--teal)] transition-colors flex-shrink-0 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
    </Link>
  );
}
