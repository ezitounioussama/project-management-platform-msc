import { useAuthStore } from '@/store/auth-store';

export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  return { user, setUser };
}
