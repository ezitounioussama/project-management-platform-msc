import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { TeamRole } from '@/types/team';

export interface InvitationDocument extends Document {
  teamId: string;
  email: string;
  role: TeamRole;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  token: string;
  invitedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<InvitationDocument>(
  {
    teamId: { type: String, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled'],
      default: 'pending',
    },
    token: { type: String, required: true, unique: true },
    invitedBy: { type: String, required: true },
  },
  { timestamps: true }
);

invitationSchema.index({ teamId: 1, email: 1 });
invitationSchema.index({ token: 1 });

export const Invitation: Model<InvitationDocument> =
  mongoose.models.Invitation ?? mongoose.model<InvitationDocument>('Invitation', invitationSchema);
