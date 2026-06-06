'use client';

import { Stack, Title, Text, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <Stack align="center" justify="center" h="60vh" gap="lg">
      <Title order={1} size="6rem" c="dimmed">404</Title>
      <Title order={2}>Page not found</Title>
      <Text c="dimmed" ta="center" maw={400}>
        The page you are looking for does not exist or has been moved.
      </Text>
      <Group>
        <Button onClick={() => router.push('/')} variant="light">
          Go home
        </Button>
      </Group>
    </Stack>
  );
}
