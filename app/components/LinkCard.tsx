"use client";

import { SavedLink } from "@/lib/types";
import { ExternalLink, Trash2, Globe, Edit } from "lucide-react";

interface LinkCardProps {
  link: SavedLink;
  onEdit: (link: SavedLink) => void;
  onDelete: (id: string) => void;
}

export default function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const dateStr = new Date(link.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  let domain = link.url;
  try {
    domain = new URL(link.url).hostname.replace('www.', '');
  } catch (e) {
  }

  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };
  const pColor = link.priority ? priorityColors[link.priority] : priorityColors.low;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-card backdrop-blur-2xl border border-border rounded-xl p-4 flex flex-col hover:border-primary/50 hover:shadow-lg shadow-xl transition-all duration-200 group relative"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 pr-16 overflow-hidden w-full">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col items-start overflow-hidden w-full">
            <h3 className="font-medium text-card-foreground truncate w-full">{link.title || domain}</h3>
            {link.priority && (
              <span className={`mt-1.5 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${pColor} inline-block`}>
                {link.priority}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-card/80 backdrop-blur-sm rounded-md p-0.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(link);
            }}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors shrink-0"
            title="Edit link"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(link.id);
            }}
            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors shrink-0"
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
