import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth, requireTeamRole } from '@/lib/auth';
import { Invitation } from '@/models/Invitation';
import { Team } from '@/models/Team';

export async function GET(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');

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

    const invitation = await Invitation.create({
      teamId,
      email: email.trim().toLowerCase(),
      role: role ?? 'member',
      invitedBy: userId,
    });

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
    }

    return NextResponse.json(invitation);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
