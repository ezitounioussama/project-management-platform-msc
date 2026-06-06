export interface NavItem {
  label: string;
  icon: string;
  href: string;
  children?: NavItem[];
}

export interface ProjectTab {
  label: string;
  value: string;
  href: string;
}
