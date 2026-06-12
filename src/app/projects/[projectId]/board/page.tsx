'use client';

import { useState } from 'react';
import {
  DragDropProvider,
  DragOverlay,
} from '@dnd-kit/react';
import type { DragEndEvent } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { Group, Title, Text, Stack } from '@mantine/core';
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

const mockIssues: Record<IssueStatus, Issue[]> = {
  backlog: [
    { id: '1', key: 'PROJ-1', title: 'Set up CI pipeline', description: '', status: 'backlog', priority: 'high', assigneeId: null, reporterId: '1', projectId: '1', parentId: null, storyPoints: 3, dueDate: null, labels: [], createdAt: '', updatedAt: '' },
    { id: '2', key: 'PROJ-2', title: 'Design system audit', description: '', status: 'backlog', priority: 'medium', assigneeId: 'u1', reporterId: '1', projectId: '1', parentId: null, storyPoints: 5, dueDate: null, labels: [], createdAt: '', updatedAt: '' },
  ],
  todo: [
    { id: '3', key: 'PROJ-3', title: 'Implement user authentication', description: '', status: 'todo', priority: 'highest', assigneeId: 'u2', reporterId: '1', projectId: '1', parentId: null, storyPoints: 8, dueDate: null, labels: [], createdAt: '', updatedAt: '' },
    { id: '4', key: 'PROJ-4', title: 'Create API endpoints', description: '', status: 'todo', priority: 'high', assigneeId: null, reporterId: '1', projectId: '1', parentId: null, storyPoints: 13, dueDate: null, labels: [], createdAt: '', updatedAt: '' },
  ],
  in_progress: [
    { id: '5', key: 'PROJ-5', title: 'Build dashboard layout', description: '', status: 'in_progress', priority: 'high', assigneeId: 'u1', reporterId: '1', projectId: '1', parentId: null, storyPoints: 5, dueDate: null, labels: [], createdAt: '', updatedAt: '' },
  ],
  done: [
    { id: '6', key: 'PROJ-6', title: 'Project scaffolding', description: '', status: 'done', priority: 'medium', assigneeId: 'u1', reporterId: '1', projectId: '1', parentId: null, storyPoints: 2, dueDate: null, labels: [], createdAt: '', updatedAt: '' },
  ],
  cancelled: [],
};

export default function BoardPage({ params }: { params: { projectId: string } }) {
  const [issues, setIssues] = useState<Record<IssueStatus, Issue[]>>(mockIssues);

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
