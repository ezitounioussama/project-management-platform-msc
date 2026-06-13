'use client';

import { Stack, Title, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { ProjectNav } from '@/components/layout/ProjectNav';

export default function TimelinePage() {
  const projectId = usePathname().split('/')[2];

  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={projectId} />
      <Title order={3}>Timeline</Title>
      <Text c="dimmed">Gantt chart / timeline will appear here.</Text>
    </Stack>
  );
}
