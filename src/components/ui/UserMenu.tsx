'use client';

import { Avatar, Menu, Group, Text, Divider } from '@mantine/core';
import { IconUser, IconSettings, IconLogout, IconChevronDown } from '@tabler/icons-react';
import { useClerk } from '@clerk/nextjs';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, isLoaded } = useCurrentUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded || !user) return null;

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Group gap="xs" style={{ cursor: 'pointer' }}>
          <Avatar src={user.avatar} name={user.name} color="initials" size="sm" />
          <Text size="sm" visibleFrom="sm">{user.name}</Text>
          <IconChevronDown size={14} />
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconUser size={16} />}>
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSettings size={16} />}
          onClick={() => router.push('/user')}
        >
          Settings
        </Menu.Item>
        <Divider />
        <Menu.Item
          leftSection={<IconLogout size={16} />}
          c="red"
          onClick={() => signOut({ redirectUrl: '/' })}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
