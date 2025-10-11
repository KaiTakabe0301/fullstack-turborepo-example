import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TechStackCard } from '@/components/ui/TechStackCard';

const meta = {
  title: 'UI/TechStackCard',
  component: TechStackCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'The name of the technology',
    },
    description: {
      control: 'text',
      description: 'A brief description of the technology',
    },
    version: {
      control: 'text',
      description: 'The version number (optional)',
    },
  },
} satisfies Meta<typeof TechStackCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'React',
    description: 'A JavaScript library for building user interfaces',
  },
};

export const WithVersion: Story = {
  args: {
    name: 'Next.js',
    description: 'The React Framework for Production with Pages Router',
    version: 'v15',
  },
};

export const LongDescription: Story = {
  args: {
    name: 'TypeScript',
    description:
      'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds optional static typing to JavaScript and provides compile-time error checking.',
    version: 'v5.8',
  },
};

export const MinimalContent: Story = {
  args: {
    name: 'Vue',
    description: 'Progressive framework',
  },
};

export const MultipleCards: Story = {
  args: {
    name: 'React',
    description: 'A JavaScript library for building user interfaces',
  },
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl'>
      <TechStackCard
        name='Next.js'
        description='The React Framework for Production with Pages Router'
        version='v15'
      />
      <TechStackCard
        name='React'
        description='A JavaScript library for building user interfaces'
        version='v19'
      />
      <TechStackCard
        name='NestJS'
        description='A progressive Node.js framework for server-side'
      />
      <TechStackCard
        name='GraphQL'
        description='A query language for your API'
      />
      <TechStackCard
        name='TypeScript'
        description='JavaScript with syntax for types'
        version='v5.8'
      />
      <TechStackCard
        name='Tailwind CSS'
        description='A utility-first CSS framework'
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
