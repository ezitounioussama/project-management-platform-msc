import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { TeamRole } from '@/types/team';

export interface TeamDocument extends Document {
  name: string;
  description: string;
  ownerId: string;
  members: {
    userId: string;
    email: string;
    name: string;
    role: TeamRole;
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema({
  userId: { type: String, required: true },
  email: { type: String, default: '' },
  name: { type: String, default: 'Unknown' },
  role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
});

const teamSchema = new Schema<TeamDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    ownerId: { type: String, required: true },
    members: [teamMemberSchema],
  },
  { timestamps: true }
);

export const Team: Model<TeamDocument> =
  mongoose.models.Team ?? mongoose.model<TeamDocument>('Team', teamSchema);
