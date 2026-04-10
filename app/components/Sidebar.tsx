"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, StickyNote, LayoutDashboard, Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bookmark } from "@/lib/types";
import { useToast } from "@/lib/ToastContext";
import BookmarkAddModal from "./modals/BookmarkAddModal";

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("keeper-bookmarks", []);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveBookmark = (url: string, title: string, priority: "low" | "medium" | "high") => {
    let finalUrl = url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newBookmark: Bookmark = {
      id: crypto.randomUUID(),
      title: title || "",
      url: finalUrl,
      createdAt: Date.now(),
      priority: priority,
    };
    
    setBookmarks([newBookmark, ...bookmarks]);
    toast.success("Bookmark added quickly");
    setIsAdding(false);
    setNewUrl("");
    setNewTitle("");
    setNewPriority("low");
  };

  const links = [
    { name: "Notes", href: "/notes", icon: StickyNote },
    { name: "Bookmarks", href: "/bookmarks", icon: BookMarked },
  ];

  return (
    <aside className="w-64 h-full bg-sidebar backdrop-blur-2xl border-r border-border flex flex-col transition-all duration-300 shrink-0 shadow-2xl relative z-40">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center">
          <LayoutDashboard className="w-6 h-6 text-primary mr-3" />
          <span className="text-xl font-bold text-sidebar-foreground tracking-tight">
            Keeper
          </span>
        </div>
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

      <div className="px-4 pb-4">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center space-x-2 py-2 border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-lg text-sm text-foreground font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Bookmark</span>
        </button>
      </div>
      
      <div className="p-4 border-t border-border flex items-center justify-center">
        <span className="text-xs text-sidebar-foreground font-medium opacity-60">
          Note Keeper V2
        </span>
      </div>

      {mounted && createPortal(
        <BookmarkAddModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          onSave={handleSaveBookmark}
          url={newUrl}
          setUrl={setNewUrl}
          title={newTitle}
          setTitle={setNewTitle}
          priority={newPriority}
          setPriority={setNewPriority}
        />,
        document.body
      )}
    </aside>
  );
}
