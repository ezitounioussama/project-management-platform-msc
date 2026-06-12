import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ProjectDocument extends Document {
  name: string;
  key: string;
  description: string;
  color: string;
  teamId: string;
  leadId: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, default: '' },
    color: { type: String, default: 'blue' },
    teamId: { type: String, required: false, default: '' },
    leadId: { type: String, required: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

projectSchema.index({ teamId: 1 });
projectSchema.index({ leadId: 1 });

export const Project: Model<ProjectDocument> =
  mongoose.models.Project ?? mongoose.model<ProjectDocument>('Project', projectSchema);
