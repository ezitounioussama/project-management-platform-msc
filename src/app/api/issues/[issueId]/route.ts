import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import { Issue } from '@/models/Issue';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(_request: Request, { params }: { params: Promise<{ issueId: string }> }) {
  try {
    await requireAuth();
    await connectToDatabase();

    const { issueId } = await params;
    const issue = await Issue.findById(issueId).lean();
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const client = await clerkClient();
    let reporterEmail = issue.reporterId;
    try {
      const user = await client.users.getUser(issue.reporterId);
      reporterEmail = user.primaryEmailAddress?.emailAddress ?? user.fullName ?? issue.reporterId;
    } catch {
      // fallback to ID
    }

    return NextResponse.json({ ...issue, reporterEmail });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ issueId: string }> }) {
  try {
    await requireAuth();
    await connectToDatabase();

    const { issueId } = await params;
    const body = await request.json();
    const allowed = ['title', 'description', 'status', 'priority', 'assigneeId', 'labels', 'storyPoints', 'dueDate', 'parentId'];

    const update: Record<string, unknown> = {};
    for (const field of allowed) {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    if (update.dueDate === null || update.dueDate === '') {
      update.dueDate = null;
    } else if (update.dueDate) {
      update.dueDate = new Date(update.dueDate as string);
    }

    const issue = await Issue.findByIdAndUpdate(issueId, { $set: update }, { new: true });
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ issueId: string }> }) {
  try {
    await requireAuth();
    await connectToDatabase();

    const { issueId } = await params;
    const issue = await Issue.findByIdAndDelete(issueId);
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
