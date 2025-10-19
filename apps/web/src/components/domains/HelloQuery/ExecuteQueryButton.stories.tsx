import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { delay, http, HttpResponse } from 'msw';

import { ExecuteQueryButton } from '@/components/domains/HelloQuery/ExecuteQueryButton';

const meta: Meta<typeof ExecuteQueryButton> = {
  title: 'Domains/HelloQuery/ExecuteQueryButton',
  component: ExecuteQueryButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isAuthenticated: {
      control: 'boolean',
      description: 'Whether the user is authenticated',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/hello', async () => {
          await delay(1000);
          return HttpResponse.json({ message: 'Hello from API!' });
        }),
      ],
    },
  },
};

export const NotAuthenticated: Story = {
  args: {
    isAuthenticated: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/hello', async () => {
          await delay(1000);
          return HttpResponse.json({ message: 'Hello from API!' });
        }),
      ],
    },
  },
};

export const Success: Story = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/hello', async () => {
          await delay(500);
          return HttpResponse.json({
            message: 'Hello from API! This is a successful response.',
          });
        }),
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/hello', async () => {
          await delay(10000); // Long delay to show loading state
          return HttpResponse.json({ message: 'Hello from API!' });
        }),
      ],
    },
  },
};

export const Error401: Story = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/hello', async () => {
          await delay(500);
          return HttpResponse.json(
            { error: 'Unauthorized - Please log in' },
            { status: 401 }
          );
        }),
      ],
    },
  },
};

export const Error500: Story = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/hello', async () => {
          await delay(500);
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          );
        }),
      ],
    },
  },
};

export const NetworkError: Story = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/hello', async () => {
          await delay(500);
          return HttpResponse.error();
        }),
      ],
    },
  },
};
