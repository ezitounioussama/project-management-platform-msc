'use client';

import { Stack, Title, Text, Paper, Group, Avatar } from '@mantine/core';
import Link from 'next/link';

const mockProjects = [
  { id: '1', name: 'Frontend App', key: 'FE', color: 'blue', lead: 'AJ' },
  { id: '2', name: 'Backend API', key: 'API', color: 'green', lead: 'SM' },
  { id: '3', name: 'Mobile App', key: 'MA', color: 'violet', lead: 'LK' },
];

export default function ProjectsPage() {
  return (
    <Stack p="lg" gap="md">
      <Title order={2}>Projects</Title>

      {mockProjects.map((project) => (
        <Paper
          key={project.id}
          component={Link}
          href={`/projects/${project.id}/board`}
          p="md"
          radius="md"
          withBorder
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Group>
            <Avatar color={project.color} radius="sm">{project.key}</Avatar>
            <div>
              <Text fw={500}>{project.name}</Text>
              <Text size="sm" c="dimmed">{project.key} · Lead: {project.lead}</Text>
            </div>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
