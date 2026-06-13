'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stack, Title, Text, Paper, Group, Badge, Avatar, TextInput, LoadingOverlay,
  Tabs,
} from '@mantine/core';
import { IconCircle, IconCircleCheck, IconSearch } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import type { Issue, IssuePriority } from '@/types/issue';

const priorityColors: Record<IssuePriority, string> = {
  highest: 'red', high: 'orange', medium: 'yellow', low: 'blue', lowest: 'gray',
};

const openStatuses = ['backlog', 'todo', 'in_progress'];
const closedStatuses = ['done', 'cancelled'];

export default function IssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string | null>('open');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [issuesRes, projectsRes] = await Promise.all([
          fetch('/api/issues'),
          fetch('/api/projects'),
        ]);
        const issuesData: Issue[] = await issuesRes.json();
        const seenIds = new Set<string>();
        const deduped = issuesData.filter((i) => { if (seenIds.has(i._id)) return false; seenIds.add(i._id); return true; });
        const projectsData: { _id: string; name: string }[] = await projectsRes.json();
        const projMap: Record<string, string> = {};
        for (const p of projectsData) projMap[p._id] = p.name;
        setProjects(projMap);
        setIssues(deduped);
      } catch {
        toast.error('Failed to load issues');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = issues.filter((i) => {
    const statusMatch = tab === 'open' ? openStatuses.includes(i.status) : tab === 'closed' ? closedStatuses.includes(i.status) : true;
    if (!search.trim()) return statusMatch;
    const q = search.toLowerCase();
    return statusMatch && (i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q) || (i.reporterEmail?.toLowerCase() ?? '').includes(q));
  });

  return (
    <Stack p="lg" gap="md" maw={900} mx="auto">
      <Group justify="space-between">
        <Title order={2}>Issues</Title>
      </Group>

      <Paper p="sm" withBorder radius="md" style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Group mb="sm">
          <TextInput
            placeholder="Search all issues..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
        </Group>

        <Tabs value={tab} onChange={setTab}>
          <Tabs.List>
            <Tabs.Tab value="open" leftSection={<IconCircle size={14} />}>
              Open {issues.filter((i) => openStatuses.includes(i.status)).length}
            </Tabs.Tab>
            <Tabs.Tab value="closed" leftSection={<IconCircleCheck size={14} />}>
              Closed {issues.filter((i) => closedStatuses.includes(i.status)).length}
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {filtered.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {loading ? 'Loading issues...' : 'No issues match your search.'}
          </Text>
        ) : (
          <Stack gap={0}>
            {filtered.map((issue) => (
              <Paper
                key={issue._id}
                p="sm"
                withBorder={false}
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--mantine-color-gray-3)',
                  borderRadius: 0,
                }}
                onClick={() => router.push(`/projects/${issue.projectId}/issues/${issue._id}`)}
              >
                <Group gap="xs" wrap="nowrap" align="flex-start">
                  {closedStatuses.includes(issue.status) ? (
                    <IconCircleCheck size={18} style={{ marginTop: 3, flexShrink: 0 }} color="var(--mantine-color-gray-5)" />
                  ) : (
                    <IconCircle size={18} style={{ marginTop: 3, flexShrink: 0 }} color="var(--mantine-color-green-6)" />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Group gap="xs" wrap="nowrap">
                      <Text size="sm" fw={500} lineClamp={1} style={{ flex: 1 }}>{issue.title}</Text>
                      <Badge size="sm" color={priorityColors[issue.priority]} variant="light">{issue.priority}</Badge>
                      <Badge size="sm" variant="light">{issue.status.replace('_', ' ')}</Badge>
                    </Group>
                    <Group gap="xs" mt={2}>
                      <Text size="xs" c="dimmed">{issue.key}</Text>
                      <Text size="xs" c="dimmed">·</Text>
                      <Text size="xs" c="dimmed">{projects[issue.projectId] ?? 'Unknown'}</Text>
                      <Text size="xs" c="dimmed">·</Text>
                      <Text size="xs" c="dimmed">opened by {issue.reporterEmail ?? issue.reporterId}</Text>
                    </Group>
                  </div>
                  <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
                    {issue.assigneeId && <Avatar name="U" color="initials" size="sm" />}
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
