"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileLayoutProps {
  children: ReactNode;
}

const TITLE_SCREEN_PATH = "/";

export function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/requests", label: "Requests", icon: "📋" },
    { href: "/add", label: "Add", icon: "➕" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  const isOnTitleScreen = pathname === TITLE_SCREEN_PATH;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Main content — no bottom padding on title screen */}
      <main className={isOnTitleScreen ? "flex-1" : "flex-1 pb-16"}>
        {children}
      </main>

      {/* Bottom navigation — hidden on title screen */}
      {!isOnTitleScreen && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
