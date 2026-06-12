import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth, requireTeamRole } from '@/lib/auth';
import { Project } from '@/models/Project';

export async function GET(request: Request) {
  try {
    await requireAuth();
    await connectToDatabase();

    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');

    const filter: Record<string, unknown> = {};
    if (teamId) filter.teamId = teamId;

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(projects);
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
    const { name, key, description, color, teamId } = body;

    if (!name?.trim() || !key?.trim() || !teamId) {
      return NextResponse.json(
        { error: 'Name, key, and teamId are required' },
        { status: 400 }
      );
    }

    await requireTeamRole(teamId, ['admin', 'member'], userId);

    const project = await Project.create({
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description?.trim() ?? '',
      color: color ?? 'blue',
      teamId,
      leadId: userId,
    });

    return NextResponse.json(project, { status: 201 });
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
    const { id, name, key, description, color, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await requireTeamRole(project.teamId, ['admin', 'member'], userId);

    if (name) project.name = name.trim();
    if (key) project.key = key.trim().toUpperCase();
    if (description !== undefined) project.description = description.trim();
    if (color) project.color = color;
    if (status) project.status = status;

    await project.save();
    return NextResponse.json(project);
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

export async function DELETE(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await requireTeamRole(project.teamId, ['admin'], userId);

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status =
      message === 'Unauthorized' ? 401
      : message === 'Forbidden' ? 403
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
