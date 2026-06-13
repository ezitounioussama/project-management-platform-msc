'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Stack, Title, Text, Paper, Group, Badge, TextInput, Textarea,
  Select, Button, Avatar, Divider, ActionIcon,
} from '@mantine/core';
import { IconArrowLeft, IconSend } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import type { Issue, IssuePriority, IssueStatus, IssueComment } from '@/types/issue';

const priorityColors: Record<IssuePriority, string> = {
  highest: 'red', high: 'orange', medium: 'yellow', low: 'blue', lowest: 'gray',
};

const statusOptions = ['backlog', 'todo', 'in_progress', 'done', 'cancelled'];
const priorityOptions: { value: IssuePriority; label: string }[] = [
  { value: 'highest', label: 'Highest' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'lowest', label: 'Lowest' },
];

export default function IssueDetailPage() {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const projectId = pathParts[2];
  const issueId = pathParts[4];
  return <IssueDetailContent key={issueId} projectId={projectId} issueId={issueId} />;
}

function IssueDetailContent({ projectId, issueId }: { projectId: string; issueId: string }) {
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus | null>(null);
  const [priority, setPriority] = useState<IssuePriority | null>(null);
  const [saving, setSaving] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  async function fetchIssue() {
    try {
      const res = await fetch(`/api/issues/${issueId}`);
      if (!res.ok) throw new Error('Not found');
      const data: Issue = await res.json();
      setIssue(data);
      setTitle(data.title);
      setDescription(data.description);
      setStatus(data.status);
      setPriority(data.priority);
    } catch {
      toast.error('Issue not found');
      router.push(`/projects/${projectId}/board`);
    } finally {
      setLoading(false);
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { fetchIssue(); }, [issueId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status, priority }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated: Issue = await res.json();
      setIssue(updated);
      setEditing(false);
      toast.success('Issue updated');
    } catch {
      toast.error('Failed to update issue');
    } finally {
      setSaving(false);
    }
  }

  async function handleComment() {
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const newComment: IssueComment = await res.json();
      setIssue((prev) => prev ? { ...prev, comments: [...prev.comments, newComment] } : prev);
      setCommentText('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setCommenting(false);
    }
  }

  if (loading) return <Stack p="lg"><Text c="dimmed">Loading...</Text></Stack>;
  if (!issue) return null;

  return (
    <Stack p="lg" gap="md" maw={800}>
      <Group>
        <ActionIcon variant="subtle" onClick={() => router.push(`/projects/${projectId}/board`)}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Text size="sm" c="dimmed">{issue.key}</Text>
      </Group>

      {editing ? (
        <Paper p="md" withBorder radius="md">
          <Stack>
            <TextInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} minRows={3} />
            <Group grow>
              <Select label="Status" data={statusOptions} value={status} onChange={(v) => setStatus(v as IssueStatus | null)} />
              <Select label="Priority" data={priorityOptions} value={priority} onChange={(v) => setPriority(v as IssuePriority | null)} />
            </Group>
            <Group>
              <Button onClick={handleSave} loading={saving}>Save</Button>
              <Button variant="subtle" onClick={() => setEditing(false)}>Cancel</Button>
            </Group>
          </Stack>
        </Paper>
      ) : (
        <>
          <Title order={3}>{issue.title}</Title>
          <Group gap="xs">
            <Badge color={priorityColors[issue.priority]} variant="light">{issue.priority}</Badge>
            <Badge variant="light">{issue.status}</Badge>
            <Text size="sm" c="dimmed">Reporter: {issue.reporterEmail ?? issue.reporterId}</Text>
            <Text size="sm" c="dimmed">Assignee: {issue.assigneeId ?? 'Unassigned'}</Text>
          </Group>
          {issue.description && <Text>{issue.description}</Text>}
          <Button variant="light" onClick={() => setEditing(true)} size="compact-sm" style={{ alignSelf: 'flex-start' }}>Edit</Button>
        </>
      )}

      <Divider />
      <Title order={4}>Comments ({issue.comments.length})</Title>
      {issue.comments.length === 0 && <Text c="dimmed" size="sm">No comments yet.</Text>}
      {issue.comments.map((comment, i) => (
        <Paper key={i} p="sm" withBorder radius="md">
          <Group gap="sm" mb={4}>
            <Avatar name={comment.userName} color="initials" size="sm" />
            <Text size="sm" fw={500}>{comment.userName}</Text>
            <Text size="xs" c="dimmed">{new Date(comment.createdAt).toLocaleDateString()}</Text>
          </Group>
          <Text size="sm">{comment.body}</Text>
        </Paper>
      ))}
      <Group align="flex-end">
        <TextInput
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ flex: 1 }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
        />
        <ActionIcon onClick={handleComment} loading={commenting} color="blue">
          <IconSend size={16} />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
