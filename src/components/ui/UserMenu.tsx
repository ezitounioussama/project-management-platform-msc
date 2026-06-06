'use client';

import { Avatar, Menu, Group, Text, Divider } from '@mantine/core';
import { IconUser, IconSettings, IconLogout, IconChevronDown } from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks/use-current-user';

export function UserMenu() {
  const { user } = useCurrentUser();
  if (!user) return null;

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Group gap="xs" style={{ cursor: 'pointer' }}>
          <Avatar name={user.name} color="initials" size="sm" />
          <Text size="sm" visibleFrom="sm">{user.name}</Text>
          <IconChevronDown size={14} />
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconUser size={16} />}>
          Profile
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings size={16} />}>
          Settings
        </Menu.Item>
        <Divider />
        <Menu.Item leftSection={<IconLogout size={16} />} c="red">
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
