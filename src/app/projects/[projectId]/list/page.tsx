'use client';

import { useState, useEffect } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import type { DragEndEvent } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { Stack, Title, Text, Table, Badge, Group, Button } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProjectNav } from '@/components/layout/ProjectNav';
import { CreateIssueModal } from '@/components/issue/CreateIssueModal';
import type { Issue, IssuePriority } from '@/types/issue';

const priorityColors: Record<IssuePriority, string> = {
  highest: 'red', high: 'orange', medium: 'yellow', low: 'blue', lowest: 'gray',
};

function DraggableRow({ issue, projectId, index }: { issue: Issue; projectId: string; index: number }) {
  const router = useRouter();
  const { ref } = useSortable({ id: issue._id, index, group: issue.status });

  return (
    <Table.Tr ref={ref} style={{ cursor: 'grab' }} onClick={() => router.push(`/projects/${projectId}/issues/${issue._id}`)}>
      <Table.Td w={32}>
        <IconGripVertical size={14} style={{ opacity: 0.4, display: 'flex' }} />
      </Table.Td>
      <Table.Td><Text size="sm" fw={500} c="dimmed">{issue.key}</Text></Table.Td>
      <Table.Td><Text size="sm">{issue.title}</Text></Table.Td>
      <Table.Td><Badge size="sm" variant="light">{issue.status.replace('_', ' ')}</Badge></Table.Td>
      <Table.Td><Badge size="sm" color={priorityColors[issue.priority]} variant="light">{issue.priority}</Badge></Table.Td>
      <Table.Td><Text size="sm" c="dimmed">{issue.assigneeId ? 'Assigned' : 'Unassigned'}</Text></Table.Td>
    </Table.Tr>
  );
}

export default function ListPage() {
  const pathname = usePathname();
  const projectId = pathname.split('/')[2];
  return <ListContent key={projectId} projectId={projectId} />;
}

function ListContent({ projectId }: { projectId: string }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  async function fetchIssues() {
    try {
      const res = await fetch(`/api/issues?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch issues');
      const raw: Issue[] = await res.json();
      const seen = new Set<string>();
      setIssues(raw.filter((i) => { if (seen.has(i._id)) return false; seen.add(i._id); return true; }));
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

    let movedStatus: string | null = null;
    setIssues((prev) => {
      const sourceIssue = prev.find((i) => i._id === issueId);
      if (!sourceIssue) return prev;

      const targetId = String(target!.id);
      const targetIdx = prev.findIndex((i) => i._id === targetId);
      const targetIssue = targetIdx >= 0 ? prev[targetIdx] : null;
      const newStatus = targetIssue ? targetIssue.status : sourceIssue.status;
      movedStatus = newStatus;

      const prevWithoutSource = prev.filter((i) => i._id !== issueId);
      const insertAt = Math.min(targetIdx, prevWithoutSource.length);
      prevWithoutSource.splice(insertAt, 0, { ...sourceIssue, status: newStatus });
      return prevWithoutSource;
    });

    if (movedStatus) {
      try {
        await fetch(`/api/issues/${issueId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: movedStatus }),
        });
      } catch {
        toast.error('Failed to update issue status');
      }
    }
  }

  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={projectId} />
      <Group justify="space-between">
        <Title order={3}>List</Title>
        <Button onClick={openCreate} size="sm">Create issue</Button>
      </Group>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={32}></Table.Th>
              <Table.Th>Key</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Assignee</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6}><Text c="dimmed" ta="center" py="xl">Loading issues...</Text></Table.Td>
              </Table.Tr>
            ) : issues.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}><Text c="dimmed" ta="center" py="xl">No issues yet. Create one to get started.</Text></Table.Td>
              </Table.Tr>
            ) : (
              issues.map((issue, i) => (
                <DraggableRow key={issue._id} issue={issue} projectId={projectId} index={i} />
              ))
            )}
          </Table.Tbody>
        </Table>
      </DragDropProvider>
      <CreateIssueModal opened={createOpened} onClose={closeCreate} projectId={projectId} onCreated={fetchIssues} />
    </Stack>
  );
}
