"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bookmark } from "@/lib/types";
import BookmarkCard from "../components/BookmarkCard";
import { Plus, X, Globe } from "lucide-react";
import { useToast } from "@/lib/ToastContext";

export default function BookmarksPage() {
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("keeper-bookmarks", []);
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (!newUrl.trim()) {
      toast.error("Please enter a valid URL first");
      return;
    }
    
    let finalUrl = newUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newBookmark: Bookmark = {
      id: crypto.randomUUID(),
      title: newTitle || "",
      url: finalUrl,
      createdAt: Date.now(),
    };
    
    setBookmarks([newBookmark, ...bookmarks]);
    toast.success("Bookmark added successfully");
    setIsAdding(false);
    setNewUrl("");
    setNewTitle("");
  };

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
    toast.info("Bookmark removed");
  };

  if (!mounted) return null;

  return (
    <div className="p-8 h-full flex flex-col relative w-full">
      <div className="flex justify-between items-end mb-8 w-full max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bookmarks</h1>
          <p className="text-gray-500 mt-1">Save links for later reading.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
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
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl flex flex-col border border-border overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border bg-sidebar">
              <h2 className="text-lg font-semibold text-foreground">Add Bookmark</h2>
              <button onClick={() => setIsAdding(false)} className="p-1 text-gray-500 hover:text-foreground rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5 ">URL</label>
                <div className="flex items-center border border-border rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <div className="px-3 text-gray-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 py-2 pr-3 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-gray-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Title (Optional)</label>
                <input
                  type="text"
                  placeholder="Website Name"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-transparent border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-gray-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-sidebar flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 font-medium text-gray-600 hover:bg-border/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!newUrl.trim()}
                className="bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
