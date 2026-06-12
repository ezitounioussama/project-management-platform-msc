'use client';

import { useEffect, useState } from 'react';
import {
  Stack, Title, Text, Group, Avatar, Button,
  Table, Badge, Modal, TextInput, Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconMail } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import type { TeamMember, TeamRole, Team } from '@/types/team';

export default function TeamDetailPage() {
  const params = useParams<{ teamId: string }>();
interface TeamData extends Team {
  _id: string;
}

  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpened, { open: openInvite, close: closeInvite }] = useDisclosure(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('member');
  const [sending, setSending] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLoading(true);
    fetch('/api/teams')
      .then((r) => r.json())
      .then((teams) => {
        const found = teams.find(
          (t: TeamData) => t.id === params.teamId || t._id === params.teamId
        );
        setTeam(found ?? null);
      })
      .catch(() => toast.error('Failed to load team'))
      .finally(() => setLoading(false));
  }, [params.teamId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function reloadTeam() {
    try {
      const res = await fetch('/api/teams');
      const teams = await res.json();
      const found = teams.find(
        (t: TeamData) => t.id === params.teamId || t._id === params.teamId
      );
      setTeam(found ?? null);
    } catch {
      toast.error('Failed to load team');
    }
  }

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: params.teamId, email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) throw new Error('Failed to send invitation');
      toast.success('Invitation sent');
      closeInvite();
      setInviteEmail('');
    } catch {
      toast.error('Failed to send invitation');
    } finally {
      setSending(false);
    }
  }

  async function handleRemoveMember(memberId: string) {
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: params.teamId, targetUserId: memberId }),
      });
      if (!res.ok) throw new Error('Failed to remove member');
      toast.success('Member removed');
      reloadTeam();
    } catch {
      toast.error('Failed to remove member');
    }
  }

  if (loading) return <Stack p="lg"><Text c="dimmed">Loading...</Text></Stack>;
  if (!team) return <Stack p="lg"><Text c="dimmed">Team not found</Text></Stack>;

  const roleColor: Record<TeamRole, string> = { admin: 'red', member: 'blue', viewer: 'gray' };

  return (
    <Stack p="lg" gap="md">
      <Group justify="space-between">
        <div>
          <Title order={2}>{team.name}</Title>
          <Text c="dimmed" size="sm">{team.description}</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openInvite}>
          Invite member
        </Button>
      </Group>

      <Text fw={500} size="sm" tt="uppercase" c="dimmed">
        Members ({team.members.length})
      </Text>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Joined</Table.Th>
            <Table.Th w={80}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {team.members.map((member: TeamMember) => (
            <Table.Tr key={member.userId}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar name={member.name} color="initials" size="sm" />
                  <Text size="sm">{member.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <IconMail size={14} />
                  <Text size="sm">{member.email}</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge color={roleColor[member.role]} variant="light">
                  {member.role}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {new Date(member.joinedAt).toLocaleDateString()}
                </Text>
              </Table.Td>
              <Table.Td>
                <Button
                  variant="subtle"
                  color="red"
                  size="compact-sm"
                  onClick={() => handleRemoveMember(member.userId)}
                >
                  <IconTrash size={14} />
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={inviteOpened} onClose={closeInvite} title="Invite member" centered>
        <Stack>
          <TextInput
            label="Email address"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <Select
            label="Role"
            value={inviteRole}
            onChange={(v) => setInviteRole((v ?? 'member') as TeamRole)}
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'member', label: 'Member' },
              { value: 'viewer', label: 'Viewer' },
            ]}
          />
          <Button onClick={handleInvite} loading={sending} fullWidth mt="sm">
            Send invitation
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
