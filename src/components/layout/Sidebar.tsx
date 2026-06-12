'use client';

import { AppShell, NavLink, ScrollArea, ActionIcon, Group, Text } from '@mantine/core';
import {
  IconStar,
  IconFolder,
  IconListDetails,
  IconColumns3,
  IconFilter,
  IconChevronLeft,
  IconChevronRight,
  IconUsers,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { sidebarItems } from '@/constants/navigation';
import { useAppStore } from '@/store/app-store';

const iconMap: Record<string, React.ElementType> = {
  IconStar,
  IconFolder,
  IconUsers,
  IconListDetails,
  IconColumns3,
  IconFilter,
};

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <AppShell.Navbar p="xs">
      <AppShell.Section grow component={ScrollArea}>
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          return (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={collapsed ? undefined : item.label}
              leftSection={Icon ? <Icon size={18} /> : undefined}
              active={isActive}
              variant="light"
              styles={{ body: { display: collapsed ? 'none' : undefined } }}
            />
          );
        })}
      </AppShell.Section>

      <AppShell.Section>
        <Group justify="flex-end" p="xs">
          <ActionIcon
            variant="subtle"
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
          </ActionIcon>
        </Group>
        {!collapsed && (
          <Text size="xs" c="dimmed" ta="center" pb="xs">
            {sidebarItems.length} items
          </Text>
        )}
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
