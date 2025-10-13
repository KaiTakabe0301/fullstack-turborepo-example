import { renderHook, act } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';

import { ThemeProvider, type Theme } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/useTheme/useTheme';

interface WrapperProps {
  children: ReactNode;
  initialTheme?: Theme;
}

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  const wrapper = ({ children, initialTheme = 'light' }: WrapperProps) => {
    // Set initial theme in data-theme attribute to simulate ThemeScript behavior
    document.documentElement.setAttribute('data-theme', initialTheme);
    return <ThemeProvider>{children}</ThemeProvider>;
  };

  it('should throw error when used outside ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
  });

  it('should initialize with light theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
  });

  it('should initialize with dark theme when provided', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => wrapper({ children, initialTheme: 'dark' }),
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should update theme and save to localStorage when setTheme is called', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle theme correctly', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should memoize setTheme callback', () => {
    const { result, rerender } = renderHook(() => useTheme(), { wrapper });

    const setTheme1 = result.current.setTheme;
    rerender();
    const setTheme2 = result.current.setTheme;

    expect(setTheme1).toBe(setTheme2);
  });

  it('should memoize toggleTheme callback', () => {
    const { result, rerender } = renderHook(() => useTheme(), { wrapper });

    const toggleTheme1 = result.current.toggleTheme;
    rerender();
    const toggleTheme2 = result.current.toggleTheme;

    expect(toggleTheme1).toBe(toggleTheme2);
  });
});
