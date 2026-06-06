'use client';

import { Button, Menu } from '@mantine/core';
import { IconPlus, IconBug, IconChecklist, IconBookmark } from '@tabler/icons-react';

export function CreateButton() {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button leftSection={<IconPlus size={16} />} size="sm">
          Create
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconBug size={16} />}>
          Issue
        </Menu.Item>
        <Menu.Item leftSection={<IconChecklist size={16} />}>
          Task
        </Menu.Item>
        <Menu.Item leftSection={<IconBookmark size={16} />}>
          Sprint
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
