"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Note } from "@/lib/types";
import NoteCard from "../components/NoteCard";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/lib/ToastContext";
import Loader from "../components/Loader";
import NoteEditorModal from "../components/modals/NoteEditorModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";

export default function NotesPage() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useLocalStorage<Note[]>("keeper-notes", []);
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({});
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "full" | "untitled">("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (!currentNote.content || !currentNote.content.trim()) {
      toast.error("Note content is required");
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
    setNoteToDelete(id);
  };

  const handleToggleBookmark = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isBookmarked: !note.isBookmarked } : note
    ));
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      setNotes(notes.filter(n => n.id !== noteToDelete));
      toast.info("Note deleted");
      setNoteToDelete(null);
    }
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

  if (!mounted) return <Loader message="Loading Notes..." />;

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    const safeTitle = note.title || "";
    const safeContent = note.content || "";
    const matchesSearch = safeTitle.toLowerCase().includes(query) || safeContent.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (activeTab === "full") {
      return safeTitle.trim().length > 0;
    }
    if (activeTab === "untitled") {
      return safeTitle.trim().length === 0;
    }
    return true; // "all"
  });

  return (
    <div className="p-8 h-full flex flex-col relative w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 w-full max-w-5xl mx-auto gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Notes</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Capture your thoughts and ideas.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-sm text-foreground placeholder:text-gray-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => openEditor()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center shrink-0"
          >
            <Plus className="w-5 h-5 mr-2 shrink-0" />
            New Note
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-6 flex space-x-1 sm:space-x-2 border-b border-border/50 pb-px overflow-x-auto">
        {(["all", "full", "untitled"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap rounded-t-lg border-b-2 flex-1 sm:flex-none text-center ${
              activeTab === tab
                ? "border-primary text-primary bg-primary/10"
                : "border-transparent text-gray-500 hover:text-foreground hover:bg-sidebar/50"
            }`}
          >
            {tab === "all" && "All Notes"}
            {tab === "full" && "Detailed Notes"}
            {tab === "untitled" && "Content Only"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pb-12">
        {notes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-gray-500 bg-sidebar/30">
            <p className="text-lg font-medium mb-2">No notes yet</p>
            <p className="text-sm">Click "New Note" to create your first note.</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-gray-500 bg-sidebar/30">
            <p className="text-lg font-medium mb-2">No matching notes found</p>
            <p className="text-sm text-center">We couldn't find anything matching "{searchQuery}".<br/>Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditor}
                onDelete={handleDelete}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>

      <NoteEditorModal 
        isOpen={isEditing}
        onClose={closeEditor}
        onSave={handleSave}
        note={currentNote}
        onChange={setCurrentNote}
      />

      <DeleteConfirmModal 
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Note?"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
}
