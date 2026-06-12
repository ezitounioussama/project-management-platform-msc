'use client';

import { Stack, Title, Text } from '@mantine/core';
import { useParams } from 'next/navigation';
import { ProjectNav } from '@/components/layout/ProjectNav';

export default function TimelinePage() {
  const params = useParams<{ projectId: string }>();

  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={params.projectId} />
      <Title order={3}>Timeline</Title>
      <Text c="dimmed">Gantt chart / timeline will appear here.</Text>
    </Stack>
  );
}
