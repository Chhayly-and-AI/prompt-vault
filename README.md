<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

# ⚡ Prompt Vault

**An engineering-grade prompt & skill manager for LLM workflows.**

Prompt Vault lets you collect, organize, and manage LLM prompts and agentic skill definitions from GitHub repositories or manual entry — all stored locally in your browser via IndexedDB.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **GitHub Import** | Scan any public repository for `SKILL.md` and `.prompt` files |
| 📝 **Manual Creation** | Create prompts and skills directly with the built-in editor |
| 🏷️ **Smart Parsing** | Extracts skill names & descriptions from YAML frontmatter |
| ⌨️ **⌘K Search** | Global keyboard shortcut to instantly search your library |
| ✏️ **Inline Editing** | Rename prompts directly from the card view |
| 📋 **One-Click Copy** | Copy prompt content to clipboard instantly |
| 🗂️ **Collection Filters** | Filter by All, Skills, or Prompts |
| 💾 **Local Storage** | All data stored in IndexedDB — no server, no account needed |
| 🌙 **Dark Theme** | Premium dark UI with glassmorphism and smooth animations |
| 📱 **Responsive** | Collapsible sidebar with mobile support |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/Chhayly-and-AI/prompt-vault.git
cd prompt-vault

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Design system (Tailwind v4 @theme tokens)
│   ├── layout.tsx           # Root layout with Inter font
│   └── page.tsx             # Main app (sidebar, header, content area)
├── components/
│   ├── GitHubScanner.tsx     # Repository URL input & scan trigger
│   ├── ImportSelector.tsx    # Scan results grid with selection
│   └── LibraryView.tsx       # Prompt card grid & detail modal
├── lib/
│   ├── scanner.ts            # GitHub API integration & frontmatter parsing
│   ├── storage.ts            # IndexedDB CRUD via idb-keyval
│   └── utils.ts              # Tailwind class merge utility
└── types/
    └── index.ts              # PromptItem & ScannedItem interfaces
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Storage** | [idb-keyval](https://github.com/nicedoc/idb-keyval) (IndexedDB) |
| **Syntax Highlighting** | [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) |
| **Language** | TypeScript 5 |

---

## 📖 Usage

### Import from GitHub

1. Click **Import** in the sidebar
2. Paste a public GitHub repo URL (e.g. `https://github.com/anthropics/skills`)
3. Click **Start Scan** — the scanner finds all `SKILL.md` and `.prompt` files
4. Select which items to import and click **Import**

The scanner automatically extracts **skill names** and **descriptions** from YAML frontmatter:

```yaml
---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces...
---
```

### Create Manually

1. Click **+ New Entry** in the header
2. Enter a name, select type (Prompt or Skill), and write your content
3. Click **Create** — saved instantly to your local vault

### Search & Filter

- Use the search bar or press **⌘K** / **Ctrl+K** to quickly find prompts
- Use collection filters in the sidebar: **All Prompts**, **Skills**, **Prompts**

---

## 🎨 Design System

The UI uses a custom design system built on Tailwind CSS v4's `@theme` directive:

- **Colors**: Dark zinc base (`#0a0a0f`) with emerald/teal accents
- **Effects**: Glassmorphism panels, gradient borders, ambient glow
- **Typography**: Inter font via `next/font/google`
- **Animations**: Shimmer, float, glow-pulse, fade-in, slide-up

---

## 📄 License

ISC

---

<p align="center">
  Built with ☕ by <a href="https://github.com/Chhayly-and-AI">Chhayly & AI</a>
</p>
