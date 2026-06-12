'use client';

import { useEffect, useState } from 'react';
import {
  Stack, Title, Text, Paper, Group, Avatar, TextInput, Button,
  Table, Badge, Modal, Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconMail, IconUsers } from '@tabler/icons-react';
import { ProjectNav } from '@/components/layout/ProjectNav';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { TeamMember, TeamRole } from '@/types/team';

interface ProjectData {
  _id: string;
  name: string;
  key: string;
  description: string;
  color: string;
  teamId: string;
  leadId: string;
  status: string;
}

export default function SettingsPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [inviteOpened, { open: openInvite, close: closeInvite }] = useDisclosure(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('member');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/projects');
        const projects = await res.json();
        const proj = projects.find((p: ProjectData) => p._id === params.projectId);
        if (proj) {
          setProject(proj);
          setName(proj.name);
          setDescription(proj.description);

          const memRes = await fetch(`/api/users?teamId=${proj.teamId}`);
          const memData = await memRes.json();
          setMembers(Array.isArray(memData) ? memData : []);
        }
      } catch {
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.projectId]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.projectId, name, description }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Project updated');
    } catch {
      toast.error('Failed to update project');
    } finally {
      setSaving(false);
    }
  }

  async function handleInvite() {
    if (!inviteEmail.trim() || !project) return;
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: project.teamId, email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) throw new Error('Failed to send invitation');
      toast.success('Invitation sent');
      closeInvite();
      setInviteEmail('');
    } catch {
      toast.error('Failed to send invitation');
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!project) return;
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: project.teamId, targetUserId: memberId }),
      });
      if (!res.ok) throw new Error('Failed to remove member');
      toast.success('Member removed');
      setMembers((prev) => prev.filter((m) => m.userId !== memberId));
    } catch {
      toast.error('Failed to remove member');
    }
  }

  const roleColor: Record<TeamRole, string> = { admin: 'red', member: 'blue', viewer: 'gray' };

  if (loading) return <Stack p="lg"><Text c="dimmed">Loading...</Text></Stack>;
  if (!project) return <Stack p="lg"><Text c="dimmed">Project not found</Text></Stack>;

  return (
    <Stack p="lg" gap="md">
      <ProjectNav projectId={params.projectId} />
      <Title order={3}>Settings</Title>

      <Paper p="md" withBorder radius="md">
        <Title order={4} mb="md">General</Title>
        <Stack>
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextInput label="Key" value={project.key} disabled />
          <TextInput
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleSave} loading={saving} mt="sm" style={{ alignSelf: 'flex-start' }}>
            Save changes
          </Button>
        </Stack>
      </Paper>

      <Paper p="md" withBorder radius="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>Team members</Title>
          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<IconUsers size={16} />}
              component={Link}
              href={`/teams/${project.teamId}`}
            >
              View team
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={openInvite}>
              Invite
            </Button>
          </Group>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th w={80}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {members.map((member: TeamMember) => (
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
                  <Badge color={roleColor[member.role]} variant="light">{member.role}</Badge>
                </Table.Td>
                <Table.Td>
                  <Button
                    variant="subtle" color="red" size="compact-sm"
                    onClick={() => handleRemoveMember(member.userId)}
                  >
                    <IconTrash size={14} />
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

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
          <Button onClick={handleInvite} fullWidth mt="sm">
            Send invitation
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
