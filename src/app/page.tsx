"use client";

import { useState, useEffect } from 'react';
import GitHubScanner from '@/components/GitHubScanner';
import ImportSelector from '@/components/ImportSelector';
import LibraryView from '@/components/LibraryView';
import { ScannedItem, PromptItem } from '@/types';
import { getAllPrompts, savePrompt } from '@/lib/storage';
import { LayoutGrid, Plus, Import, Github } from 'lucide-react';

export default function Home() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [view, setView] = useState<'library' | 'import'>('library');

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

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <h1 className="text-xl font-bold tracking-tight">Prompt Vault <span className="text-blue-500 text-sm font-normal">v2</span></h1>
          </div>
          <nav className="flex items-center gap-4">
            <button 
              onClick={() => setView('library')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'library' ? 'bg-zinc-100 dark:bg-zinc-800 text-blue-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <LayoutGrid className="h-4 w-4" />
              Library
            </button>
            <button 
              onClick={() => setView('import')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'import' ? 'bg-zinc-100 dark:bg-zinc-800 text-blue-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <Import className="h-4 w-4" />
              Import
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === 'library' ? (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold">Your Library</h2>
                <p className="text-zinc-500 mt-1">Manage and access your stored LLM prompts and agentic skills.</p>
              </div>
              <button 
                onClick={() => setView('import')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New
              </button>
            </div>
            <LibraryView prompts={prompts} onRefresh={loadPrompts} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold">Import Prompts</h2>
              <p className="text-zinc-500 mt-2">Enter a GitHub repository URL to scan for SKILL.md files, .prompt files, and more.</p>
            </div>
            
            {!scannedItems ? (
              <GitHubScanner onItemsScanned={handleItemsScanned} />
            ) : (
              <ImportSelector 
                items={scannedItems} 
                onImport={handleImport} 
                onCancel={() => setScannedItems(null)} 
              />
            )}
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
                <Github className="h-4 w-4" />
                How it works
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                <li>• Scans for <code>SKILL.md</code> files (Claude/OpenClaw format)</li>
                <li>• Detects <code>.prompt</code> files in any directory</li>
                <li>• Looks for files inside <code>prompts/</code> folders</li>
                <li>• Automatically extracts relative dependencies</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
