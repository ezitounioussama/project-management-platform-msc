import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface NotificationDocument extends Document {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  projectId?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    link: { type: String },
    projectId: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification: Model<NotificationDocument> =
  mongoose.models.Notification ?? mongoose.model<NotificationDocument>('Notification', notificationSchema);
