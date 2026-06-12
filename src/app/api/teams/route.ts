import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import { Team } from '@/models/Team';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const teams = await Team.find({
      'members.userId': userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(teams);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const body = await request.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const userEmail = clerkUser.primaryEmailAddress?.emailAddress ?? '';
    const userName = clerkUser.fullName ?? userEmail;

    const team = await Team.create({
      name: name.trim(),
      description: description?.trim() ?? '',
      ownerId: userId,
      members: [
        {
          userId,
          email: userEmail,
          name: userName,
          role: 'admin',
          joinedAt: new Date(),
        },
      ],
    });

    return NextResponse.json(team, { status: 201 });
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
    const { id, name, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const team = await Team.findOne({ _id: id, 'members.userId': userId });
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const member = team.members.find((m) => m.userId === userId);
    if (member?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (name) team.name = name.trim();
    if (description !== undefined) team.description = description.trim();

    await team.save();
    return NextResponse.json(team);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
