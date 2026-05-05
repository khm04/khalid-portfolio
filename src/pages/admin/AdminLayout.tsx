/**
 * AdminLayout — persistent sidebar + content area for all admin pages.
 * Sidebar collapses to icons on mobile.
 */
import { useAuth } from "@/lib/useAuth";
import {
  MessageSquare, Image, Film,
  Award, Star, Home, LogOut, Menu, X, ChevronRight, Settings,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { icon: MessageSquare,  label: "Messages",     href: "/admin/messages" },
  { icon: Image,          label: "Frames",       href: "/admin/frames" },
  { icon: Film,           label: "Videos",       href: "/admin/videos" },
  { icon: Award,          label: "Certificates", href: "/admin/certificates" },
  { icon: Star,           label: "Testimonials", href: "/admin/testimonials" },
  { icon: Settings,       label: "Settings",     href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`
        flex flex-col h-full
        ${mobile ? "w-full" : "w-64 min-w-[16rem]"}
        bg-[oklch(0.17_0.018_55)] border-r border-white/5
      `}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/" className="block">
          <span
            className="text-xl font-bold text-[oklch(0.92_0.02_75)] tracking-tight block"
            style={{ fontFamily: "var(--font-display)" }}
          >
            KHALID
          </span>
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-[oklch(0.72_0.12_65)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <Link
          href="/admin"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-none group ${
            location === "/admin"
              ? "bg-[oklch(0.72_0.12_65/0.12)] text-[oklch(0.72_0.12_65)]"
              : "text-[oklch(0.60_0.02_75)] hover:text-[oklch(0.92_0.02_75)] hover:bg-white/5"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Home size={15} />
          <span className="text-[11px] tracking-[0.15em] uppercase">Overview</span>
          {location === "/admin" && (
            <ChevronRight size={12} className="ml-auto" />
          )}
        </Link>

        <div
          className="text-[9px] tracking-[0.3em] uppercase text-[oklch(0.35_0.02_75)] px-3 pt-4 pb-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Manage
        </div>

        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = location === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors group ${
                isActive
                  ? "bg-[oklch(0.72_0.12_65/0.12)] text-[oklch(0.72_0.12_65)]"
                  : "text-[oklch(0.60_0.02_75)] hover:text-[oklch(0.92_0.02_75)] hover:bg-white/5"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Icon size={15} />
              <span className="text-[11px] tracking-[0.15em] uppercase">{label}</span>
              {isActive && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="px-4 py-4 border-t border-white/5">
        <p
          className="text-[oklch(0.45_0.02_75)] text-[9px] tracking-widest uppercase truncate mb-2 px-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {user?.email}
        </p>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 w-full px-3 py-2 text-[oklch(0.55_0.02_75)] hover:text-[oklch(0.72_0.12_65)] hover:bg-white/5 transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <LogOut size={13} />
          <span className="text-[10px] tracking-[0.2em] uppercase">Sign out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-72" onClick={(e) => e.stopPropagation()}>
            <Sidebar mobile />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-white/5 bg-[oklch(0.17_0.018_55)] flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-[oklch(0.92_0.02_75)] p-1"
          >
            <Menu size={20} />
          </button>
          <span
            className="text-[oklch(0.92_0.02_75)] text-lg font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            KHALID
          </span>
          <Link href="/" className="text-[oklch(0.55_0.02_75)] p-1">
            <X size={20} />
          </Link>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
