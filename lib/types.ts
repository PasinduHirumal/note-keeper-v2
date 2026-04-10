export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isBookmarked?: boolean;
}

export interface SavedLink {
  id: string;
  title: string;
  url: string;
  createdAt: number;
  priority?: "low" | "medium" | "high";
}
