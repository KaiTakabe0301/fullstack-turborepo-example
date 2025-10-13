import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useThemeToggle } from '@/components/ui/ThemeToggle/useThemeToggle';
import { useTheme } from '@/hooks/useTheme/useTheme';

vi.mock('@/hooks/useTheme');

describe('useThemeToggle', () => {
  const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return theme from useTheme', () => {
    const mockToggleTheme = vi.fn();

    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: mockToggleTheme,
    });

    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.theme).toBe('light');
  });

  it('should return correct aria-label for light theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });

    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.ariaLabel).toBe('Switch to dark mode');
  });

  it('should return correct aria-label for dark theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });

    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.ariaLabel).toBe('Switch to light mode');
  });

  it('should call toggleTheme when handleToggle is called', () => {
    const mockToggleTheme = vi.fn();

    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: mockToggleTheme,
    });

    const { result } = renderHook(() => useThemeToggle());

    act(() => {
      result.current.handleToggle();
    });

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should memoize handleToggle callback', () => {
    const mockToggleTheme = vi.fn();

    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: mockToggleTheme,
    });

    const { result, rerender } = renderHook(() => useThemeToggle());

    const handleToggle1 = result.current.handleToggle;
    rerender();
    const handleToggle2 = result.current.handleToggle;

    expect(handleToggle1).toBe(handleToggle2);
  });
});
