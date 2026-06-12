import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import { Team } from '@/models/Team';

export async function GET(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const member = team.members.find((m) => m.userId === userId);
    if (!member || member.role === 'viewer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(team.members);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const body = await request.json();
    const { teamId, targetUserId, role } = body;

    if (!teamId || !targetUserId || !role) {
      return NextResponse.json(
        { error: 'teamId, targetUserId, and role are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'member', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const currentMember = team.members.find((m) => m.userId === userId);
    if (!currentMember || currentMember.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetMember = team.members.find((m) => m.userId === targetUserId);
    if (!targetMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    if (targetMember.role === 'admin' && team.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    targetMember.role = role;
    await team.save();

    return NextResponse.json(team.members);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const body = await request.json();
    const { teamId, targetUserId } = body;

    if (!teamId || !targetUserId) {
      return NextResponse.json(
        { error: 'teamId and targetUserId are required' },
        { status: 400 }
      );
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const currentMember = team.members.find((m) => m.userId === userId);
    if (!currentMember || currentMember.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetMember = team.members.find((m) => m.userId === targetUserId);
    if (!targetMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    if (targetMember.role === 'admin' && team.ownerId !== userId) {
      return NextResponse.json({ error: 'Cannot remove other admins' }, { status: 403 });
    }

    team.members = team.members.filter((m) => m.userId !== targetUserId);
    await team.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
