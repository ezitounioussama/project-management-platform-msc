'use client';

import { useDroppable } from '@dnd-kit/react';
import { Paper, Text, Stack, Group, ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

interface KanbanColumnProps {
  id: string;
  label: string;
  count: number;
  children: React.ReactNode;
  onCreate?: () => void;
}

export function KanbanColumn({ id, label, count, children, onCreate }: KanbanColumnProps) {
  const { ref, isDropTarget } = useDroppable({ id });

  return (
    <Paper
      ref={ref}
      p="sm"
      radius="md"
      withBorder
      style={{
        minWidth: 280,
        maxWidth: 320,
        flex: 1,
        backgroundColor: isDropTarget ? 'var(--mantine-color-blue-0)' : undefined,
        transition: 'background-color 150ms ease',
      }}
    >
      <Group justify="space-between" mb="sm" px="xs">
        <Text fw={600} size="sm">{label}</Text>
        <Group gap={4}>
          <Text size="xs" c="dimmed">{count}</Text>
          {onCreate && (
            <ActionIcon size="sm" variant="subtle" onClick={onCreate}>
              <IconPlus size={14} />
            </ActionIcon>
          )}
        </Group>
      </Group>
      <Stack gap="sm" style={{ minHeight: 100 }}>
        {children}
      </Stack>
    </Paper>
  );
}
