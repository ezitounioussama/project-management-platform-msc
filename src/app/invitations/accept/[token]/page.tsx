'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Stack, Title, Text, Button, Paper, Loader } from '@mantine/core';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface InvitationData {
  invitation: {
    _id: string;
    role: string;
    email: string;
  };
  team: { _id: string; name: string } | null;
}

export default function AcceptInvitationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [data, setData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.token) return;
    fetch(`/api/invitations?token=${params.token}`)
      .then((r) => {
        if (!r.ok) throw new Error('Invitation not found');
        return r.json();
      })
      .then((res) => setData(res))
      .catch(() => setError('This invitation is invalid or has expired.'))
      .finally(() => setLoading(false));
  }, [params.token]);

  async function handleAccept() {
    setAccepting(true);
    try {
      const res = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token }),
      });
      if (!res.ok) throw new Error('Failed to accept');
      await res.json();
      toast.success('Invitation accepted!');
      router.push(`/projects`);
    } catch {
      toast.error('Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  }

  if (!isLoaded || loading) {
    return (
      <Stack align="center" justify="center" p="xl" style={{ minHeight: '60vh' }}>
        <Loader />
      </Stack>
    );
  }

  if (error || !data) {
    return (
      <Stack align="center" justify="center" p="xl" style={{ minHeight: '60vh' }}>
        <Paper p="xl" withBorder radius="md" style={{ maxWidth: 420, width: '100%' }}>
          <Text ta="center" c="dimmed">{error || 'Invitation not found.'}</Text>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack align="center" justify="center" p="xl" style={{ minHeight: '60vh' }}>
      <Paper p="xl" withBorder radius="md" style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <Title order={2} mb="xs">You&apos;re invited!</Title>
        <Text c="dimmed" mb="lg">
          Join <strong>{data.team?.name}</strong> as a <strong>{data.invitation.role}</strong>
        </Text>
        <Text size="sm" c="dimmed" mb="xl">
          Invitation sent to {data.invitation.email}
        </Text>
        {!isSignedIn ? (
          <Button
            fullWidth
            onClick={() => router.push(`/sign-in?redirect_url=/invitations/accept/${params.token}`)}
          >
            Sign in to accept
          </Button>
        ) : (
          <Button fullWidth onClick={handleAccept} loading={accepting}>
            Accept invitation
          </Button>
        )}
      </Paper>
    </Stack>
  );
}
