"use client";

import { useState } from 'react';
import { PromptItem } from '@/types';
import { 
  Copy, 
  Trash2, 
  Folder, 
  FileText, 
  Zap, 
  Search, 
  MoreVertical, 
  ExternalLink, 
  Check, 
  Clock, 
  Code,
  X,
  Maximize2
} from 'lucide-react';
import { deletePrompt } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LibraryViewProps {
  prompts: PromptItem[];
  onRefresh: () => void;
}

export default function LibraryView({ prompts, onRefresh }: LibraryViewProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to purge this asset from the vault?")) {
      await deletePrompt(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {prompts.map((prompt, index) => (
          <motion.div 
            key={prompt.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => setSelectedPrompt(prompt)}
            className="group glass-card p-6 rounded-2xl cursor-pointer relative overflow-hidden"
          >
            {/* Type Indicator Bar */}
            <div className={cn(
              "absolute top-0 left-0 w-full h-1",
              prompt.type === 'skill' ? "bg-amber-500" : "bg-indigo-500"
            )} />

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  prompt.type === 'skill' ? "bg-amber-500/10 text-amber-500" : "bg-indigo-500/10 text-indigo-500"
                )}>
                  {prompt.type === 'skill' ? <Zap className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-lg tracking-tight truncate leading-tight">{prompt.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                    <Clock className="h-3 w-3" />
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCopy(prompt.content, prompt.id); }}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  title="Copy Content"
                >
                  {copyStatus === prompt.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
                <button 
                  onClick={(e) => handleDelete(e, prompt.id)}
                  className="p-2 bg-zinc-800 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                  title="Delete Asset"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative group/code">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/80 z-1" />
              <p className="text-xs text-zinc-400 font-mono line-clamp-6 bg-black/40 p-4 rounded-xl border border-zinc-800 group-hover:border-zinc-700 transition-colors leading-relaxed">
                {prompt.content}
              </p>
              <div className="absolute bottom-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity">
                <Maximize2 className="h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                  {prompt.type}
                </span>
                {prompt.sourceUrl && (
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                    <ExternalLink className="h-2.5 w-2.5" /> Source
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {prompts.length === 0 && (
        <div className="text-center py-32 border-2 border-dashed border-zinc-800 rounded-3xl">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center text-zinc-700 mx-auto mb-6 shadow-inner">
            <Folder className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-zinc-400">Vault Empty</h3>
          <p className="text-zinc-600 mt-2">Initialize your collection by importing assets from GitHub.</p>
        </div>
      )}

      {/* Full-screen Preview Modal */}
      <AnimatePresence>
        {selectedPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full h-full max-w-6xl glass rounded-3xl border border-zinc-700 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    selectedPrompt.type === 'skill' ? "bg-amber-500/20 text-amber-500" : "bg-indigo-500/20 text-indigo-500"
                  )}>
                    {selectedPrompt.type === 'skill' ? <Zap className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight leading-none mb-1">{selectedPrompt.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Added {new Date(selectedPrompt.createdAt).toLocaleString()}
                      </span>
                      {selectedPrompt.sourceUrl && (
                        <a 
                          href={selectedPrompt.sourceUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Remote
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleCopy(selectedPrompt.content, selectedPrompt.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all active:scale-95"
                  >
                    {copyStatus === selectedPrompt.id ? (
                      <><Check className="h-4 w-4" /> Copied!</>
                    ) : (
                      <><Copy className="h-4 w-4" /> Copy Content</>
                    )}
                  </button>
                  <button 
                    onClick={() => setSelectedPrompt(null)}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-widest text-xs">
                      <Code className="h-4 w-4 text-indigo-500" />
                      Content Preview
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/50 shadow-inner">
                      <SyntaxHighlighter 
                        language={selectedPrompt.type === 'skill' ? 'markdown' : 'text'}
                        style={atomDark}
                        customStyle={{
                          background: 'transparent',
                          padding: '1.5rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
                          margin: 0
                        }}
                      >
                        {selectedPrompt.content}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {selectedPrompt.type === 'skill' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-2xl border border-zinc-800">
                        <h4 className="font-bold text-zinc-200 mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          Skill Manifest
                        </h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          This asset is identified as an Agentic Skill. It follows the OpenClaw standard for tool/skill definition, including system prompt segments and potential dependency links.
                        </p>
                      </div>
                      <div className="glass p-6 rounded-2xl border border-zinc-800">
                        <h4 className="font-bold text-zinc-200 mb-2 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-indigo-500" />
                          Ingestion Path
                        </h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          Originating from {selectedPrompt.sourceUrl || "local manual entry"}. 
                          This asset has been verified and committed to the local encrypted vault.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex justify-center">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Prompt Vault Engineering Interface v2.0</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
