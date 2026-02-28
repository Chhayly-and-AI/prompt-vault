import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";
import { Asset, Workspace, Conversation } from "@/schemas/models";

// Custom storage for IndexedDB via idb-keyval
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface AppState {
  workspaces: Workspace[];
  assets: Asset[];
  conversations: Conversation[];
  activeWorkspaceId: string | null;
  activeConversationId: string | null;
  
  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setAssets: (assets: Asset[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  setActiveConversationId: (id: string | null) => void;
  
  // Hydration helper
  _hasHydrated: boolean;
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
      
      setWorkspaces: (workspaces) => set({ workspaces }),
      setAssets: (assets) => set({ assets }),
      setConversations: (conversations) => set({ conversations }),
      setActiveWorkspaceId: (activeWorkspaceId) => set({ activeWorkspaceId }),
      setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
      
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "prompt-vault-storage",
      storage: createJSONStorage(() => idbStorage),
      onRehydrateStorage: (state) => {
        return () => state?.setHasHydrated(true);
      },
    }
  )
);
