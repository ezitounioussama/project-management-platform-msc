import { createServer } from 'node:http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3001;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingInterval: 25000,
  pingTimeout: 20000,
});

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
  if (!userId) {
    return next(new Error('Authentication required'));
  }
  socket.data.userId = userId;
  next();
});

io.on('connection', (socket) => {
  console.log(`[connect] ${socket.data.userId} (${socket.id})`);

  socket.on('join:project', (projectId) => {
    const room = `project:${projectId}`;
    socket.join(room);
    console.log(`[join] ${socket.data.userId} joined ${room}`);
  });

  socket.on('leave:project', (projectId) => {
    const room = `project:${projectId}`;
    socket.leave(room);
    console.log(`[leave] ${socket.data.userId} left ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.data.userId} (${socket.id})`);
  });
});

httpServer.on('request', async (req, res) => {
  if (req.url !== '/broadcast' || req.method !== 'POST') {
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const { action } = payload;

  if (action === 'broadcast:user') {
    const { userId, event, data } = payload;
    if (!userId || !event) {
      res.writeHead(400);
      res.end();
      return;
    }
    const target = [...io.sockets.sockets.values()].find(
      (s) => s.data.userId === userId
    );
    if (target) {
      target.emit(event, data);
    }
  } else if (action === 'broadcast:project') {
    const { projectId, event, data } = payload;
    if (!projectId || !event) {
      res.writeHead(400);
      res.end();
      return;
    }
    io.to(`project:${projectId}`).emit(event, data);
  } else {
    res.writeHead(400);
    res.end();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
