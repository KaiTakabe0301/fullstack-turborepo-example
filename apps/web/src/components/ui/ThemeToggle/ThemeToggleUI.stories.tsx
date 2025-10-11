import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ThemeToggleUI } from '@/components/ui/ThemeToggle/ThemeToggleUI';
import type { Theme } from '@/contexts';

const meta = {
  title: 'UI/ThemeToggle',
  component: ThemeToggleUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggleUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLightTheme: Story = {
  args: {
    theme: 'light' as Theme,
    ariaLabel: 'Toggle theme',
    onToggle: () => console.log('Theme toggled'),
  },
};

export const WithDarkTheme: Story = {
  args: {
    theme: 'dark' as Theme,
    ariaLabel: 'Toggle theme',
    onToggle: () => console.log('Theme toggled'),
  },
};
