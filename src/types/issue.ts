export type IssuePriority = 'highest' | 'high' | 'medium' | 'low' | 'lowest';

export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled';

export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId: string | null;
  reporterId: string;
  projectId: string;
  parentId: string | null;
  storyPoints: number | null;
  dueDate: string | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}
