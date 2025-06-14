// src/components/DarkModeToggle.tsx
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference initially
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white text-sm hover:scale-105 transition"
    >
      {isDark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}