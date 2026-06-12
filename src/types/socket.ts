export interface SocketEventPayloads {
  'issue:created': { projectId: string; issue: unknown };
  'issue:updated': { projectId: string; issue: unknown };
  'issue:deleted': { projectId: string; issueId: string };
  'issue:moved': { projectId: string; issueId: string; fromStatus: string; toStatus: string };
  'notification:new': { id: string; type: string; message: string; projectId?: string };
}

export type SocketEventName = keyof SocketEventPayloads;
