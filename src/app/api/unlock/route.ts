import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

const COOKIE_NAME = "avpn_auth";
const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function signCookie(secret: string): string {
  const payload = JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + SEVEN_DAYS_SECONDS,
  });
  const payloadBuf = Buffer.from(payload, "utf-8");
  const sig = createHmac("sha256", secret).update(payloadBuf).digest();
  return `${b64url(payloadBuf)}.${b64url(sig)}`;
}

async function readInput(req: Request): Promise<{ pin: string; next: string }> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      return {
        pin: typeof body?.pin === "string" ? body.pin : "",
        next: typeof body?.next === "string" ? body.next : "/",
      };
    } catch {
      return { pin: "", next: "/" };
    }
  }

  // Default: form-urlencoded submission from the server-rendered unlock page
  try {
    const form = await req.formData();
    return {
      pin: (form.get("pin") as string) || "",
      next: (form.get("next") as string) || "/",
    };
  } catch {
    return { pin: "", next: "/" };
  }
}

export async function POST(req: Request) {
  const expectedPin = process.env.SITE_PIN;
  const secret = process.env.PIN_COOKIE_SECRET;
  const origin = new URL(req.url).origin;

  if (!expectedPin || !secret) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const contentType = req.headers.get("content-type") || "";
  const wantsJson = contentType.includes("application/json");
  const { pin, next } = await readInput(req);

  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (!pin) {
    return wantsJson
      ? NextResponse.json({ error: "Missing PIN" }, { status: 400 })
      : NextResponse.redirect(new URL(`/unlock?err=1&next=${encodeURIComponent(safeNext)}`, origin), 303);
  }

  // Constant-time compare
  const a = Buffer.from(pin);
  const b = Buffer.from(expectedPin);
  const aPadded = Buffer.alloc(Math.max(a.length, b.length));
  const bPadded = Buffer.alloc(Math.max(a.length, b.length));
  a.copy(aPadded);
  b.copy(bPadded);
  const match = a.length === b.length && timingSafeEqual(aPadded, bPadded);

  if (!match) {
    return wantsJson
      ? NextResponse.json({ error: "Incorrect PIN" }, { status: 401 })
      : NextResponse.redirect(new URL(`/unlock?err=1&next=${encodeURIComponent(safeNext)}`, origin), 303);
  }

  const cookieValue = signCookie(secret);
  const res = wantsJson
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL(safeNext, origin), 303);
  res.cookies.set({
    name: COOKIE_NAME,
    value: cookieValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS_SECONDS,
  });
  return res;
}
