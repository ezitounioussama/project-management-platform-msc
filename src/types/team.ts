export type TeamRole = 'admin' | 'member' | 'viewer';

export interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: TeamRole;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}
