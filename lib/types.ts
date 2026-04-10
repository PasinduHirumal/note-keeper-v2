export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}
