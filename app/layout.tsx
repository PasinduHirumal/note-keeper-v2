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
  metadataBase: new URL("https://notely-premium.vercel.app"),
  title: {
    default: "Notely — Personal Notes & Links",
    template: "%s | Notely"
  },
  description: "A premium personal note-taking and link bookmarking application. Organize your thoughts, ideas, and URLs effortlessly.",
  keywords: ["personal notes", "link bookmarks", "notely", "productivity app", "note taking", "web clipper", "digital garden", "knowledge management"],
  authors: [{ name: "Notely" }],
  creator: "Notely",
  publisher: "Notely",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Notely — Personal Notes & Links",
    description: "Your premium personal note-taking and bookmark app. Organize everything in one place.",
    url: "https://notely-premium.vercel.app",
    siteName: "Notely",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Notely Application Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notely — Personal Notes & Links",
    description: "Your premium personal note-taking and bookmark app.",
    images: ["/og-image.png"],
    creator: "@notely",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
    ],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Notely",
  description: "A premium personal note-taking and link bookmarking application.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  url: "https://notely-premium.vercel.app",
  author: {
    "@type": "Organization",
    name: "Notely",
    logo: "https://notely-premium.vercel.app/logo.png"
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased flex flex-col md:flex-row overflow-hidden bg-background text-foreground transition-colors duration-500`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
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
