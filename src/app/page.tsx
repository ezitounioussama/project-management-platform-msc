'use client';

import { Group, Stack, Title, Text, Paper, SimpleGrid } from '@mantine/core';
import { IconStar, IconClock, IconUsers, IconChecklist } from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks/use-current-user';

const stats = [
  { label: 'Assigned to me', value: '12', icon: IconChecklist, color: 'blue' },
  { label: 'In progress', value: '4', icon: IconClock, color: 'orange' },
  { label: 'Team projects', value: '3', icon: IconUsers, color: 'green' },
  { label: 'Starred', value: '5', icon: IconStar, color: 'yellow' },
];

export default function HomePage() {
  const { user, isLoaded } = useCurrentUser();

  return (
    <Stack p="lg" gap="lg">
      <Title order={2}>For you</Title>
      <Text c="dimmed">
        Welcome back, {isLoaded && user ? user.name : '...'}. Here is your overview.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => (
          <Paper key={stat.label} p="md" radius="md" withBorder>
            <Group>
              <stat.icon size={24} color={`var(--mantine-color-${stat.color}-6)`} />
              <div>
                <Text size="xl" fw={700}>{stat.value}</Text>
                <Text size="sm" c="dimmed">{stat.label}</Text>
              </div>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
