import { describe, it, expect } from 'vitest';

describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });

  it('one to be one', () => {
    expect(1).toBe(1);
  });
});
