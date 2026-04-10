"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";

interface LinkAddModalProps {
  isOpen: boolean;
  isEditing?: boolean;
  onClose: () => void;
  onSave: (url: string, title: string, priority: "low" | "medium" | "high") => void;
  url: string;
  setUrl: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  priority: "low" | "medium" | "high";
  setPriority: (v: "low" | "medium" | "high") => void;
}

export default function LinkAddModal({
  isOpen, isEditing, onClose, onSave, url, setUrl, title, setTitle, priority, setPriority
}: LinkAddModalProps) {
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
            className="bg-card backdrop-blur-2xl w-full max-w-md rounded-2xl shadow-2xl flex flex-col border border-border overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-border bg-sidebar/50">
              <h2 className="text-lg font-semibold text-foreground">{isEditing ? "Edit Link" : "Add Link"}</h2>
              <button onClick={onClose} className="p-1 text-gray-500 hover:text-foreground rounded-md transition-colors">
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
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-transparent border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-gray-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Priority</label>
                <div className="flex space-x-3">
                  {(["low", "medium", "high"] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                        priority === p
                          ? p === "high" ? "bg-red-500/10 border-red-500/50 text-red-500" 
                            : p === "medium" ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
                            : "bg-blue-500/10 border-blue-500/50 text-blue-500"
                          : "bg-transparent border-border text-gray-500 hover:bg-border/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-sidebar/50 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 hover:bg-border/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(url, title, priority)}
                disabled={!url.trim()}
                className="bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
