"use client";

import { useState, useEffect } from 'react';
import GitHubScanner from '@/components/GitHubScanner';
import ImportSelector from '@/components/ImportSelector';
import LibraryView from '@/components/LibraryView';
import { ScannedItem, PromptItem } from '@/types';
import { getAllPrompts, savePrompt, deletePrompt } from '@/lib/storage';
import { 
  LayoutGrid, 
  Plus, 
  Import, 
  Github, 
  Settings, 
  Search, 
  FolderOpen, 
  Star, 
  Clock,
  Terminal,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [view, setView] = useState<'library' | 'import'>('library');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    const data = await getAllPrompts();
    setPrompts(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleItemsScanned = (items: ScannedItem[]) => {
    setScannedItems(items);
  };

  const handleImport = async (selected: ScannedItem[]) => {
    for (const item of selected) {
      await savePrompt({
        id: crypto.randomUUID(),
        name: item.name,
        content: item.content,
        type: item.type,
        createdAt: Date.now(),
        sourceUrl: item.path
      });
    }
    setScannedItems(null);
    setView('library');
    loadPrompts();
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-[#09090b] flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-tight">Prompt Vault</h1>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Engineering Tool</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-2 flex items-center justify-between">
            Navigation
            <Zap className="h-3 w-3 text-indigo-500" />
          </div>
          <button 
            onClick={() => setView('library')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${view === 'library' ? 'bg-zinc-800/50 text-indigo-400 ring-1 ring-zinc-700' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30'}`}
          >
            <LayoutGrid className="h-4 w-4" />
            Library
          </button>
          <button 
            onClick={() => setView('import')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${view === 'import' ? 'bg-zinc-800/50 text-indigo-400 ring-1 ring-zinc-700' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30'}`}
          >
            <Import className="h-4 w-4" />
            Import
          </button>

          <div className="mt-8 text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-2">
            Collections
          </div>
          <button 
            onClick={() => setActiveCategory('all')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === 'all' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30'}`}
          >
            <FolderOpen className="h-4 w-4" />
            All Prompts
          </button>
          <button 
            onClick={() => setActiveCategory('skill')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === 'skill' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30'}`}
          >
            <Star className="h-4 w-4" />
            Skills (SKILL.md)
          </button>
          <button 
            onClick={() => setActiveCategory('prompt')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === 'prompt' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30'}`}
          >
            <Terminal className="h-4 w-4" />
            Prompt Files
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Plus className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Quick Actions</p>
              <p className="text-[10px] text-zinc-500">v1.2.4-stable</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header/Search */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#09090b]/80 backdrop-blur-md z-10">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search vault (Ctrl+K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <div className="h-6 w-[1px] bg-zinc-800" />
            <button 
              onClick={() => setView('import')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              New Entry
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950">
          <AnimatePresence mode="wait">
            {view === 'library' ? (
              <motion.div 
                key="library"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
                      <Clock className="h-3 w-3" />
                      Updated 2m ago
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">Engineering Library</h2>
                    <p className="text-zinc-400 mt-2 max-w-lg">Manage mission-critical LLM prompts and agentic behaviors from your personal vault.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-bold uppercase">
                      {filteredPrompts.length} Items Found
                    </div>
                  </div>
                </div>
                <LibraryView prompts={filteredPrompts} onRefresh={loadPrompts} />
              </motion.div>
            ) : (
              <motion.div 
                key="import"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 flex flex-col items-center"
              >
                <div className="text-center max-w-2xl mx-auto mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-bold uppercase mb-4">
                    External Repository Sync
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight mb-4">Sync Repository</h2>
                  <p className="text-zinc-400 text-lg">Connect to a GitHub repository to discover and ingest engineering-grade prompt assets.</p>
                </div>
                
                <div className="w-full max-w-4xl">
                  {!scannedItems ? (
                    <GitHubScanner onItemsScanned={handleItemsScanned} />
                  ) : (
                    <ImportSelector 
                      items={scannedItems} 
                      onImport={handleImport} 
                      onCancel={() => setScannedItems(null)} 
                    />
                  )}
                </div>
                
                <div className="glass rounded-2xl p-8 max-w-2xl mx-auto mt-8 border border-zinc-800/50">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-4 text-lg">
                    <Github className="h-5 w-5 text-indigo-400" />
                    Intelligent Extraction Engine
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-300">SKILL.md Analysis</p>
                      <p className="text-xs text-zinc-500">Detects Claude/OpenClaw compliant skill definitions with full context mapping.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-300">File Ingestion</p>
                      <p className="text-xs text-zinc-500">Automatic detection of <code>.prompt</code> and <code>.ai</code> manifest files in recursive trees.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-300">Dependency Graph</p>
                      <p className="text-xs text-zinc-500">Identifies and bundles required assets mentioned in system prompt sections.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-300">Safe Sync</p>
                      <p className="text-xs text-zinc-500">All data is encrypted and stored locally via IndexedDB. No server-side storage.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
