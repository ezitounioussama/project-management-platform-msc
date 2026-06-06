import { redirect } from 'next/navigation';

export default function ProjectHome({ params }: { params: { projectId: string } }) {
  redirect(`/projects/${params.projectId}/board`);
}
