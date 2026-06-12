function getServerUrl() {
  return process.env.SOCKET_SERVER_URL
    || process.env.NEXT_PUBLIC_SOCKET_SERVER_URL
    || 'http://localhost:3001';
}

async function post(action: string, data: Record<string, unknown>) {
  const url = getServerUrl() + '/broadcast';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error(`[socket-server] HTTP ${res.status} for ${action}`);
    }
  } catch (err) {
    console.error(`[socket-server] ${action} failed:`, err);
  }
}

export function emitToUser(userId: string, event: string, data: unknown) {
  return post('broadcast:user', { userId, event, data });
}

export function emitToProject(projectId: string, event: string, data: unknown) {
  return post('broadcast:project', { projectId, event, data });
}
