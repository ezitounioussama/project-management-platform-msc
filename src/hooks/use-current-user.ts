'use client';

import { useUser } from '@clerk/nextjs';

export function useCurrentUser() {
  const { user, isSignedIn, isLoaded } = useUser();
  return {
    user: user
      ? {
          id: user.id,
          name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Unknown',
          email: user.primaryEmailAddress?.emailAddress ?? '',
          avatar: user.imageUrl,
          initials: (user.fullName ?? 'U')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
        }
      : null,
    isSignedIn,
    isLoaded,
  };
}
