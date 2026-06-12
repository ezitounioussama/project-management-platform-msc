'use client';

import { memo } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { Paper, Group, Text, Avatar, Badge } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import type { Issue, IssuePriority } from '@/types/issue';

const priorityColors: Record<IssuePriority, string> = {
  highest: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'blue',
  lowest: 'gray',
};

function KanbanCard({ issue, index }: { issue: Issue; index: number }) {
  const { ref } = useSortable({
    id: issue.id,
    index,
    group: issue.status,
  });

  return (
    <Paper
      ref={ref}
      p="sm"
      radius="md"
      withBorder
      style={{ cursor: 'grab' }}
    >
      <Group gap="xs" mb={4}>
        <IconGripVertical size={14} style={{ opacity: 0.4 }} />
        <Text size="xs" c="dimmed" fw={500}>{issue.key}</Text>
      </Group>
      <Text size="sm" fw={500} lineClamp={2} mb="xs">
        {issue.title}
      </Text>
      <Group justify="space-between">
        <Badge
          size="sm"
          color={priorityColors[issue.priority]}
          variant="light"
        >
          {issue.priority}
        </Badge>
        {issue.assigneeId && (
          <Avatar name="U" color="initials" size="sm" />
        )}
      </Group>
    </Paper>
  );
}

export default memo(KanbanCard);
