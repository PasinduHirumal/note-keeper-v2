import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "@/lib/ToastContext";
import { ThemeProvider } from "./components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notely — Personal Notes & Links",
  description: "A premium personal note-taking and link bookmarking application. Organize your thoughts, ideas, and URLs effortlessly.",
  keywords: ["personal", "notes", "bookmarks", "notely", "productivity", "links", "organizer", "web clippings"],
  authors: [{ name: "Notely" }],
  openGraph: {
    title: "Notely — Personal Notes & Links",
    description: "Your premium personal note-taking and bookmark app.",
    type: "website",
    siteName: "Notely",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased flex flex-col md:flex-row overflow-hidden bg-background text-foreground transition-colors duration-500`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <Sidebar />
            <main className="flex-1 h-full">
              {children}
            </main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
