import { use } from 'react';
import { redirect } from 'next/navigation';

export default function ProjectHome({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  redirect(`/projects/${projectId}/board`);
}
