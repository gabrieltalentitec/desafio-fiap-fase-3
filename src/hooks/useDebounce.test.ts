import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('retorna valor inicial imediatamente e atualiza após o delay', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'primeiro', delay: 400 } }
    );

    expect(result.current).toBe('primeiro');

    rerender({ value: 'segundo', delay: 400 });
    expect(result.current).toBe('primeiro');

    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(result.current).toBe('primeiro');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('segundo');
  });
});
