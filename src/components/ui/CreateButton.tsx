'use client';

import { useState } from 'react';
import { Button, Menu, Modal, Stack, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconBug, IconChecklist, IconBookmark, IconUsers, IconFolder } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app-store';

export function CreateButton() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [teamOpened, { open: openTeam, close: closeTeam }] = useDisclosure(false);
  const [projectOpened, { open: openProject, close: closeProject }] = useDisclosure(false);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setActiveProjectId = useAppStore((s) => s.setActiveProjectId);

  async function handleCreateTeam() {
    if (!teamName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName, description: teamDesc }),
      });
      if (!res.ok) throw new Error('Failed to create team');
      const team = await res.json();
      toast.success('Team created');
      closeTeam();
      setTeamName('');
      setTeamDesc('');
      router.push(`/teams/${team._id}`);
    } catch {
      toast.error('Failed to create team');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject() {
    if (!projectName.trim() || !projectKey.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, key: projectKey }),
      });
      if (!res.ok) throw new Error('Failed to create project');
      const project = await res.json();
      toast.success('Project created');
      closeProject();
      setProjectName('');
      setProjectKey('');
      setActiveProjectId(project._id);
      router.push(`/projects/${project._id}/board`);
    } catch {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Menu shadow="md" width={200} opened={menuOpened} onChange={setMenuOpened}>
        <Menu.Target>
          <Button leftSection={<IconPlus size={16} />} size="sm">
            Create
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<IconUsers size={16} />} onClick={() => { setMenuOpened(false); openTeam(); }}>
            Team
          </Menu.Item>
          <Menu.Item leftSection={<IconFolder size={16} />} onClick={() => { setMenuOpened(false); openProject(); }}>
            Project
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={<IconBug size={16} />}>
            Issue
          </Menu.Item>
          <Menu.Item leftSection={<IconChecklist size={16} />}>
            Task
          </Menu.Item>
          <Menu.Item leftSection={<IconBookmark size={16} />}>
            Sprint
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal opened={teamOpened} onClose={closeTeam} title="Create team" centered>
        <Stack>
          <TextInput
            label="Team name"
            placeholder="e.g. Frontend Team"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="What is this team responsible for?"
            value={teamDesc}
            onChange={(e) => setTeamDesc(e.target.value)}
          />
          <Button onClick={handleCreateTeam} loading={loading} fullWidth mt="sm">
            Create team
          </Button>
        </Stack>
      </Modal>

      <Modal opened={projectOpened} onClose={closeProject} title="Create project" centered>
        <Stack>
          <TextInput
            label="Project name"
            placeholder="e.g. Mobile App"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <TextInput
            label="Project key"
            placeholder="e.g. MA"
            value={projectKey}
            onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
            required
          />
          <Button onClick={handleCreateProject} loading={loading} fullWidth mt="sm">
            Create project
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
