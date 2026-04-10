"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SavedLink } from "@/lib/types";
import LinkCard from "../components/LinkCard";
import { Plus } from "lucide-react";
import { useToast } from "@/lib/ToastContext";
import Loader from "../components/Loader";
import LinkAddModal from "../components/modals/LinkAddModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";

export default function LinksPage() {
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useLocalStorage<SavedLink[]>("keeper-bookmarks", []);
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = (url: string, title: string, priority: "low" | "medium" | "high") => {
    let finalUrl = url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newLink: SavedLink = {
      id: crypto.randomUUID(),
      title: title || "",
      url: finalUrl,
      createdAt: Date.now(),
      priority: priority,
    };
    
    setLinks([newLink, ...links]);
    toast.success("Link saved successfully");
    setIsAdding(false);
    setNewUrl("");
    setNewTitle("");
    setNewPriority("low");
  };

  const confirmDelete = () => {
    if (linkToDelete) {
      setLinks(links.filter(b => b.id !== linkToDelete));
      toast.info("Link removed");
      setLinkToDelete(null);
    }
  };

  if (!mounted) return <Loader message="Loading Links..." />;

  const filteredLinks = links.filter(link => {
    if (activeTab === "all") return true;
    return link.priority === activeTab;
  });

  return (
    <div className="p-8 h-full flex flex-col relative w-full">
      <div className="flex justify-between items-end mb-8 w-full max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Saved Links</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Save important web links for later reading.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center shrink-0"
        >
          <Plus className="w-5 h-5 mr-2 shrink-0" />
          Add Link
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-6 flex space-x-1 sm:space-x-2 border-b border-border/50 pb-px overflow-x-auto">
        {(["all", "high", "medium", "low"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap rounded-t-lg border-b-2 flex-1 sm:flex-none text-center capitalize ${
              activeTab === tab
                ? "border-primary text-primary bg-primary/10"
                : "border-transparent text-gray-500 hover:text-foreground hover:bg-sidebar/50"
            }`}
          >
            {tab === "all" ? "All Links" : `${tab} Priority`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pb-12">
        {links.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-gray-500 bg-sidebar/30">
            <p className="text-lg font-medium mb-2">No links saved</p>
            <p className="text-sm">Click "Add Link" to save a new web page.</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-gray-500 bg-sidebar/30">
            <p className="text-lg font-medium mb-2">No matching links</p>
            <p className="text-sm">You have no links with {activeTab} priority.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLinks.map(link => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={(id) => setLinkToDelete(id)}
              />
            ))}
          </div>
        )}
      </div>

      <LinkAddModal
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
        isOpen={!!linkToDelete}
        onClose={() => setLinkToDelete(null)}
        onConfirm={confirmDelete}
        title="Remove Saved Link?"
        message="Are you sure you want to remove this link?"
      />
    </div>
  );
}
