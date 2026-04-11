"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { VoiceNote } from "@/lib/types";
import VoiceNoteCard from "../components/VoiceNoteCard";
import { Mic, Search, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/lib/ToastContext";
import Loader from "../components/Loader";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import TabNavigation from "../components/TabNavigation";
import EmptyState from "../components/EmptyState";
import VoiceNoteModal from "../components/modals/VoiceNoteModal";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceNotesClient() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useLocalStorage<VoiceNote[]>("notely-voicenotes", []);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pinned">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleOpenModal = (noteId?: string) => {
    setEditingNoteId(noteId || null);
    setIsModalOpen(true);
  };

  const currentEditingNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : null;

  const handleSaveModal = (title: string, audioData?: string) => {
    if (editingNoteId && currentEditingNote) {
      setNotes(notes.map(n => n.id === editingNoteId ? {
        ...n,
        title: title || n.title
      } : n));
      toast.success("Voice note title updated");
    } else if (audioData) {
      const newNote: VoiceNote = {
        id: crypto.randomUUID(),
        title: title,
        audioData,
        // eslint-disable-next-line react-hooks/purity
        createdAt: Date.now(),
        isPinned: false
      };
      setNotes([newNote, ...notes]);
      toast.success("Voice note saved");
    }

    setIsModalOpen(false);
    setEditingNoteId(null);
  };

  const handleDelete = (id: string) => {
    setNoteToDelete(id);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      setNotes(notes.filter(n => n.id !== noteToDelete));
      toast.info("Voice note deleted");
      setNoteToDelete(null);
    }
  };

  const confirmDeleteAll = () => {
    setNotes([]);
    toast.info("All voice notes deleted");
    setIsDeletingAll(false);
  };

  const handleTogglePin = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  if (!mounted) return <Loader message="Loading Voice Notes..." />;

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "pinned") {
      return note.isPinned;
    }
    return true;
  });

  const contentKey =
    notes.length === 0
      ? "empty-all"
      : filteredNotes.length === 0
        ? searchQuery.trim()
          ? "empty-search"
          : "empty-tab"
        : "notes-grid";

  return (
    <div className="p-4 h-full flex flex-col relative w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 w-full max-w-5xl mx-auto gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Voice Notes</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Record your thoughts instantly.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search voice notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-sm text-foreground placeholder:text-gray-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {notes.length > 0 && (
              <button
                onClick={() => setIsDeletingAll(true)}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete All Voice Notes"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 rounded-lg gap-2 font-medium shadow-sm transition-all flex items-center shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Mic className="w-5 h-5 shrink-0" />
              <span className="hidden sm:block">New Record</span>
            </button>
          </div>
        </div>
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab as "all" | "pinned"); setSearchQuery(""); }}
        tabs={[
          { id: "all", label: "All Notes" },
          { id: "pinned", label: "Pinned" },
        ]}
      />

      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pb-12">
        <AnimatePresence mode="wait">
          {contentKey === "empty-all" ? (
            <EmptyState
              key="empty-all"
              icon={<Mic className="w-12 h-12" />}
              title="No voice notes yet"
              description="Click 'New Record' to capture your first audio memo."
            />
          ) : contentKey === "empty-search" ? (
            <EmptyState
              key="empty-search"
              icon={<Search className="w-10 h-10" />}
              title="No matching notes"
              description={<>Nothing matched &ldquo;{searchQuery}&rdquo;.<br />Try a different search term.</>}
            />
          ) : contentKey === "empty-tab" ? (
            <EmptyState
              key="empty-tab"
              icon={<AlertCircle className="w-10 h-10" />}
              title="No pinned notes"
              description="You have no pinned voice notes."
            />
          ) : (
            <motion.div
              key="notes-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
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
                    <VoiceNoteCard
                      note={note}
                      onEdit={() => handleOpenModal(note.id)}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VoiceNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNoteId(null);
        }}
        onSave={handleSaveModal}
        isEditing={!!editingNoteId}
        initialTitle={currentEditingNote?.title}
      />

      <DeleteConfirmModal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Voice Note?"
        message="Are you sure you want to delete this voice note? This action cannot be undone."
      />

      <DeleteConfirmModal
        isOpen={isDeletingAll}
        onClose={() => setIsDeletingAll(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Voice Notes?"
        message="Are you sure you want to delete all voice notes? This action will permanently remove all your voice recordings and cannot be undone."
      />
    </div>
  );
}
