"use client";

import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-gray-500 bg-sidebar/30 p-6 text-center"
    >
      {icon && (
        <motion.div
          initial={{ rotate: -15, opacity: 0 }}
          animate={{ rotate: 0, opacity: 0.6 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          className="mb-4 flex items-center justify-center transition-opacity"
        >
          {icon}
        </motion.div>
      )}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
        className="text-lg font-medium mb-2"
      >
        {title}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-sm"
      >
        {description}
      </motion.div>
    </motion.div>
  );
}
