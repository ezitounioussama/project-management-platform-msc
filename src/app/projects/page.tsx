'use client';

import { Stack, Title, Text, Paper, Group, Avatar } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ProjectItem {
  _id: string;
  name: string;
  key: string;
  color: string;
  leadId: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Stack p="lg" gap="md">
      <Group justify="space-between">
        <Title order={2}>Projects</Title>
      </Group>

      {loading ? (
        <Text c="dimmed">Loading...</Text>
      ) : projects.length === 0 ? (
        <Paper p="xl" withBorder ta="center">
          <Text c="dimmed" mb="md">No projects yet</Text>
        </Paper>
      ) : (
        projects.map((project) => (
          <Paper
            key={project._id}
            component={Link}
            href={`/projects/${project._id}/board`}
            p="md"
            radius="md"
            withBorder
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Group>
              <Avatar color={project.color} radius="sm">{project.key}</Avatar>
              <div>
                <Text fw={500}>{project.name}</Text>
                <Text size="sm" c="dimmed">{project.key}</Text>
              </div>
            </Group>
          </Paper>
        ))
      )}
    </Stack>
  );
}
