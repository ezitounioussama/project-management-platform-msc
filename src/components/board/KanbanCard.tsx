'use client';

import { memo } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { Paper, Group, Text, Avatar, Badge } from '@mantine/core';
import { IconGripVertical, IconExternalLink } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
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
    id: issue._id,
    index,
    group: issue.status,
  });
  const params = useParams<{ projectId: string }>();
  const router = useRouter();

  return (
    <Paper
      ref={ref}
      p="sm"
      radius="md"
      withBorder
      style={{ cursor: 'grab' }}
      onClick={() => router.push(`/projects/${params.projectId}/issues/${issue._id}`)}
    >
      <Group gap="xs" mb={4}>
        <IconGripVertical size={14} style={{ opacity: 0.4 }} />
        <Text size="xs" c="dimmed" fw={500}>{issue.key}</Text>
        <IconExternalLink size={12} style={{ opacity: 0.3, marginLeft: 'auto' }} />
      </Group>
      <Text size="sm" fw={500} lineClamp={2} mb="xs">
        {issue.title}
      </Text>
      <Group justify="space-between">
        <Badge size="sm" color={priorityColors[issue.priority]} variant="light">
          {issue.priority}
        </Badge>
        {issue.assigneeId && <Avatar name="U" color="initials" size="sm" />}
      </Group>
    </Paper>
  );
}

export default memo(KanbanCard);
