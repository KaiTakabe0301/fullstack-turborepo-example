import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';
import { useThemeToggle } from '@/components/ui/ThemeToggle/useThemeToggle';

vi.mock('./useThemeToggle');

describe('ThemeToggle', () => {
  const mockUseThemeToggle = useThemeToggle as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render light theme icon when theme is light', () => {
    mockUseThemeToggle.mockReturnValue({
      theme: 'light',
      handleToggle: vi.fn(),
      ariaLabel: 'Switch to dark mode',
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toBeInTheDocument();
  });

  it('should render dark theme icon when theme is dark', () => {
    mockUseThemeToggle.mockReturnValue({
      theme: 'dark',
      handleToggle: vi.fn(),
      ariaLabel: 'Switch to light mode',
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(button).toBeInTheDocument();
  });

  it('should call handleToggle when button is clicked', async () => {
    const mockHandleToggle = vi.fn();

    mockUseThemeToggle.mockReturnValue({
      theme: 'light',
      handleToggle: mockHandleToggle,
      ariaLabel: 'Switch to dark mode',
    });

    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockHandleToggle).toHaveBeenCalledTimes(1);
  });

  it('should have proper aria-label', () => {
    mockUseThemeToggle.mockReturnValue({
      theme: 'light',
      handleToggle: vi.fn(),
      ariaLabel: 'Switch to dark mode',
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });
});
