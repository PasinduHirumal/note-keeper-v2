import type { Metadata } from "next";
import StarredNotesClient from "./StarredNotesClient";

export const metadata: Metadata = {
  title: "Starred Notes",
  description: "Access your most important notes quickly. Your curated list of bookmarked thoughts and ideas.",
};

export default function StarredNotesPage() {
  return <StarredNotesClient />;
}
