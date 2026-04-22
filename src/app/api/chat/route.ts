import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAllCourses } from "@/lib/courses";
import { extractMentionedCourses } from "@/lib/match-courses";
import { getSystemPrompt } from "@/lib/avpn-context";
import { DISPLAY_FORM_TOOL } from "@/lib/chat-tools";
import type { FormComponent } from "@/types/chat-component";

export const runtime = "nodejs";
export const maxDuration = 60;

const LEARNER_COUNTRY = "Singapore";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatTurn[];
}

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Missing `message`" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const history = Array.isArray(body.history) ? body.history : [];
  const priorTurns = history
    .filter((t) => t && typeof t.content === "string" && t.content.trim())
    .slice(-10)
    .map<Anthropic.MessageParam>((t) => ({
      role: t.role,
      content: t.content,
    }));

  const contextPreamble =
    `[Session context — visible to the assistant only, not to the learner]\n` +
    `The learner is visiting from: ${LEARNER_COUNTRY}.\n` +
    `Use this as the default country for any form fields or recommendations. ` +
    `Do NOT ask them to re-enter it unless they bring it up themselves.`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: contextPreamble },
    { role: "assistant", content: "Understood — I'll assume that location." },
    ...priorTurns,
    { role: "user", content: message },
  ];

  let responseText = "";
  let component: FormComponent | null = null;
  let stopReason: string | null = null;

  try {
    const client = new Anthropic({ apiKey });
    const result = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      temperature: 0.4,
      system: getSystemPrompt(),
      tools: [DISPLAY_FORM_TOOL],
      messages,
    });

    stopReason = result.stop_reason;

    // Collect text blocks
    responseText = result.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    // Collect the first display_form tool_use, if any
    const toolBlock = result.content.find(
      (block): block is Anthropic.ToolUseBlock =>
        block.type === "tool_use" && block.name === "display_form",
    );
    if (toolBlock) {
      const input = toolBlock.input as Partial<FormComponent> & {
        fields?: FormComponent["fields"];
      };
      if (
        typeof input.id === "string" &&
        typeof input.title === "string" &&
        typeof input.description === "string" &&
        typeof input.ctaLabel === "string" &&
        Array.isArray(input.fields)
      ) {
        component = {
          kind: "form",
          id: input.id,
          title: input.title,
          description: input.description,
          ctaLabel: input.ctaLabel,
          fields: input.fields,
        };
      } else {
        console.warn("Malformed display_form input:", input);
      }
    }

    if (!responseText && !component) {
      console.warn(
        "Claude returned no text and no form. stop_reason=",
        stopReason,
        "full result:",
        JSON.stringify(result),
      );
    }
  } catch (err) {
    console.error("Claude chat error", err);
    return NextResponse.json(
      { error: "Chat request failed" },
      { status: 502 },
    );
  }

  // Safety-block refusal with no content → friendly redirect
  if (!responseText && !component && stopReason === "refusal") {
    return NextResponse.json({
      content:
        "I can't help with that. I'm here to help you discover free AI learning courses on AVPN — try asking things like \"What courses are available for teachers?\" or \"I'm a farmer in India, can you recommend something?\"",
      courses: [],
    });
  }

  if (!responseText && !component) {
    return NextResponse.json(
      { error: "Empty response from model", stopReason },
      { status: 502 },
    );
  }

  // Extract [SUGGESTIONS] line from the response
  let suggestions: string[] = [];
  const suggestionsMatch = responseText.match(/\[SUGGESTIONS\](.+)$/m);
  if (suggestionsMatch) {
    suggestions = suggestionsMatch[1]
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
    responseText = responseText.replace(/\n?\[SUGGESTIONS\].+$/m, "").trim();
  }

  const courses = responseText
    ? extractMentionedCourses(responseText, getAllCourses())
    : [];

  return NextResponse.json({
    content: responseText,
    courses,
    component,
    suggestions,
  });
}
