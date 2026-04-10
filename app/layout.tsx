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
  title: "Keeper - Personal Notes & Links",
  description: "A premium pers note saving and link bookmarking application. Keep all your personal thoughts, ideas, and URLs powerfully organized.",
  keywords: ["pers", "personal", "notes", "bookmarks", "keeper", "productivity", "links", "organizer", "web clippings"],
  authors: [{ name: "Keeper" }],
  openGraph: {
    title: "Keeper - Personal Notes & Links",
    description: "Your advanced personal note keeping and bookmark app.",
    type: "website",
    siteName: "Keeper",
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
