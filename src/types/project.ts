export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  color: string;
  leadId: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectView = 'board' | 'list' | 'timeline' | 'settings';
