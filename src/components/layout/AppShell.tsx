'use client';

import { AppShell as MantineShell, MantineProvider } from '@mantine/core';
import { useAuthStore } from '@/store/auth-store';
import { useAppStore } from '@/store/app-store';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const colorScheme = useAuthStore((s) => s.colorScheme);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <MantineProvider forceColorScheme={colorScheme}>
      <MantineShell
        padding="md"
        header={{ height: 56 }}
        navbar={{
          width: collapsed ? 60 : 240,
          breakpoint: 'sm',
          collapsed: { mobile: true },
        }}
      >
        <TopBar />
        <Sidebar />
        <MantineShell.Main>{children}</MantineShell.Main>
      </MantineShell>
    </MantineProvider>
  );
}
