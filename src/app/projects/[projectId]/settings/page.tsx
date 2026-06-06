'use client';

import { Stack, Title, Text } from '@mantine/core';
import { ProjectNav } from '@/components/layout/ProjectNav';

export default function SettingsPage({ params }: { params: { projectId: string } }) {
  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={params.projectId} />
      <Title order={3}>Settings</Title>
      <Text c="dimmed">Project settings will appear here.</Text>
    </Stack>
  );
}
