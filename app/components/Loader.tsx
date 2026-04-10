"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 w-full h-full flex-1">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="w-10 h-10 text-primary" />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm text-gray-500 font-medium"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
