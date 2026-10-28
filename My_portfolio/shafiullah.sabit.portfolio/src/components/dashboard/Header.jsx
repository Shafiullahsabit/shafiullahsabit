import React from "react";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import DashboardNotifications from "./DashboardNotifications";

const Header = ({
  title,
  onMenuToggle,
  theme,
  onThemeToggle,
  onNavigate,
}) => {
  const isLightTheme = theme === "light";

  return (
    <header
      className="
        flex items-center justify-between gap-3
        rounded-2xl border border-white/10
        bg-white/[0.04] px-4 py-4 backdrop-blur-xl sm:px-6
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Open dashboard navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition hover:border-cyan-400/30 hover:text-cyan-200 lg:hidden"
        >
          <FaBars />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold sm:text-2xl">
            Admin <span className="text-cyan-400">/ {title}</span>
          </h1>
          <p className="mt-1 text-xs text-white/45 sm:text-sm">
            Portfolio management
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <DashboardNotifications onNavigate={onNavigate} />
        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-200/80">
            Admin session
          </span>
        </div>
        <button
          type="button"
          onClick={onThemeToggle}
          aria-label={`Switch to ${isLightTheme ? "dark" : "light"} mode`}
          aria-pressed={isLightTheme}
          title={`Switch to ${isLightTheme ? "dark" : "light"} mode`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition hover:border-cyan-400/40 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          {isLightTheme ? (
            <FaMoon aria-hidden="true" />
          ) : (
            <FaSun aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
