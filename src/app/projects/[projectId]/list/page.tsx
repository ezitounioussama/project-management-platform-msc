'use client';

import { Stack, Title, Text, Table } from '@mantine/core';
import { useParams } from 'next/navigation';
import { ProjectNav } from '@/components/layout/ProjectNav';

export default function ListPage() {
  const params = useParams<{ projectId: string }>();

  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={params.projectId} />
      <Title order={3}>List</Title>
      <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Key</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Priority</Table.Th>
            <Table.Th>Assignee</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td colSpan={5}>
              <Text c="dimmed" ta="center" py="xl">
                No issues yet. Create one to get started.
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
