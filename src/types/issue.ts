export type IssuePriority = 'highest' | 'high' | 'medium' | 'low' | 'lowest';

export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled';

export interface IssueComment {
  userId: string;
  userName: string;
  body: string;
  createdAt: string;
}

export interface Issue {
  _id: string;
  projectId: string;
  key: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId: string | null;
  reporterId: string;
  reporterEmail?: string;
  labels: string[];
  parentId: string | null;
  storyPoints: number | null;
  dueDate: string | null;
  comments: IssueComment[];
  createdAt: string;
  updatedAt: string;
}
