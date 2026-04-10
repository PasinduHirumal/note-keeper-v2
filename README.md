<div align="center">

# 📝 Keeper — Personal Notes & Links

**A premium personal productivity app for capturing notes, saving links, and starring your most important ideas.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-note--keeper--v2.vercel.app-6366f1?style=for-the-badge)](https://note-keeper-v2-vt97.vercel.app/notes)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

</div>

---

## ✨ Features

- 📝 **Notes** — Create, edit, search, and organize notes with title + content
- 🔗 **Saved Links** — Bookmark web URLs with priority tags (High / Medium / Low)
- ⭐ **Starred Notes** — Pin your most important notes for quick access
- 🔍 **Live Search** — Instantly filter notes and links; search clears on tab switch
- 🗂️ **Tab Filtering** — Filter by category (All / Detailed / Content Only)
- 🌙 **Dark / Light Mode** — System-aware theme with smooth transition
- 💎 **Liquid Glass UI** — Glassmorphic sidebar and sticky headers with `backdrop-blur`
- 📱 **Mobile Responsive** — Optimized layout with sticky search bars on mobile
- 🎞️ **Framer Motion Animations** — Spring-based card, empty state, and page transitions
- 💾 **Offline First** — All data persisted to `localStorage` (no login needed)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Core framework + routing |
| **React 19** | UI Component library |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion 12** | Animations & transitions |
| **next-themes** | Dark/light mode management |
| **Lucide React** | Icon library |
| **localStorage** | Client-side data persistence |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18+`
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/PasinduHirumal/note-keeper-v2.git
cd note-keeper-v2

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
note-keeper-v2/
├── app/
│   ├── components/         # Reusable UI components
│   │   ├── Sidebar.tsx     # Navigation sidebar (with mobile menu)
│   │   ├── NoteCard.tsx    # Note display card
│   │   ├── LinkCard.tsx    # Saved link card
│   │   ├── EmptyState.tsx  # Animated empty state component
│   │   ├── TabNavigation.tsx  # Tab filter bar
│   │   └── modals/         # Modal dialogs (editor, delete confirm, etc.)
│   ├── notes/              # Notes page
│   ├── links/              # Saved links page
│   ├── bookmarks/          # Starred notes page
│   ├── layout.tsx          # Root layout
│   └── template.tsx        # Page transition wrapper
├── hooks/
│   └── useLocalStorage.ts  # Custom hook for localStorage sync
├── lib/
│   ├── types.ts            # Shared TypeScript types
│   └── ToastContext.tsx    # Toast notification system
└── public/
    └── logo.png            # App logo / favicon
```

---

## 📸 Screenshots

> Try the live app: **[https://note-keeper-v2-vt97.vercel.app/notes](https://note-keeper-v2-vt97.vercel.app/notes)**

---

## ⚙️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🌐 Deployment

This app is deployed on **Vercel** with zero configuration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PasinduHirumal/note-keeper-v2)

To deploy your own copy:
1. Fork this repository
2. Connect it to your [Vercel](https://vercel.com) account
3. Click **Deploy** — no environment variables needed

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ using **Next.js** + **Tailwind CSS** + **Framer Motion**

[🚀 View Live Demo](https://note-keeper-v2-vt97.vercel.app/notes) • [⭐ Star on GitHub](https://github.com/PasinduHirumal/note-keeper-v2)

</div>
