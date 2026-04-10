"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Note } from "@/lib/types";
import NoteCard from "../components/NoteCard";
import { Plus, X, Save } from "lucide-react";
import { useToast } from "@/lib/ToastContext";

export default function NotesPage() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useLocalStorage<Note[]>("keeper-notes", []);
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (!currentNote.title && !currentNote.content) {
      toast.error("Please enter a title or content for your note");
      return;
    }
    
    if (currentNote.id) {
      setNotes(notes.map(n => n.id === currentNote.id ? {
        ...n,
        title: currentNote.title || "",
        content: currentNote.content || "",
        updatedAt: Date.now()
      } : n));
      toast.success("Note updated successfully");
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: currentNote.title || "",
        content: currentNote.content || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes([newNote, ...notes]);
      toast.success("Note created successfully");
    }
    closeEditor();
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    toast.info("Note deleted");
  };

  const openEditor = (note?: Note) => {
    if (note) {
      setCurrentNote(note);
    } else {
      setCurrentNote({});
    }
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setCurrentNote({});
  };

  if (!mounted) return null;

  return (
    <div className="p-8 h-full flex flex-col relative w-full">
      <div className="flex justify-between items-end mb-8 w-full max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Notes</h1>
          <p className="text-gray-500 mt-1">Capture your thoughts and ideas.</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pb-12">
        {notes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-gray-500 bg-sidebar/30">
            <p className="text-lg font-medium mb-2">No notes yet</p>
            <p className="text-sm">Click "New Note" to create your first note.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditor}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl flex flex-col border border-border overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border bg-sidebar">
              <h2 className="text-lg font-semibold text-foreground">
                {currentNote.id ? "Edit Note" : "Create Note"}
              </h2>
              <button onClick={closeEditor} className="p-1 text-gray-500 hover:text-foreground rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Note Title"
                value={currentNote.title || ""}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 text-foreground placeholder:text-gray-400 outline-none"
                autoFocus
              />
              <textarea
                placeholder="Write your note here..."
                value={currentNote.content || ""}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                className="w-full h-64 resize-none bg-transparent border-none focus:ring-0 p-0 text-foreground placeholder:text-gray-500 outline-none leading-relaxed"
              />
            </div>

            <div className="p-4 border-t border-border bg-sidebar flex justify-end space-x-3">
              <button
                onClick={closeEditor}
                className="px-4 py-2 font-medium text-gray-600 hover:bg-border/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
