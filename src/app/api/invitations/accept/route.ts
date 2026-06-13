import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import { Invitation } from '@/models/Invitation';
import { Team } from '@/models/Team';
import { Notification } from '@/models/Notification';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const invitation = await Invitation.findOne({ token, status: 'pending' });
    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
    }

    const team = await Team.findById(invitation.teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const alreadyMember = team.members.find((m) => m.userId === userId);
    if (alreadyMember) {
      invitation.status = 'accepted';
      await invitation.save();
      return NextResponse.json({ message: 'Already a member', team: { _id: team._id, name: team.name } });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const userEmail = clerkUser.primaryEmailAddress?.emailAddress ?? invitation.email;
    const userName = clerkUser.fullName ?? invitation.email;

    team.members.push({
      userId,
      email: userEmail,
      name: userName,
      role: invitation.role,
      joinedAt: new Date(),
    });
    await team.save();

    invitation.status = 'accepted';
    await invitation.save();

    for (const member of team.members) {
      if (member.userId === userId) continue;
      await Notification.create({
        userId: member.userId,
        type: 'member_joined',
        title: `${userName} joined ${team.name}`,
        message: `Joined as ${invitation.role}`,
      });
    }

    return NextResponse.json({
      message: 'Accepted',
      team: { _id: team._id, name: team.name },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
