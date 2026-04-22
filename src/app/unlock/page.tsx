import { headers } from "next/headers";

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; err?: string }>;
}) {
  const { next, err } = await searchParams;
  await headers(); // ensure this is rendered dynamically

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gray-light)] px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,41,68,0.08)]">
        <h1 className="text-[22px] font-bold text-[var(--navy)] mb-2">
          AVPN AI Learning — Demo
        </h1>
        <p className="text-[14px] text-[var(--slate)] mb-6">
          Enter the access PIN to continue.
        </p>
        <form action="/api/unlock" method="POST" className="space-y-4">
          <input type="hidden" name="next" value={next || "/"} />
          <input
            type="password"
            name="pin"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            placeholder="PIN"
            className="w-full h-12 bg-[var(--gray-light)] rounded-xl px-4 text-[15px] text-[var(--navy)] placeholder-[var(--slate-light)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/40 focus:bg-white transition-all"
          />
          {err === "1" && (
            <p className="text-[13px] text-[var(--red)]">
              Incorrect PIN. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[var(--red)] text-white font-semibold hover:bg-[var(--red-dark)] transition-colors cursor-pointer"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
