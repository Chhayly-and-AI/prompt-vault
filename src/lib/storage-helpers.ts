import { useStore } from "@/store/useStore";
import { Asset, Workspace, Conversation } from "@/schemas/models";

export const useStorageActions = () => {
  return {
    // Assets
    addAsset: (asset: Asset) => {
      useStore.setState((state) => ({
        assets: [...state.assets, asset],
      }));
    },
    updateAsset: (id: string, updates: Partial<Asset>) => {
      useStore.setState((state) => ({
        assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: Date.now() } : a)),
      }));
    },
    deleteAsset: (id: string) => {
      useStore.setState((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
      }));
    },
    togglePin: (id: string) => {
      useStore.setState((state) => ({
        assets: state.assets.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)),
      }));
    },

    // Workspaces
    addWorkspace: (workspace: Workspace) => {
      useStore.setState((state) => ({
        workspaces: [...state.workspaces, workspace],
      }));
    },
    
    // Conversations
    addConversation: (conversation: Conversation) => {
      useStore.setState((state) => ({
        conversations: [...state.conversations, conversation],
      }));
    }
  };
};
