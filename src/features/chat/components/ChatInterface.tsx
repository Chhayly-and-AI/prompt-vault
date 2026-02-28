"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Send, Hash, AtSign, Zap, Plus, MessageSquare } from "lucide-react";

export function ChatInterface() {
  const activeConversationId = useStore((state) => state.activeConversationId);
  const conversations = useStore((state) => state.conversations);
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const [input, setInput] = useState("");

  if (!activeConversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <MessageSquare className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold">No Conversation Selected</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)] max-w-xs">
          Select a conversation from the sidebar or start a new one to begin composing prompts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeConversation?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === "user" 
                ? "bg-[var(--brand)] text-white shadow-lg shadow-[rgba(104,166,255,0.2)]" 
                : "cc-glass"
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {activeConversation?.messages.length === 0 && (
          <div className="flex h-full items-center justify-center opacity-30 italic text-sm">
            Start of a new conversation...
          </div>
        )}
      </div>

      {/* Composer Area */}
      <div className="p-6 border-t border-[var(--line)] bg-[rgba(7,11,17,0.4)]">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or use @skills, #prompts..."
            className="cc-input min-h-[100px] w-full p-4 pb-12 text-sm resize-none"
          />
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
              <AtSign className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] hover:text-[var(--ok)] transition-colors">
              <Hash className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] hover:text-[var(--warn)] transition-colors">
              <Zap className="h-4 w-4" />
            </button>
          </div>
          <button className="absolute bottom-3 right-3 cc-btn-primary p-2">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
