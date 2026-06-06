import type { NavItem, ProjectTab } from '@/types/common';

export const sidebarItems: NavItem[] = [
  { label: 'For you', icon: 'IconStar', href: '/' },
  { label: 'Dashboard', icon: 'IconLayoutDashboard', href: '/dashboard' },
  { label: 'Projects', icon: 'IconFolder', href: '/projects' },
  { label: 'Issues', icon: 'IconListDetails', href: '/issues' },
  { label: 'Boards', icon: 'IconColumns3', href: '/boards' },
  { label: 'Filters', icon: 'IconFilter', href: '/filters' },
];

export const projectTabs: ProjectTab[] = [
  { label: 'Board', value: 'board', href: 'board' },
  { label: 'List', value: 'list', href: 'list' },
  { label: 'Timeline', value: 'timeline', href: 'timeline' },
  { label: 'Settings', value: 'settings', href: 'settings' },
];
