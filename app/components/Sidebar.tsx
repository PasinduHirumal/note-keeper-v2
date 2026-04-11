"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookMarked, StickyNote, Sun, Moon, Plus, Menu, X, Star, Globe, Mic } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SavedLink } from "@/lib/types";
import { useToast } from "@/lib/ToastContext";
import LinkAddModal from "./modals/LinkAddModal";

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [linksState, setLinksState] = useLocalStorage<SavedLink[]>("notely-bookmarks", []);
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

    const newSavedLink: SavedLink = {
      id: crypto.randomUUID(),
      title: title || "",
      url: finalUrl,
      createdAt: Date.now(),
      priority: priority,
    };

    setLinksState([newSavedLink, ...linksState]);
    toast.success("Link saved quickly");
    setIsAdding(false);
    setNewUrl("");
    setNewTitle("");
    setNewPriority("low");
  };

  const links = [
    { name: "Notes", href: "/notes", icon: StickyNote },
    { name: "Voice Notes", href: "/voice-notes", icon: Mic },
    { name: "Starred", href: "/bookmarks", icon: Star },
    { name: "Links", href: "/links", icon: Globe },
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden shrink-0 w-full h-16 bg-sidebar backdrop-blur-2xl border-b border-border flex items-center justify-between px-4 z-30">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Notely Logo" width={28} height={28} className="rounded-[8px] shadow-md mr-2.5" />
          <span className="text-xl font-bold text-foreground tracking-tight">Notely</span>
        </div>
        <div className="flex items-center space-x-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full hover:bg-border/50 text-foreground transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <button onClick={() => setIsMobileOpen(true)} className="p-1.5 text-foreground hover:bg-border/50 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-sidebar backdrop-blur-2xl border-r border-border flex flex-col transition-transform duration-300 shadow-2xl md:relative md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 hidden md:flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Notely Logo" width={32} height={32} className="rounded-xl shadow-lg shadow-primary/20 mr-3 hidden sm:block" />
            <span className="text-xl font-bold text-sidebar-foreground tracking-tight">
              Notely
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

        <div className="h-16 flex md:hidden items-center justify-between px-6 border-b border-border shrink-0">
          <span className="text-xl font-bold text-sidebar-foreground tracking-tight">Menu</span>
          <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-border/50 text-sidebar-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "hover:bg-sidebar-foreground/10"
                  }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-primary-foreground" : "text-gray-500 group-hover:text-sidebar-foreground"
                  }`} />
                <span className={`font-medium ${isActive ? "text-primary-foreground" : "text-sidebar-foreground"
                  }`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4">
          <button
            onClick={() => { setIsAdding(true); setIsMobileOpen(false); }}
            className="w-full flex items-center justify-center space-x-2 py-2 border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-lg text-sm text-foreground font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Link</span>
          </button>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-center">
          <span className="text-xs text-sidebar-foreground font-medium opacity-60">
            Notely v2.0
          </span>
        </div>

        {mounted && createPortal(
          <LinkAddModal
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
    </>
  );
}
