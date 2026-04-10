"use client";

import { Note } from "@/lib/types";
import { Trash2, Edit } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const dateStr = new Date(note.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-card-foreground line-clamp-1 wrap-break-word">{note.title || "Untitled Note"}</h3>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
          <button onClick={() => onEdit(note)} className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(note.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm flex-1 whitespace-pre-wrap line-clamp-4 leading-relaxed wrap-break-word">
        {note.content}
      </p>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-sidebar-foreground opacity-60">
        <span>{dateStr}</span>
      </div>
    </div>
  );
}
