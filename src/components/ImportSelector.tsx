"use client";

import { useState } from 'react';
import { ScannedItem } from '@/types';
import { FileText, Zap, ChevronRight, Import } from 'lucide-react';

interface ImportSelectorProps {
  items: ScannedItem[];
  onImport: (selectedItems: ScannedItem[]) => void;
  onCancel: () => void;
}

export default function ImportSelector({ items, onImport, onCancel }: ImportSelectorProps) {
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set(items.map(i => i.path)));

  const toggleItem = (path: string) => {
    const next = new Set(selectedPaths);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setSelectedPaths(next);
  };

  const handleImport = () => {
    const selected = items.filter(item => selectedPaths.has(item.path));
    onImport(selected);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Detected Prompts & Skills ({items.length})</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">Cancel</button>
          <button 
            onClick={handleImport}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2"
          >
            <Import className="h-4 w-4" />
            Import Selected ({selectedPaths.size})
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {items.map((item) => (
          <div 
            key={item.path}
            className="flex items-center gap-4 p-4 border border-zinc-100 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <input 
              type="checkbox" 
              checked={selectedPaths.has(item.path)}
              onChange={() => toggleItem(item.path)}
              className="h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {item.type === 'skill' ? <Zap className="h-4 w-4 text-amber-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
                <span className="font-medium truncate">{item.name}</span>
              </div>
              <p className="text-xs text-zinc-500 truncate">{item.path}</p>
            </div>
            {item.dependencies && item.dependencies.length > 0 && (
              <div className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500">
                {item.dependencies.length} deps
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
