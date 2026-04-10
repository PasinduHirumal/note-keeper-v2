"use client";

import { Bookmark } from "@/lib/types";
import { ExternalLink, Trash2, Globe } from "lucide-react";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const dateStr = new Date(bookmark.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  let domain = bookmark.url;
  try {
    domain = new URL(bookmark.url).hostname.replace('www.', '');
  } catch (e) {
  }

  return (
    <a 
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-card border border-border rounded-xl p-4 flex flex-col hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3 pr-4 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-medium text-card-foreground truncate">{bookmark.title || domain}</h3>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onDelete(bookmark.id);
          }} 
          className="p-1.5 text-gray-500 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100 shrink-0" 
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-auto pt-2">
        <ExternalLink className="w-3.5 h-3.5 mr-1.5 shrink-0" />
        <span className="truncate">{domain}</span>
        <span className="ml-auto text-xs opacity-60 shrink-0">{dateStr}</span>
      </div>
    </a>
  );
}
