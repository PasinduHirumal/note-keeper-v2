import type { Metadata } from "next";
import NotesClient from "./NotesClient";

export const metadata: Metadata = {
  title: "My Notes",
  description: "View and organize your personal notes in Notely. Capture ideas, meeting minutes, and more.",
};

export default function NotesPage() {
  return <NotesClient />;
}
