"use client";

import { useState } from 'react';
import { PromptItem } from '@/types';
import { Copy, Trash2, Folder, FileText, Zap, Search } from 'lucide-react';
import { deletePrompt } from '@/lib/storage';

interface LibraryViewProps {
  prompts: PromptItem[];
  onRefresh: () => void;
}

export default function LibraryView({ prompts, onRefresh }: LibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const filtered = prompts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this prompt?")) {
      await deletePrompt(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your library..."
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prompt) => (
          <div key={prompt.id} className="group p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {prompt.type === 'skill' ? <Zap className="h-5 w-5 text-amber-500" /> : <FileText className="h-5 w-5 text-blue-500" />}
                <h3 className="font-semibold truncate max-w-[150px]">{prompt.name}</h3>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleCopy(prompt.content, prompt.id)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(prompt.id)}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-zinc-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-4 font-mono bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
              {prompt.content}
            </p>

            {copyStatus === prompt.id && (
              <div className="absolute top-2 right-12 bg-green-500 text-white text-xs py-1 px-2 rounded animate-fade-in">
                Copied!
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <Folder className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No prompts found.</p>
        </div>
      )}
    </div>
  );
}
