'use client';

import { Tabs } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { projectTabs } from '@/constants/navigation';

interface ProjectNavProps {
  projectId: string;
}

export function ProjectNav({ projectId }: ProjectNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = projectTabs.find((t) => pathname.endsWith(t.href));

  return (
    <Tabs
      value={currentTab?.value ?? 'board'}
      onChange={(val) => {
        if (val) router.push(`/projects/${projectId}/${val}`);
      }}
    >
      <Tabs.List>
        {projectTabs.map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
