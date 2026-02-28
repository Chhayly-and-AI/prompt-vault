"use client";

import { useState } from 'react';
import { ScannedItem } from '@/types';
import { FileText, Zap, ChevronRight, Import, CheckCircle2, Circle, ArrowLeft, Info, Cpu, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ImportSelectorProps {
  items: ScannedItem[];
  onImport: (selectedItems: ScannedItem[]) => void;
  onCancel: () => void;
}

export default function ImportSelector({ items, onImport, onCancel }: ImportSelectorProps) {
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set(items.map(i => i.path)));
  const [importing, setImporting] = useState(false);

  const toggleItem = (path: string) => {
    const next = new Set(selectedPaths);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setSelectedPaths(next);
  };

  const selectAll = () => {
    setSelectedPaths(new Set(items.map(i => i.path)));
  };

  const deselectAll = () => {
    setSelectedPaths(new Set());
  };

  const handleImport = async () => {
    setImporting(true);
    // Visual feedback delay
    await new Promise(r => setTimeout(r, 1500));
    const selected = items.filter(item => selectedPaths.has(item.path));
    onImport(selected);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 h-[calc(100vh-280px)]">
      {/* Header Info */}
      <div className="flex items-center justify-between glass p-6 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-2xl font-bold text-white tracking-tight">Discovery Results</h2>
              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-bold uppercase">
                {items.length} Assets Found
              </span>
            </div>
            <p className="text-zinc-500 text-sm">Select the components you want to commit to your local vault.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="hidden lg:flex flex-col items-end justify-center mr-4">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Selection</p>
            <div className="flex gap-3 mt-1">
              <button onClick={selectAll} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Select All</button>
              <div className="w-1 h-1 rounded-full bg-zinc-800 self-center" />
              <button onClick={deselectAll} className="text-xs text-zinc-500 hover:text-zinc-400 font-medium">Clear All</button>
            </div>
          </div>
          <button 
            onClick={handleImport}
            disabled={selectedPaths.size === 0 || importing}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
          >
            {importing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Ingesting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Import className="h-4 w-4" />
                Commit {selectedPaths.size} {selectedPaths.size === 1 ? 'Asset' : 'Assets'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
        {items.map((item, index) => {
          const isSelected = selectedPaths.has(item.path);
          return (
            <motion.div 
              key={item.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleItem(item.path)}
              className={cn(
                "group cursor-pointer flex flex-col p-5 rounded-2xl border transition-all duration-200",
                isSelected 
                  ? "bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/20" 
                  : "bg-zinc-950/40 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/30"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  isSelected ? "bg-indigo-500 text-white" : "bg-zinc-900 text-zinc-400 group-hover:text-zinc-200"
                )}>
                  {item.type === 'skill' ? <Cpu className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
                </div>
                {isSelected ? (
                  <CheckCircle2 className="h-6 w-6 text-indigo-500 fill-indigo-500/10" />
                ) : (
                  <Circle className="h-6 w-6 text-zinc-800 group-hover:text-zinc-700" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "font-bold text-lg truncate",
                    isSelected ? "text-indigo-100" : "text-zinc-200"
                  )}>{item.name}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                    item.type === 'skill' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                  )}>{item.type}</span>
                </div>
                <p className="text-xs text-zinc-500 font-mono truncate bg-black/30 px-2 py-1 rounded border border-zinc-800/50">
                  {item.path}
                </p>
              </div>

              {item.dependencies && item.dependencies.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <div className="flex -space-x-2">
                    {item.dependencies.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      </div>
                    ))}
                  </div>
                  <span>{item.dependencies.length} Linked Dependencies</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-4 border border-zinc-800/50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
          <Info className="h-5 w-5" />
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The extraction engine has identified <span className="text-zinc-200 font-bold">{items.filter(i => i.type === 'skill').length} Agentic Skills</span> and <span className="text-zinc-200 font-bold">{items.filter(i => i.type === 'prompt').length} Specialized Prompts</span>. All associated dependencies and system prompt segments will be bundled into the vault.
        </p>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={cn("animate-spin", className)} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
