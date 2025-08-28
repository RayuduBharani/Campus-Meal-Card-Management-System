// app/unauthorized/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Unauthorized | 401/403",
  description: "Access denied page for unauthenticated or unauthorized users.",
};

export default function UnauthorizedPage() {
  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6 bg-background">
      <section className="w-full max-w-xl text-center rounded-2xl border shadow-sm p-10 space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full border flex items-center justify-center">
          <Lock className="w-7 h-7" aria-hidden />
          <span className="sr-only">Locked</span>
        </div>

        <header className="space-y-2">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">Error 401 / 403</p>
          <h1 className="text-2xl sm:text-3xl font-semibold">Access denied</h1>
          <p className="text-muted-foreground">
            You don’t have permission to view this page. You may need to log in
            or request a higher role.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium border hover:shadow-sm transition"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium bg-foreground text-background hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>

        <details className="text-left text-sm text-muted-foreground/90 pt-2">
          <summary className="cursor-pointer select-none">Why am I seeing this?</summary>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Not logged in (send users to <code>/login</code>).</li>
            <li>Logged in but missing required role/permission.</li>
            <li>Link expired or resource was removed.</li>
          </ul>
        </details>
      </section>
    </main>
  );
}
