import { auth } from '@clerk/nextjs/server';
import { Team } from '@/models/Team';
import type { TeamRole } from '@/types/team';

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  return userId;
}

export async function requireTeamRole(
  teamId: string,
  allowedRoles: TeamRole[],
  userId: string
) {
  const team = await Team.findById(teamId);
  if (!team) throw new Error('Team not found');

  const member = team.members.find((m) => m.userId === userId);
  if (!member || !allowedRoles.includes(member.role as TeamRole)) {
    throw new Error('Forbidden');
  }

  return team;
}
