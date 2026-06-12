'use client';

import { useState } from 'react';
import {
  DragDropProvider,
  DragOverlay,
} from '@dnd-kit/react';
import type { DragEndEvent } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { Group, Title, Text, Stack } from '@mantine/core';
import { useParams } from 'next/navigation';
import { ProjectNav } from '@/components/layout/ProjectNav';
import { KanbanColumn } from '@/components/board/KanbanColumn';
import KanbanCard from '@/components/board/KanbanCard';
import type { Issue, IssueStatus } from '@/types/issue';

const columns: { id: IssueStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
  { id: 'cancelled', label: 'Cancelled' },
];

const emptyIssues: Record<IssueStatus, Issue[]> = {
  backlog: [],
  todo: [],
  in_progress: [],
  done: [],
  cancelled: [],
};

export default function BoardPage() {
  const params = useParams<{ projectId: string }>();
  const [issues, setIssues] = useState<Record<IssueStatus, Issue[]>>(emptyIssues);

  function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) return;
    setIssues((prev) => move(prev, event) as Record<IssueStatus, Issue[]>);
  }

  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={params.projectId} />
      <Group justify="space-between">
        <Title order={3}>Board</Title>
      </Group>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <Group gap="md" align="stretch" style={{ overflowX: 'auto', flexWrap: 'nowrap', minHeight: '60vh' }}>
          {columns.map((col) => (
            <KanbanColumn key={col.id} id={col.id} label={col.label} count={issues[col.id].length}>
              {issues[col.id].map((issue, i) => (
                <KanbanCard key={issue.id} issue={issue} index={i} />
              ))}
            </KanbanColumn>
          ))}
        </Group>
        <DragOverlay>
          {(source) =>
            source ? (
              <Text size="sm" p="sm">
                Dragging...
              </Text>
            ) : null
          }
        </DragOverlay>
      </DragDropProvider>
    </Stack>
  );
}
