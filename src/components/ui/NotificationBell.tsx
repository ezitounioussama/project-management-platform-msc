'use client';

import { ActionIcon, Indicator } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import { NOTIFICATION_COUNT } from '@/constants';

export function NotificationBell() {
  return (
    <Indicator
      label={NOTIFICATION_COUNT}
      size={16}
      processing
      offset={4}
    >
      <ActionIcon variant="subtle" size="lg" aria-label="Notifications">
        <IconBell size={20} />
      </ActionIcon>
    </Indicator>
  );
}
