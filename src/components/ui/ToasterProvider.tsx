'use client';

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        className:
          '!bg-white !text-gray-900 dark:!bg-gray-800 dark:!text-gray-100 !shadow-lg !rounded-lg !px-4 !py-3 !text-sm !border !border-gray-200 dark:!border-gray-700',
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
  );
}
