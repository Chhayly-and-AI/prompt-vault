"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Send, Hash, AtSign, Zap, MessageSquare, TerminalSquare, Workflow, Box } from "lucide-react";
import { Asset } from "@/schemas/models";

export function ChatInterface() {
  const activeConversationId = useStore((state) => state.activeConversationId);
  const conversations = useStore((state) => state.conversations);
  const assets = useStore((state) => state.assets);
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  const [input, setInput] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(mentionQuery.toLowerCase())
  ).slice(0, 5);

  const handleSend = () => {
    if (!input.trim() || !activeConversationId) return;

    const newMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: input,
      mentions: [], // Logic for extraction could go here
      createdAt: Date.now(),
    };

    useStore.setState((state) => ({
      conversations: state.conversations.map(c => 
        c.id === activeConversationId 
          ? { ...c, messages: [...c.messages, newMessage], updatedAt: Date.now() }
          : c
      )
    }));

    setInput("");
  };

  const insertMention = (asset: Asset) => {
    const trigger = asset.type === "skill" ? "@" : asset.type === "prompt" ? "#" : "~";
    const textToInsert = `${trigger}${asset.name} `;
    setInput(prev => prev.replace(new RegExp(`[\\@\\#\\~]${mentionQuery}$`), textToInsert));
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    const match = val.match(/[\@\#\~](\w*)$/);
    if (match) {
      setShowMentions(true);
      setMentionQuery(match[1]);
    } else {
      setShowMentions(false);
    }
  };

  if (!activeConversationId) return <NoConversation />;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeConversation?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === "user" ? "bg-[var(--brand)] text-white" : "cc-glass"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-[var(--line)] relative">
        {showMentions && (
          <div className="absolute bottom-full left-6 mb-2 w-64 cc-glass rounded-xl overflow-hidden shadow-2xl z-50 border-[var(--line-strong)]">
            <div className="p-2 border-b border-[var(--line)] bg-[rgba(255,255,255,0.03)]">
              <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">Select Asset</p>
            </div>
            {filteredAssets.map(asset => (
              <button 
                key={asset.id}
                onClick={() => insertMention(asset)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs hover:bg-[var(--brand-soft)] transition-colors text-left"
              >
                {asset.type === 'skill' ? <AtSign className="h-3 w-3 text-[var(--brand)]" /> : <Hash className="h-3 w-3 text-[var(--ok)]" />}
                <span className="truncate">{asset.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type @skills, #prompts..."
            className="cc-input min-h-[100px] w-full p-4 pb-12 text-sm resize-none"
          />
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]"><AtSign className="h-4 w-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]"><Hash className="h-4 w-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]"><Zap className="h-4 w-4" /></button>
          </div>
          <button onClick={handleSend} className="absolute bottom-3 right-3 cc-btn-primary p-2">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NoConversation() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-6 opacity-60">
      <MessageSquare className="h-12 w-12 mb-4 text-[var(--brand)]" />
      <h3 className="text-lg font-semibold text-white">No active chat</h3>
      <p className="text-sm text-[var(--text-muted)] mt-1">Start a new thread to begin engineering prompts.</p>
    </div>
  );
}
