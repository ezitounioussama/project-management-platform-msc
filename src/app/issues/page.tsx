'use client';

import { Stack, Title, Text } from '@mantine/core';

export default function IssuesPage() {
  return (
    <Stack p="lg" gap="md">
      <Title order={2}>Issues</Title>
      <Text c="dimmed">All issues across projects will appear here.</Text>
    </Stack>
  );
}
