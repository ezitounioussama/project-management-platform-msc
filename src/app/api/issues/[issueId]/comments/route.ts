import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import { Issue } from '@/models/Issue';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request, { params }: { params: Promise<{ issueId: string }> }) {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const { issueId } = await params;
    const body = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const comment = {
      userId,
      userName: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Unknown',
      body: text.trim(),
      createdAt: new Date(),
    };

    issue.comments.push(comment);
    await issue.save();

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
