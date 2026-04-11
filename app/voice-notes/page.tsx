import type { Metadata } from "next";
import VoiceNotesClient from "./VoiceNotesClient";

export const metadata: Metadata = {
  title: "Voice Notes",
  description: "Record and manage your voice memos directly within Notely.",
};

export default function VoiceNotesPage() {
  return <VoiceNotesClient />;
}
