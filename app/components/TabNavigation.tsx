import React from "react";

interface TabItem<T extends string> {
  id: T;
  label: string;
}

interface TabNavigationProps<T extends string> {
  tabs: readonly TabItem<T>[] | TabItem<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export default function TabNavigation<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps<T>) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-6 flex space-x-1 sm:space-x-2 border-b border-border/50 pb-px overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap rounded-t-lg border-b-2 flex-1 sm:flex-none text-center ${activeTab === tab.id
              ? "border-primary text-primary bg-primary/10"
              : "border-transparent text-gray-500 hover:text-foreground hover:bg-sidebar/50"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
