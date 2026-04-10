"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, StickyNote, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { name: "Notes", href: "/notes", icon: StickyNote },
    { name: "Bookmarks", href: "/bookmarks", icon: BookMarked },
  ];

  return (
    <aside className="w-64 h-full bg-sidebar backdrop-blur-2xl border-r border-border flex flex-col transition-all duration-300 shrink-0 shadow-2xl">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <LayoutDashboard className="w-6 h-6 text-primary mr-3" />
        <span className="text-xl font-bold text-sidebar-foreground tracking-tight">
          Keeper
        </span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-sidebar-foreground bg-transparent hover:bg-border/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 mr-3 transition-colors ${
                  isActive ? "text-primary-foreground" : "text-gray-500 group-hover:text-sidebar-foreground"
                }`}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-sidebar-foreground font-medium opacity-60">
          Note Keeper V2
        </span>
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-full hover:bg-border/50 text-sidebar-foreground transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
      </div>
    </aside>
  );
}
