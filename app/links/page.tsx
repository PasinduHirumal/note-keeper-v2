import type { Metadata } from "next";
import LinksClient from "./LinksClient";

export const metadata: Metadata = {
  title: "Saved Links",
  description: "Browse and manage your saved web links and bookmarks. High-priority resources at your fingertips.",
};

export default function LinksPage() {
  return <LinksClient />;
}
