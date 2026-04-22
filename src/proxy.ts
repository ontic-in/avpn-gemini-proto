import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "avpn_auth";

// Paths that bypass the PIN gate
const PUBLIC_PREFIXES = [
  "/unlock",
  "/api/unlock",
  "/_next",
  "/favicon.ico",
  "/images",
  "/brand",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(p));
}

function b64urlToBuffer(s: string): ArrayBuffer {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + ((4 - (s.length % 4)) % 4), "=");
  const binary = atob(padded);
  const buf = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return buf;
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function verifyCookie(cookie: string, secret: string): Promise<boolean> {
  const parts = cookie.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;

  let payloadBuf: ArrayBuffer;
  let sigBuf: ArrayBuffer;
  try {
    payloadBuf = b64urlToBuffer(payloadB64);
    sigBuf = b64urlToBuffer(sigB64);
  } catch {
    return false;
  }

  const secretBuf = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    secretBuf.buffer.slice(secretBuf.byteOffset, secretBuf.byteOffset + secretBuf.byteLength),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expectedBuf = await crypto.subtle.sign("HMAC", key, payloadBuf);
  if (!bytesEqual(new Uint8Array(expectedBuf), new Uint8Array(sigBuf))) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(payloadBuf)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.PIN_COOKIE_SECRET;
  if (!secret) {
    // Fail closed so we don't accidentally serve ungated in prod
    return new NextResponse("Server not configured", { status: 500 });
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie && (await verifyCookie(cookie, secret))) {
    return NextResponse.next();
  }

  const unlockUrl = new URL("/unlock", req.url);
  unlockUrl.searchParams.set("next", pathname + search);
  return NextResponse.redirect(unlockUrl);
}

export const config = {
  matcher: [
    // Everything except Next internals and common static files
    "/((?!_next/static|_next/image|images/|brand/|favicon.ico).*)",
  ],
};
