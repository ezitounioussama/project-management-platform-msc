import { create } from 'zustand';

interface AuthState {
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  colorScheme: 'light',
  toggleColorScheme: () =>
    set((state) => ({
      colorScheme: state.colorScheme === 'light' ? 'dark' : 'light',
    })),
  setColorScheme: (colorScheme) => set({ colorScheme }),
}));
