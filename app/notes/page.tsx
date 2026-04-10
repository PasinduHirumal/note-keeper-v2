"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Note } from "@/lib/types";
import NoteCard from "../components/NoteCard";
import { Plus, Search, Inbox, FileQuestion } from "lucide-react";
import { useToast } from "@/lib/ToastContext";
import Loader from "../components/Loader";
import NoteEditorModal from "../components/modals/NoteEditorModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import TabNavigation from "../components/TabNavigation";
import EmptyState from "../components/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="p-4 h-full flex flex-col relative w-full">
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

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "all", label: "All Notes" },
          { id: "full", label: "Detailed Notes" },
          { id: "untitled", label: "Content Only" },
        ]}
      />

      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pb-12">
        {notes.length === 0 ? (
          <EmptyState
            icon={<FileQuestion className="w-12 h-12" />}
            title="No notes found"
            description="Click 'New Note' to create your first note."
          />
        ) : filteredNotes.length === 0 ? (
          searchQuery.trim() ? (
            <EmptyState
              icon={<Search className="w-10 h-10" />}
              title="No matching notes found"
              description={<>We couldn't find anything matching "{searchQuery}".<br />Try a different search term.</>}
            />
          ) : (
            <EmptyState
              icon={<Inbox className="w-10 h-10" />}
              title="No notes found"
              description="There are no notes in this category."
            />
          )
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map(note => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <NoteCard
                    note={note}
                    onEdit={openEditor}
                    onDelete={handleDelete}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
