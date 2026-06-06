import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  colorScheme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@company.com',
  avatar: null,
  initials: 'AJ',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  colorScheme: 'light',
  setUser: (user) => set({ user }),
  toggleColorScheme: () =>
    set((state) => ({
      colorScheme: state.colorScheme === 'light' ? 'dark' : 'light',
    })),
  setColorScheme: (colorScheme) => set({ colorScheme }),
}));
