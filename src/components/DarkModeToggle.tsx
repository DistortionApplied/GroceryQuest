"use client";

import { useDarkMode } from "./DarkModeProvider";

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <span className="text-gray-700 dark:text-gray-300">🌙</span>
      ) : (
        <span className="text-yellow-500">☀️</span>
      )}
    </button>
  );
}