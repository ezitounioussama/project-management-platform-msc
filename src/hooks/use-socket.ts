'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';

type Handler = (...args: unknown[]) => void;

export function useSocket() {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Map<string, Set<Handler>>>(new Map());

  useEffect(() => {
    if (!user?.id) return;

    const socket = io(SOCKET_URL, {
      auth: { userId: user.id },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    for (const [event, handlers] of listenersRef.current.entries()) {
      for (const handler of handlers) {
        socket.on(event, handler);
      }
    }

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  const on = useCallback((event: string, handler: Handler) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(handler);
    socketRef.current?.on(event, handler);

    return () => {
      listenersRef.current.get(event)?.delete(handler);
      socketRef.current?.off(event, handler);
    };
  }, []);

  const off = useCallback((event: string, handler: Handler) => {
    listenersRef.current.get(event)?.delete(handler);
    socketRef.current?.off(event, handler);
  }, []);

  const joinProject = useCallback((projectId: string) => {
    socketRef.current?.emit('join:project', projectId);
  }, []);

  const leaveProject = useCallback((projectId: string) => {
    socketRef.current?.emit('leave:project', projectId);
  }, []);

  const emit = useCallback((event: string, ...args: unknown[]) => {
    socketRef.current?.emit(event, ...args);
  }, []);

  return { joinProject, leaveProject, on, off, emit };
}
