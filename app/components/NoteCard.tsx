"use client";

import { Note } from "@/lib/types";
import { Edit, Trash2, Clock, Star } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete, onToggleBookmark }: NoteCardProps) {
  const dateStr = new Date(note.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  return (
    <div
      onClick={() => onEdit(note)}
      className="bg-card backdrop-blur-2xl border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col group shadow-xl h-50 cursor-pointer hover:border-primary/50 relative"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-card-foreground line-clamp-1 wrap-break-word pr-20">{note.title || "Untitled Note"}</h3>
        <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-card/80 backdrop-blur-sm rounded-md p-0.5">
          {onToggleBookmark && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(note.id); }}
              className={`p-1.5 rounded-md transition-colors ${note.isBookmarked ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-500/10' : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10'}`}
              title={note.isBookmarked ? "Remove Star" : "Star Note"}
            >
              <Star className={`w-4 h-4 ${note.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(note); }}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm flex-1 whitespace-pre-wrap line-clamp-6 leading-relaxed wrap-break-word overflow-hidden">
        {note.content || "Empty note"}
      </p>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-sidebar-foreground opacity-60">
        <span>{dateStr}</span>
      </div>
    </div>
  );
}
