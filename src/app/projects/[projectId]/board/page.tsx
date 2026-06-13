'use client';

import { useState, useEffect, useRef } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import type { DragEndEvent } from '@dnd-kit/react';
import { Group, Title, Stack, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/app-store';
import { ProjectNav } from '@/components/layout/ProjectNav';
import { KanbanColumn } from '@/components/board/KanbanColumn';
import KanbanCard from '@/components/board/KanbanCard';
import { CreateIssueModal } from '@/components/issue/CreateIssueModal';
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
  const pathname = usePathname();
  const projectId = pathname.split('/')[2];
  const setActiveProjectId = useAppStore((s) => s.setActiveProjectId);

  console.log('[BoardPage] render pathname=%s projectId=%s', pathname, projectId);

  useEffect(() => {
    console.log('[BoardPage] effect projectId=%s', projectId);
    setActiveProjectId(projectId);
  }, [projectId]);

  return <BoardContent key={projectId} projectId={projectId} />;
}

function BoardContent({ projectId }: { projectId: string }) {
  const mountRef = useRef(true);
  console.log('[BoardContent] RENDER projectId=%s mountRef=%s', projectId, mountRef.current);
  if (mountRef.current) { console.log('[BoardContent] *** MOUNT *** projectId=%s', projectId); mountRef.current = false; }
  const [issues, setIssues] = useState<Record<IssueStatus, Issue[]>>(emptyIssues);
  const [loading, setLoading] = useState(true);
  const [createOpened, setCreateOpened] = useState(false);
  const [createStatus, setCreateStatus] = useState<IssueStatus>('backlog');

  async function fetchIssues() {
    console.log('[BoardContent] fetchIssues projectId=%s url=%s', projectId, `/api/issues?projectId=${projectId}`);
    try {
      const res = await fetch(`/api/issues?projectId=${projectId}`);
      console.log('[BoardContent] fetchIssues status=%d', res.status);
      if (!res.ok) throw new Error('Failed to fetch issues');
      const raw: Issue[] = await res.json();
      console.log('[BoardContent] fetchIssues raw=%d issues, first3=%O', raw.length, raw.slice(0, 3).map((i) => ({ _id: i._id, projectId: i.projectId, key: i.key, title: i.title })));
      const seen = new Set<string>();
      const data = raw.filter((i) => { if (seen.has(i._id)) return false; seen.add(i._id); return true; });
      const grouped: Record<IssueStatus, Issue[]> = { backlog: [], todo: [], in_progress: [], done: [], cancelled: [] };
      for (const issue of data) {
        grouped[issue.status] = [...(grouped[issue.status] ?? []), issue];
      }
      setIssues(grouped);
    } catch {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { fetchIssues(); }, [projectId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) return;
    const { source, target } = event.operation ?? {};
    if (!source || !target) return;

    const issueId = String(source.id);
    const newStatus = String(target.id) as IssueStatus;

    setIssues((prev) => {
      const oldEntry = Object.entries(prev).find(([, list]) => list.some((i) => i._id === issueId));
      if (!oldEntry) return prev;
      const oldStatus = oldEntry[0] as IssueStatus;
      if (oldStatus === newStatus) return prev;

      const issue = prev[oldStatus].find((i) => i._id === issueId);
      if (!issue) return prev;

      const next = { ...prev };
      next[oldStatus] = prev[oldStatus].filter((i) => i._id !== issueId);
      next[newStatus] = [issue, ...prev[newStatus].filter((i) => i._id !== issueId)];
      return next;
    });

    try {
      await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      toast.error('Failed to update issue status');
    }
  }

  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={projectId} />
      <Group justify="space-between">
        <Title order={3}>Board</Title>
      </Group>
      {loading ? (
        <Text c="dimmed" ta="center" py="xl">Loading issues...</Text>
      ) : (
        <DragDropProvider onDragEnd={handleDragEnd}>
          <Group gap="md" align="stretch" style={{ overflowX: 'auto', flexWrap: 'nowrap', minHeight: '60vh' }}>
            {columns.map((col) => {
              const colIssues = issues[col.id];
              const seenIds = new Set<string>();
              const deduped = colIssues.filter((i) => { if (seenIds.has(i._id)) return false; seenIds.add(i._id); return true; });
              return (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  label={col.label}
                  count={deduped.length}
                  onCreate={() => { setCreateStatus(col.id); setCreateOpened(true); }}
                >
                  {deduped.map((issue, i) => (
                    <KanbanCard key={`${issue._id}-${i}`} issue={issue} index={i} />
                  ))}
                </KanbanColumn>
              );
            })}
          </Group>
          <DragOverlay>
            {(source) =>
              source ? <Text size="sm" p="sm">Dragging...</Text> : null
            }
          </DragOverlay>
        </DragDropProvider>
      )}
      <CreateIssueModal
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        projectId={projectId}
        initialStatus={createStatus}
        onCreated={fetchIssues}
      />
    </Stack>
  );
}
