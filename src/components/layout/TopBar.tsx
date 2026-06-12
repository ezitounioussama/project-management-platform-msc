'use client';

import { AppShell, Group, TextInput, Avatar, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { CreateButton } from '@/components/ui/CreateButton';
import { UserMenu } from '@/components/ui/UserMenu';

export function TopBar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group gap="sm">
          <Avatar size="sm" color="blue" radius="sm">
            S
          </Avatar>
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            size="sm"
            w={{ base: 160, sm: 300, lg: 400 }}
            styles={{ input: { border: 'none', background: 'var(--mantine-color-gray-0)' } }}
          />
        </Group>

        <Group gap="sm">
          {isLoaded && !isSignedIn ? (
            <SignInButton mode="modal">
              <Button size="sm" variant="light">Sign in</Button>
            </SignInButton>
          ) : (
            <>
              <CreateButton />
              <NotificationBell />
              <UserMenu />
            </>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  );
}
