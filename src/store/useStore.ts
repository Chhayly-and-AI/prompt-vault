import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";
import { Asset, Workspace, Conversation } from "@/schemas/models";

// Custom storage for IndexedDB via idb-keyval
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await get(name);
    return value ? (typeof value === "string" ? value : JSON.stringify(value)) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface AppState {
  // Entities (Persisted)
  workspaces: Workspace[];
  assets: Asset[];
  conversations: Conversation[];
  activeWorkspaceId: string | null;
  activeConversationId: string | null;
  
  // UI State (Non-persisted)
  _hasHydrated: boolean;
  
  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setAssets: (assets: Asset[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  setActiveConversationId: (id: string | null) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      workspaces: [],
      assets: [],
      conversations: [],
      activeWorkspaceId: null,
      activeConversationId: null,
      _hasHydrated: false,
      
      setWorkspaces: (workspaces) => set({ workspaces }),
      setAssets: (assets) => set({ assets }),
      setConversations: (conversations) => set({ conversations }),
      setActiveWorkspaceId: (activeWorkspaceId) => set({ activeWorkspaceId }),
      setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "prompt-vault-storage",
      storage: createJSONStorage(() => idbStorage),
      // ONLY persist entities and selection, EXCLUDE ephemeral UI state
      partialize: (state) => ({
        workspaces: state.workspaces,
        assets: state.assets,
        conversations: state.conversations,
        activeWorkspaceId: state.activeWorkspaceId,
        activeConversationId: state.activeConversationId,
      }),
      onRehydrateStorage: (state) => {
        return () => state?.setHasHydrated(true);
      },
    }
  )
);
