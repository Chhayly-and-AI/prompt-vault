"use client";

import { useState } from 'react';
import { scanGitHubRepo } from '@/lib/scanner';
import { ScannedItem } from '@/types';
import { Search, Loader2, Github, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScannerProps {
  onItemsScanned: (items: ScannedItem[]) => void;
}

export default function GitHubScanner({ onItemsScanned }: ScannerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'idle' | 'scanning' | 'analyzing'>('idle');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setStep('scanning');

    try {
      // Artificial delay for better UX "feeling" of work
      await new Promise(r => setTimeout(r, 1200));
      setStep('analyzing');
      const items = await scanGitHubRepo(url);
      await new Promise(r => setTimeout(r, 800));
      onItemsScanned(items);
    } catch (err: any) {
      setError(err.message || "Repository mapping failed. Ensure the URL is public and valid.");
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass rounded-3xl p-8 border border-zinc-800 shadow-2xl overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-900/10 blur-[100px] rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
              <Github className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">GitHub Ingestion</h2>
              <p className="text-zinc-500 text-sm">Enter the URL of the repository you want to index.</p>
            </div>
          </div>

          <form onSubmit={handleScan} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Repository endpoint</label>
              <div className="relative group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  disabled={loading}
                  className="w-full px-6 py-4 pl-14 bg-zinc-950/50 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 text-lg transition-all placeholder:text-zinc-700 disabled:opacity-50"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                
                <AnimatePresence>
                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {step === 'scanning' ? 'Establishing Connection...' : 'Analyzing Tree...'}
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  Initialize Scan
                  <ChevronRight className="h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Auto-detects <code>SKILL.md</code>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Engine v2.4 Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
