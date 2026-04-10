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

  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };
  const pColor = bookmark.priority ? priorityColors[bookmark.priority] : priorityColors.low;

  return (
    <a 
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-card backdrop-blur-2xl border border-border rounded-xl p-4 flex flex-col hover:border-primary/50 hover:shadow-lg shadow-xl transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3 pr-4 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-medium text-card-foreground truncate">{bookmark.title || domain}</h3>
        </div>
        <div className="flex flex-col items-end shrink-0 ml-2">
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
          {bookmark.priority && (
            <span className={`mt-auto text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${pColor}`}>
              {bookmark.priority}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-auto pt-2">
        <ExternalLink className="w-3.5 h-3.5 mr-1.5 shrink-0" />
        <span className="truncate">{domain}</span>
        <span className="ml-auto text-xs opacity-60 shrink-0">{dateStr}</span>
      </div>
    </a>
  );
}
