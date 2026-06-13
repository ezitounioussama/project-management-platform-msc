import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IssueComment {
  userId: string;
  userName: string;
  body: string;
  createdAt: Date;
}

export interface IssueDocument extends Document {
  projectId: string;
  key: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeId: string | null;
  reporterId: string;
  labels: string[];
  parentId: string | null;
  storyPoints: number | null;
  dueDate: Date | null;
  comments: IssueComment[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IssueComment>(
  {
    userId: { type: String, required: true },
    userName: { type: String, default: 'Unknown' },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const issueSchema = new Schema<IssueDocument>(
  {
    projectId: { type: String, required: true, index: true },
    key: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'in_progress', 'done', 'cancelled'],
      default: 'backlog',
    },
    priority: {
      type: String,
      enum: ['highest', 'high', 'medium', 'low', 'lowest'],
      default: 'medium',
    },
    assigneeId: { type: String, default: null },
    reporterId: { type: String, required: true },
    labels: [{ type: String }],
    parentId: { type: String, default: null },
    storyPoints: { type: Number, default: null },
    dueDate: { type: Date, default: null },
    comments: [commentSchema],
  },
  { timestamps: true }
);

issueSchema.index({ projectId: 1, key: 1 }, { unique: true });
issueSchema.index({ assigneeId: 1 });
issueSchema.index({ status: 1 });

export const Issue: Model<IssueDocument> =
  mongoose.models.Issue ?? mongoose.model<IssueDocument>('Issue', issueSchema);
