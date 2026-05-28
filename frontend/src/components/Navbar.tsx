import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="block h-5 w-5 rounded-md bg-gradient-green shadow-[0_0_18px_-4px_rgba(34,224,122,0.6)]" />
          <span className="font-display text-base font-semibold tracking-tight">
            Greenbook Assistant
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "transition-colors",
                pathname === l.to
                  ? "text-[var(--color-fg)]"
                  : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
