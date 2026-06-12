'use client';

import { useEffect, useState } from 'react';
import {
  ActionIcon, Indicator, Popover, Stack, Text, Button,
  Group, Anchor, Box,
} from '@mantine/core';
import { IconBell, IconCheck } from '@tabler/icons-react';
import { useSocket } from '@/hooks/use-socket';
import { useUser } from '@clerk/nextjs';

interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const { user } = useUser();
  const { on } = useSocket();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      })
      .catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!on) return;
    const cleanup = on('notification:new', (data) => {
      const notif = data as NotificationItem;
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return cleanup;
  }, [on]);

  async function markAllRead() {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readAll: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  return (
    <Popover width={360} position="bottom-end" shadow="md">
      <Popover.Target>
        <Indicator
          label={unreadCount > 0 ? unreadCount : undefined}
          size={16}
          offset={4}
          disabled={unreadCount === 0}
        >
          <ActionIcon variant="subtle" size="lg" aria-label="Notifications">
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Stack gap={0}>
          <Group justify="space-between" p="sm">
            <Text fw={600} size="sm">Notifications</Text>
            {unreadCount > 0 && (
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconCheck size={14} />}
                onClick={markAllRead}
              >
                Mark all read
              </Button>
            )}
          </Group>
          <Box style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <Text c="dimmed" size="sm" ta="center" py="xl">
                No notifications yet
              </Text>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <Anchor
                  key={n._id}
                  href={n.link ?? '#'}
                  underline="never"
                  style={{ display: 'block' }}
                >
                  <Box
                    p="sm"
                    style={{
                      borderBottom: '1px solid var(--mantine-color-gray-2)',
                      background: n.read ? 'transparent' : 'var(--mantine-color-blue-0)',
                      cursor: 'pointer',
                    }}
                  >
                    <Text size="sm" fw={n.read ? 400 : 600}>{n.title}</Text>
                    {n.message && (
                      <Text size="xs" c="dimmed" lineClamp={2}>{n.message}</Text>
                    )}
                  </Box>
                </Anchor>
              ))
            )}
          </Box>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
