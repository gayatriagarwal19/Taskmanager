"use client";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-x-0 border-t-0 border-b border-border-muted px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Colorful Gradient App Brand Icon */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-xl font-black tracking-tight text-foreground">
          Vivid<span className="text-brand-purple">Tasks</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User profile tag */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-input-bg border border-input-border text-xs text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {user.email}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-text-muted hover:text-foreground bg-input-bg border border-input-border transition-all cursor-pointer flex items-center justify-center"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-foreground bg-input-bg hover:bg-card-hover-bg border border-input-border rounded-xl transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
