import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import { Notification } from '@/models/Notification';

export async function GET() {
  try {
    const userId = await requireAuth();
    await connectToDatabase();

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId, read: false });

    return NextResponse.json({ notifications, unreadCount });
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
    const { id, readAll } = body;

    if (readAll) {
      await Notification.updateMany({ userId, read: false }, { read: true });
      return NextResponse.json({ message: 'All marked as read' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }

    await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true }
    );

    return NextResponse.json({ message: 'Marked as read' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
