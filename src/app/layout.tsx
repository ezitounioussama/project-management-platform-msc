import type { Metadata } from "next";
import '@mantine/core/styles.css';
import "./globals.css";
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: "ScrumBoard — Project Management Platform",
  description:
    "Plan, track, and manage your agile projects with ScrumBoard. " +
    "Kanban boards, backlog management, sprint planning, and team collaboration " +
    "all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
