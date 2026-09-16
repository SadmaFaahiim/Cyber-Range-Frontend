import { describe, expect, it } from 'vitest';

import { cn, formatNodeId, getNodeDisplayName } from '@/lib/utils';

describe('cn', () => {
  it('merges two class strings correctly', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles conditional classes (undefined/false ignored)', () => {
    expect(cn('a', undefined, false, 'b')).toBe('a b');
  });

  it('tailwind-merge: later conflicting class wins', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('formatNodeId', () => {
  it('returns a string starting with the given type prefix', () => {
    expect(formatNodeId('pc')).toMatch(/^pc-/);
  });

  it('returns a string starting with router- for router', () => {
    expect(formatNodeId('router')).toMatch(/^router-/);
  });

  it('two calls return different ids (uniqueness check)', () => {
    const first = formatNodeId('edge');
    const second = formatNodeId('edge');
    expect(first).not.toBe(second);
  });
});

describe('getNodeDisplayName', () => {
  it("returns 'PC' for 'pc'", () => {
    expect(getNodeDisplayName('pc')).toBe('PC');
  });

  it("returns 'Router' for 'router'", () => {
    expect(getNodeDisplayName('router')).toBe('Router');
  });
});
