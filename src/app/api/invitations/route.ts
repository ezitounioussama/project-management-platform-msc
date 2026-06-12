import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth, requireTeamRole } from '@/lib/auth';
import { Invitation } from '@/models/Invitation';
import { Team } from '@/models/Team';
import { Notification } from '@/models/Notification';
import { sendMail } from '@/lib/email';
import { invitationEmail } from '@/lib/email-templates';
import { clerkClient } from '@clerk/nextjs/server';
import { emitToUser } from '@/lib/socket-server';

export async function GET(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');
    const token = url.searchParams.get('token');

    if (token) {
      const invitation = await Invitation.findOne({ token });
      if (!invitation) {
        return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
      }
      const team = await Team.findById(invitation.teamId);
      return NextResponse.json({
        invitation,
        team: team ? { _id: team._id, name: team.name } : null,
      });
    }

    const filter: Record<string, unknown> = {};
    if (teamId) {
      filter.teamId = teamId;
    } else {
      const teams = await Team.find({ 'members.userId': userId });
      const teamIds = teams.map((t) => t._id.toString());
      filter.teamId = { $in: teamIds };
    }

    const invitations = await Invitation.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(invitations);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const body = await request.json();
    const { teamId, email, role } = body;

    if (!teamId || !email?.trim()) {
      return NextResponse.json(
        { error: 'teamId and email are required' },
        { status: 400 }
      );
    }

    await requireTeamRole(teamId, ['admin'], userId);

    const existing = await Invitation.findOne({
      teamId,
      email: email.trim().toLowerCase(),
      status: 'pending',
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Invitation already sent to this email' },
        { status: 409 }
      );
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const token = crypto.randomUUID();
    const invitation = await Invitation.create({
      teamId,
      email: email.trim().toLowerCase(),
      role: role ?? 'member',
      token,
      invitedBy: userId,
    });

    const client = await clerkClient();
    let inviterName = 'Someone';
    try {
      const inviter = await client.users.getUser(userId);
      inviterName = inviter.fullName ?? inviter.primaryEmailAddress?.emailAddress ?? 'Someone';
    } catch {
      // fallback
    }

    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invitations/accept/${token}`;

    try {
      await sendMail({
        to: email.trim(),
        subject: `You're invited to join ${team.name} on Scrumboard`,
        html: invitationEmail({
          inviterName,
          teamName: team.name,
          role: invitation.role,
          acceptUrl,
        }),
      });
    } catch {
      // email failure shouldn't block invitation creation
    }

    try {
      const users = await client.users.getUserList({ emailAddress: [email.trim()] });
      if (users.data.length > 0) {
        const invitedUser = users.data[0];
        const notif = await Notification.create({
          userId: invitedUser.id,
          type: 'invitation_received',
          title: `Invitation to join ${team.name}`,
          message: `${inviterName} invited you as ${invitation.role}`,
          link: acceptUrl,
        });
        await emitToUser(invitedUser.id, 'notification:new', {
          _id: notif._id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          link: notif.link,
          read: false,
          createdAt: notif.createdAt,
        });
      }
    } catch {
      // notification failure shouldn't block
    }

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status =
      message === 'Unauthorized' ? 401
      : message === 'Forbidden' ? 403
      : message === 'Team not found' ? 404
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Invitation ID and status are required' },
        { status: 400 }
      );
    }

    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const team = await Team.findById(invitation.teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (status === 'cancelled') {
      const member = team.members.find((m) => m.userId === userId);
      if (!member || member.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    invitation.status = status;
    await invitation.save();

    if (status === 'accepted') {
      team.members.push({
        userId,
        email: body.email ?? '',
        name: body.userName ?? 'Unknown',
        role: invitation.role,
        joinedAt: new Date(),
      });
      await team.save();

      const client = await clerkClient();
      const newMember = await client.users.getUser(userId);
      const newMemberName = newMember.fullName ?? newMember.primaryEmailAddress?.emailAddress ?? 'Someone';

      for (const member of team.members) {
        if (member.userId === userId) continue;
        const notif = await Notification.create({
          userId: member.userId,
          type: 'member_joined',
          title: `${newMemberName} joined ${team.name}`,
          message: `Joined as ${invitation.role}`,
        });
        await emitToUser(member.userId, 'notification:new', {
          _id: notif._id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          read: false,
          createdAt: notif.createdAt,
        });
      }
    }

    return NextResponse.json(invitation);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
