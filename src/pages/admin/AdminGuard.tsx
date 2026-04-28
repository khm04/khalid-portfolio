/**
 * AdminGuard — wrap admin pages with this.
 * - While loading auth state: renders a spinner
 * - If not signed in: redirects to /admin/login
 * - If signed in but not the admin email: shows a polite "not authorized"
 * - If signed in and admin: renders children
 */
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[oklch(0.72_0.12_65)]" size={24} />
      </div>
    );
  }

  if (!user) return <Redirect to="/admin/login" />;

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p
          className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase"
          style={{ fontFamily: "var(--font-body)" }}
        >
          — Not authorized
        </p>
        <h1
          className="text-4xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          You're signed in as{" "}
          <em className="text-[oklch(0.72_0.12_65)]">{user.email}</em>
        </h1>
        <p
          className="text-[oklch(0.55_0.02_75)] max-w-md"
          style={{ fontFamily: "var(--font-body)" }}
        >
          That email isn't allowed to manage this site. Sign out and use the
          admin email.
        </p>
        <button
          onClick={() => signOut()}
          className="px-8 py-3 border border-[oklch(0.72_0.12_65/0.5)] text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.25em] uppercase hover:bg-[oklch(0.72_0.12_65/0.1)] transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Sign out
        </button>
      </main>
    );
  }

  return <>{children}</>;
}
