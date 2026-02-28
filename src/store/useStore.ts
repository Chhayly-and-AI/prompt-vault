import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import { Asset, Workspace, Conversation } from "@/schemas/models";

// Client-side only storage wrapper
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    const { get } = await import('idb-keyval');
    const value = await get(name);
    return value ? (typeof value === "string" ? value : JSON.stringify(value)) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const { set } = await import('idb-keyval');
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const { del } = await import('idb-keyval');
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
  
  // UI State
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
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),
    }),
    {
      name: "prompt-vault-storage",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        workspaces: state.workspaces,
        assets: state.assets,
        conversations: state.conversations,
        activeWorkspaceId: state.activeWorkspaceId,
        activeConversationId: state.activeConversationId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Hook to check hydration status
export const useHydration = () => {
  const hasHydrated = useStore((state) => state._hasHydrated);
  return hasHydrated;
};
