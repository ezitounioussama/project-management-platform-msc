'use client';

import { useState } from 'react';
import { Modal, Stack, TextInput, Textarea, Select, Button, Group } from '@mantine/core';
import toast from 'react-hot-toast';
import type { IssuePriority, IssueStatus } from '@/types/issue';

interface CreateIssueModalProps {
  opened: boolean;
  onClose: () => void;
  projectId: string;
  onCreated?: () => void;
  initialStatus?: IssueStatus;
}

const PRIORITIES: { value: IssuePriority; label: string }[] = [
  { value: 'highest', label: 'Highest' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'lowest', label: 'Lowest' },
];

export function CreateIssueModal({ opened, onClose, projectId, onCreated, initialStatus }: CreateIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority | null>('medium');
  const [status, setStatus] = useState<IssueStatus | null>(initialStatus ?? 'backlog');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, title, description, priority, status }),
      });
      if (!res.ok) throw new Error('Failed to create issue');
      toast.success('Issue created');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('backlog');
      onClose();
      onCreated?.();
    } catch {
      toast.error('Failed to create issue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Create issue" centered size="lg">
      <Stack>
        <TextInput label="Title" placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea label="Description" placeholder="Describe the issue..." value={description} onChange={(e) => setDescription(e.target.value)} minRows={3} />
        <Group grow>
          <Select label="Priority" data={PRIORITIES} value={priority} onChange={setPriority} />
          <Select label="Status" data={['backlog', 'todo', 'in_progress', 'done', 'cancelled']} value={status} onChange={(v) => setStatus(v as IssueStatus | null)} />
        </Group>
        <Button onClick={handleSubmit} loading={loading} fullWidth mt="sm">Create issue</Button>
      </Stack>
    </Modal>
  );
}
