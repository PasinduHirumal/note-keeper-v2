"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { Note } from "@/lib/types";

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  note: Partial<Note>;
  onChange: (note: Partial<Note>) => void;
}

export default function NoteEditorModal({ isOpen, onClose, onSave, note, onChange }: NoteEditorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-card backdrop-blur-2xl w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col border border-border overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-border bg-sidebar/50">
              <h2 className="text-lg font-semibold text-foreground">
                {note.id ? "Edit Note" : "Create Note"}
              </h2>
              <button onClick={onClose} className="p-1 text-gray-500 hover:text-foreground rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Note Title (Optional)"
                value={note.title || ""}
                onChange={(e) => onChange({ ...note, title: e.target.value })}
                className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 text-foreground placeholder:text-gray-400 outline-none"
                autoFocus
              />
              <textarea
                placeholder="Write your note here..."
                value={note.content || ""}
                onChange={(e) => onChange({ ...note, content: e.target.value })}
                className="w-full h-64 resize-none bg-transparent border-none focus:ring-0 p-0 text-foreground placeholder:text-gray-500 outline-none leading-relaxed"
              />
            </div>

            <div className="p-4 border-t border-border bg-sidebar/50 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 hover:bg-border/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(note)}
                disabled={!note.content || !note.content.trim()}
                className="bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
