import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import { Notification } from '@/models/Notification';

function sse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const url = new URL(request.url);
    const since = url.searchParams.get('since');

    let lastSeen = since ? new Date(since) : new Date();
    if (isNaN(lastSeen.getTime())) {
      lastSeen = new Date();
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        let closed = false;

        controller.enqueue(encoder.encode(sse('connected', { lastSeen: lastSeen.toISOString() })));

        async function poll() {
          if (closed) return;
          try {
            const notifications = await Notification.find({
              userId,
              createdAt: { $gt: lastSeen },
            }).sort({ createdAt: 1 });

            for (const n of notifications) {
              const data = {
                _id: n._id.toString(),
                type: n.type,
                title: n.title,
                message: n.message,
                link: n.link,
                read: n.read,
                createdAt: n.createdAt.toISOString(),
              };
              controller.enqueue(encoder.encode(sse('notification:new', data)));
              if (n.createdAt > lastSeen) {
                lastSeen = n.createdAt;
              }
            }
          } catch (err) {
            console.error('[sse] poll error:', err);
          }

          if (!closed) {
            setTimeout(poll, 5000);
          }
        }

        poll();

        const heartbeat = setInterval(() => {
          if (closed) return;
          try {
            controller.enqueue(encoder.encode(sse('heartbeat', {})));
          } catch {
            closed = true;
            clearInterval(heartbeat);
          }
        }, 25000);

        request.signal.addEventListener('abort', () => {
          closed = true;
          clearInterval(heartbeat);
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return new Response(JSON.stringify({ error: 'Stream unavailable' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
