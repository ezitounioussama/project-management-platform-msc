'use client';

import { Stack, Title, Text } from '@mantine/core';
import { ProjectNav } from '@/components/layout/ProjectNav';

export default function BoardPage({ params }: { params: { projectId: string } }) {
  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={params.projectId} />
      <Title order={3}>Board</Title>
      <Text c="dimmed">Kanban board will appear here.</Text>
    </Stack>
  );
}
