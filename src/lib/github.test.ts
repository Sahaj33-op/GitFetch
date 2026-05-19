import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUser, fetchRepos } from './github';

describe('github.ts fetch behavior', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchUser', () => {
    it('returns user data on success', async () => {
      const mockUser = { login: 'octocat', id: 1 };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const user = await fetchUser('octocat');
      expect(user).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/octocat',
        expect.any(Object)
      );
    });

    it('throws 404 error if user not found', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchUser('nonexistent')).rejects.toThrow('User not found');
    });

    it('throws rate limit error with reset time', async () => {
      const resetTime = (Math.floor(Date.now() / 1000) + 3600).toString();
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: {
          get: vi.fn().mockImplementation((key) => {
            if (key === 'x-ratelimit-reset') return resetTime;
            return null;
          }),
        },
      });

      await expect(fetchUser('octocat')).rejects.toThrow(/API rate limit exceeded.*Resets at/);
    });
  });

  describe('fetchRepos', () => {
    it('returns repos and handles pagination stopping at 5 pages', async () => {
      // Mock 5 pages of 100 items each, then another page to ensure it stops at 5
      const getPageItems = (count: number) => Array.from({ length: count }, (_, i) => ({ id: i }));
      
      (fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => getPageItems(100) })
        .mockResolvedValueOnce({ ok: true, json: async () => getPageItems(100) })
        .mockResolvedValueOnce({ ok: true, json: async () => getPageItems(100) })
        .mockResolvedValueOnce({ ok: true, json: async () => getPageItems(100) })
        .mockResolvedValueOnce({ ok: true, json: async () => getPageItems(100) });

      const result = await fetchRepos('octocat');
      expect(result.repos).toHaveLength(500);
      expect(result.capped).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(5);
    });

    it('stops naturally if < 100 items returned on a page', async () => {
      // Return 100 on first page, 50 on second
      const getPageItems = (count: number) => Array.from({ length: count }, (_, i) => ({ id: i }));
      
      (fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => getPageItems(100) })
        .mockResolvedValueOnce({ ok: true, json: async () => getPageItems(50) });

      const result = await fetchRepos('octocat');
      expect(result.repos).toHaveLength(150);
      expect(result.capped).toBe(false);
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
