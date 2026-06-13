'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stack, Title, Text, Paper, Group, SimpleGrid, RingProgress, Badge, Avatar,
} from '@mantine/core';
import { IconColumns3, IconArrowUpRight } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import type { Issue, IssueStatus } from '@/types/issue';

interface ProjectItem {
  _id: string;
  name: string;
  key: string;
  color: string;
}

const statusLabels: Record<string, string> = {
  backlog: 'Backlog', todo: 'To Do', in_progress: 'In Progress', done: 'Done', cancelled: 'Cancelled',
};

const statusColors: Record<string, string> = {
  backlog: 'gray', todo: 'blue', in_progress: 'yellow', done: 'green', cancelled: 'red',
};

export default function BoardsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [issuesByProject, setIssuesByProject] = useState<Record<string, Issue[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projRes, issuesRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/issues'),
        ]);
        const projData: ProjectItem[] = await projRes.json();
        const issuesData: Issue[] = await issuesRes.json();
        setProjects(Array.isArray(projData) ? projData : []);
        const grouped: Record<string, Issue[]> = {};
        for (const issue of issuesData) {
          if (!grouped[issue.projectId]) grouped[issue.projectId] = [];
          grouped[issue.projectId].push(issue);
        }
        setIssuesByProject(grouped);
      } catch {
        toast.error('Failed to load boards');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Stack p="lg" maw={1200} mx="auto">
        <Title order={2}>Boards</Title>
        <Text c="dimmed">Loading boards...</Text>
      </Stack>
    );
  }

  return (
    <Stack p="lg" maw={1200} mx="auto">
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <IconColumns3 size={28} />
          <Title order={2}>Boards</Title>
        </Group>
        <Text size="sm" c="dimmed">{projects.length} {projects.length === 1 ? 'board' : 'boards'}</Text>
      </Group>

      {projects.length === 0 ? (
        <Paper p="xl" withBorder ta="center">
          <IconColumns3 size={48} style={{ opacity: 0.3 }} />
          <Text c="dimmed" mt="md" size="lg">No boards yet</Text>
          <Text c="dimmed" size="sm">Create a project to get started.</Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {projects.map((project) => {
            const projectIssues = issuesByProject[project._id] ?? [];
            const total = projectIssues.length;
            const done = projectIssues.filter((i) => i.status === 'done').length;
            const inProgress = projectIssues.filter((i) => i.status === 'in_progress').length;
            const todo = projectIssues.filter((i) => i.status === 'todo').length;
            const backlog = projectIssues.filter((i) => i.status === 'backlog').length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            const counts: { status: IssueStatus; label: string; count: number }[] = [
              { status: 'backlog', label: statusLabels.backlog, count: backlog },
              { status: 'todo', label: statusLabels.todo, count: todo },
              { status: 'in_progress', label: statusLabels.in_progress, count: inProgress },
              { status: 'done', label: statusLabels.done, count: done },
            ];

            return (
              <Paper
                key={project._id}
                p="md"
                radius="md"
                withBorder
                style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                className="boards-card"
                onClick={() => router.push(`/projects/${project._id}/board`)}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Group justify="space-between" mb="sm">
                  <Group gap="sm">
                    <Avatar color={project.color} radius="sm" size="md">{project.key}</Avatar>
                    <div>
                      <Text fw={600} size="sm">{project.name}</Text>
                      <Text size="xs" c="dimmed">{project.key}</Text>
                    </div>
                  </Group>
                  <IconArrowUpRight size={16} style={{ opacity: 0.4 }} />
                </Group>

                {total > 0 ? (
                  <>
                    <Group gap="xs" mb="xs">
                      <RingProgress
                        size={60}
                        thickness={6}
                        sections={[{ value: pct, color: 'green' }]}
                        label={<Text size="xs" ta="center">{pct}%</Text>}
                      />
                      <Stack gap={2}>
                        <Text size="lg" fw={700}>{total}</Text>
                        <Text size="xs" c="dimmed">total issues</Text>
                      </Stack>
                    </Group>

                    <Stack gap={4}>
                      {counts.map((c) => (
                        c.count > 0 && (
                          <Group key={c.status} gap="xs" justify="space-between">
                            <Group gap={6}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: `var(--mantine-color-${statusColors[c.status]}-5)` }} />
                              <Text size="xs" c="dimmed">{c.label}</Text>
                            </Group>
                            <Badge size="sm" variant="light" color={statusColors[c.status]}>{c.count}</Badge>
                          </Group>
                        )
                      ))}
                    </Stack>
                  </>
                ) : (
                  <Text size="sm" c="dimmed" py="xl" ta="center">No issues yet</Text>
                )}
              </Paper>
            );
          })}
        </SimpleGrid>
      )}

      <style>{`
        .boards-card:hover {
          transform: translateY(-2px);
          transition: transform 0.15s, box-shadow 0.15s;
        }
      `}</style>
    </Stack>
  );
}
