import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  activeProjectId: string | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveProjectId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  activeProjectId: null,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
}));
