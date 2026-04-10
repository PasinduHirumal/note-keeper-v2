"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bookmark } from "@/lib/types";
import BookmarkCard from "../components/BookmarkCard";
import { Plus } from "lucide-react";
import { useToast } from "@/lib/ToastContext";
import Loader from "../components/Loader";
import BookmarkAddModal from "../components/modals/BookmarkAddModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";

export default function BookmarksPage() {
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("keeper-bookmarks", []);
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = (url: string, title: string, priority: "low" | "medium" | "high") => {
    let finalUrl = url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newBookmark: Bookmark = {
      id: crypto.randomUUID(),
      title: title || "",
      url: finalUrl,
      createdAt: Date.now(),
      priority: priority,
    };
    
    setBookmarks([newBookmark, ...bookmarks]);
    toast.success("Bookmark added successfully");
    setIsAdding(false);
    setNewUrl("");
    setNewTitle("");
    setNewPriority("low");
  };

  const confirmDelete = () => {
    if (bookmarkToDelete) {
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkToDelete));
      toast.info("Bookmark removed");
      setBookmarkToDelete(null);
    }
  };

  if (!mounted) return <Loader message="Loading Bookmarks..." />;

  return (
    <div className="p-8 h-full flex flex-col relative w-full">
      <div className="flex justify-between items-end mb-8 w-full max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bookmarks</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Save links for later reading.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center shrink-0"
        >
          <Plus className="w-5 h-5 mr-2 shrink-0" />
          Add Link
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pb-12">
        {bookmarks.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-gray-500 bg-sidebar/30">
            <p className="text-lg font-medium mb-2">No bookmarks saved</p>
            <p className="text-sm">Click "Add Link" to save a new web page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookmarks.map(bookmark => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={(id) => setBookmarkToDelete(id)}
              />
            ))}
          </div>
        )}
      </div>

      <BookmarkAddModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSave={handleSave}
        url={newUrl}
        setUrl={setNewUrl}
        title={newTitle}
        setTitle={setNewTitle}
        priority={newPriority}
        setPriority={setNewPriority}
      />

      <DeleteConfirmModal
        isOpen={!!bookmarkToDelete}
        onClose={() => setBookmarkToDelete(null)}
        onConfirm={confirmDelete}
        title="Remove Bookmark?"
        message="Are you sure you want to remove this bookmark?"
      />
    </div>
  );
}
