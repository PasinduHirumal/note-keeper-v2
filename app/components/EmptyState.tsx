import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-gray-500 bg-sidebar/30 p-6 text-center">
      {icon && <div className="mb-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">{icon}</div>}
      <p className="text-lg font-medium mb-2">{title}</p>
      <div className="text-sm">{description}</div>
    </div>
  );
}
