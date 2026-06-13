import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import { Issue } from '@/models/Issue';
import { Project } from '@/models/Project';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    await requireAuth();
    await connectToDatabase();

    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    const status = url.searchParams.get('status');
    const assigneeId = url.searchParams.get('assigneeId');

    console.log('[API GET /api/issues] projectId=%j status=%j assigneeId=%j', projectId, status, assigneeId);

    const filter: Record<string, unknown> = {};
    const hasProjectFilter = !!projectId;
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (assigneeId) filter.assigneeId = assigneeId;

    console.log('[API GET /api/issues] filter=%j hasProjectFilter=%s', filter, hasProjectFilter);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any[] = JSON.parse(JSON.stringify(await Issue.find(filter).sort({ createdAt: -1 }).lean()));
    console.log('[API GET /api/issues] found %d issues, sample=%O', raw.length, raw.slice(0, 3).map((i: any) => ({ _id: i._id, projectId: i.projectId, key: i.key })));
    const seen = new Set();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const issues = raw.filter((i: any) => { if (seen.has(i._id)) return false; seen.add(i._id); return true; });
    const client = await clerkClient();
    const userIds = [...new Set(issues.map((i) => i.reporterId))] as string[];
    const userMap = new Map<string, string>();
    for (const uid of userIds) {
      try {
        const u = await client.users.getUser(uid);
        userMap.set(uid, u.primaryEmailAddress?.emailAddress ?? u.fullName ?? uid);
      } catch {
        userMap.set(uid, uid);
      }
    }
    const enriched = issues.map((i) => ({ ...i, reporterEmail: userMap.get(i.reporterId) }));

    return NextResponse.json(enriched);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const body = await request.json();
    const { projectId, title, description, status, priority, assigneeId, labels, parentId, storyPoints, dueDate } = body;

    if (!projectId || !title?.trim()) {
      return NextResponse.json({ error: 'projectId and title are required' }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const count = await Issue.countDocuments({ projectId });
    const key = `${project.key}-${count + 1}`;

    const issue = await Issue.create({
      projectId,
      key,
      title: title.trim(),
      description: description?.trim() ?? '',
      status: status ?? 'backlog',
      priority: priority ?? 'medium',
      assigneeId: assigneeId ?? null,
      reporterId: userId,
      labels: labels ?? [],
      parentId: parentId ?? null,
      storyPoints: storyPoints ?? null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return NextResponse.json(issue, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : message === 'Project not found' ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
