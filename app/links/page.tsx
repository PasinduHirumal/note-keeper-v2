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
import TabNavigation from "../components/TabNavigation";
import EmptyState from "../components/EmptyState";
import { Filter, BookmarkMinus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinksPage() {
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useLocalStorage<SavedLink[]>("keeper-bookmarks", []);
  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [currentLinkId, setCurrentLinkId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("low");
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEdit = (link: SavedLink) => {
    setCurrentLinkId(link.id);
    setNewUrl(link.url);
    setNewTitle(link.title);
    setNewPriority(link.priority || "low");
    setIsAdding(true);
  };

  const handleSave = (url: string, title: string, priority: "low" | "medium" | "high") => {
    let finalUrl = url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    if (currentLinkId) {
      setLinks(links.map(l => l.id === currentLinkId ? {
        ...l,
        url: finalUrl,
        title: title || "",
        priority: priority
      } : l));
      toast.success("Link updated successfully");
    } else {
      const newLink: SavedLink = {
        id: crypto.randomUUID(),
        title: title || "",
        url: finalUrl,
        createdAt: Date.now(),
        priority: priority,
      };
      setLinks([newLink, ...links]);
      toast.success("Link saved successfully");
    }

    setIsAdding(false);
    setCurrentLinkId(null);
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

  // Compute a stable key so AnimatePresence can fade between states
  const contentKey =
    links.length === 0
      ? "empty-all"
      : filteredLinks.length === 0
      ? "empty-tab"
      : "links-grid";

  return (
    <div className="p-4 h-full flex flex-col relative w-full">
      <div className="flex justify-between items-end mb-8 w-full max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Saved Links</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Save important web links for later reading.</p>
        </div>
        <button
          onClick={() => {
            setCurrentLinkId(null);
            setNewUrl("");
            setNewTitle("");
            setNewPriority("low");
            setIsAdding(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center shrink-0"
        >
          <Plus className="w-5 h-5 mr-2 shrink-0" />
          Add Link
        </button>
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); }}
        tabs={[
          { id: "all", label: "All Links" },
          { id: "high", label: "High Priority" },
          { id: "medium", label: "Medium Priority" },
          { id: "low", label: "Low Priority" },
        ]}
      />

      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pb-12">
        <AnimatePresence mode="wait">
          {contentKey === "empty-all" ? (
            <EmptyState
              key="empty-all"
              icon={<BookmarkMinus className="w-12 h-12" />}
              title="No links saved yet"
              description="Click 'Add Link' to save a new web page."
            />
          ) : contentKey === "empty-tab" ? (
            <EmptyState
              key="empty-tab"
              icon={<Filter className="w-10 h-10" />}
              title="No matching links"
              description={`You have no ${activeTab} priority links.`}
            />
          ) : (
            <motion.div
              key="links-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredLinks.map(link => (
                  <motion.div
                    key={link.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LinkCard
                      link={link}
                      onEdit={handleEdit}
                      onDelete={(id) => setLinkToDelete(id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LinkAddModal
        isOpen={isAdding}
        isEditing={!!currentLinkId}
        onClose={() => {
          setIsAdding(false);
          setCurrentLinkId(null);
        }}
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
