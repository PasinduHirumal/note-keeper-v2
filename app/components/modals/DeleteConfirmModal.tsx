"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone."
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card backdrop-blur-2xl w-full max-w-sm rounded-2xl shadow-2xl flex flex-col border border-border overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
            </div>
            <div className="p-4 border-t border-border bg-sidebar/50 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 hover:bg-border/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
