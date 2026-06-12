'use client';

import { Stack, Title, Text } from '@mantine/core';
import { useParams } from 'next/navigation';
import { ProjectNav } from '@/components/layout/ProjectNav';

export default function ListPage() {
  const params = useParams<{ projectId: string }>();

  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={params.projectId} />
      <Title order={3}>List</Title>
      <Text c="dimmed">List view will appear here.</Text>
    </Stack>
  );
}
