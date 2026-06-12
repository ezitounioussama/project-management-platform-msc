'use client';

import { useEffect, useState } from 'react';
import { Stack, Title, Text, Paper, Group, Avatar, SimpleGrid, Button, Modal, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconUsers, IconFolder } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Team } from '@/types/team';

export default function TeamsPage() {
interface TeamItem extends Team {
  _id: string;
}

  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/teams');
        const data = await res.json();
        setTeams(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Failed to load teams');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error('Failed to create team');
      const team = await res.json();
      toast.success('Team created');
      close();
      setName('');
      setDescription('');
      router.push(`/teams/${team._id}`);
    } catch {
      toast.error('Failed to create team');
    } finally {
      setCreating(false);
    }
  }

  return (
    <Stack p="lg" gap="md">
      <Group justify="space-between">
        <Title order={2}>Teams</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Create team
        </Button>
      </Group>

      {loading ? (
        <Text c="dimmed">Loading...</Text>
      ) : teams.length === 0 ? (
        <Paper p="xl" withBorder ta="center">
          <Text c="dimmed" mb="md">No teams yet</Text>
          <Button leftSection={<IconPlus size={16} />} onClick={open} variant="light">
            Create your first team
          </Button>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {teams.map((team) => (
            <Paper
              key={team.id || team._id}
              component={Link}
              href={`/teams/${team.id || team._id}`}
              p="md"
              radius="md"
              withBorder
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Group>
                <Avatar color="blue" radius="sm">
                  <IconUsers size={20} />
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text fw={500}>{team.name}</Text>
                  <Group gap="xs" mt={4}>
                    <IconFolder size={14} />
                    <Text size="sm" c="dimmed">
                      {team.members?.length ?? 0} members
                    </Text>
                  </Group>
                </div>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      )}

      <Modal opened={opened} onClose={close} title="Create team" centered>
        <Stack>
          <TextInput
            label="Team name"
            placeholder="e.g. Frontend Team"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="What is this team responsible for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleCreate} loading={creating} fullWidth mt="sm">
            Create team
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
