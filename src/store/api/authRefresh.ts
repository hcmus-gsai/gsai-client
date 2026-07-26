'use client';

/**
 * Shared access-token refresh mutex.
 *
 * `baseApi.ts` already has one for RTK Query mutations/queries. The streaming chat client
 * (`chatStream.ts`) talks to the server with a hand-rolled `fetch`, bypassing RTK Query entirely
 * — if it had its OWN refresh mutex, a token expiring mid-page could trigger two concurrent
 * `/auth/refresh-token` calls, and one would invalidate the other's just-rotated token. Both
 * paths now share this single module-level promise instead.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

let refreshPromise: Promise<boolean> | null = null;

/**
 * Refresh the access token (cookie-based). Safe to call concurrently from multiple call sites —
 * only one network request is ever in flight; everyone else awaits the same promise.
 *
 * @param onFailure called once if the refresh fails (e.g. to dispatch `signOut()`).
 */
export function refreshAccessToken(onFailure: () => void): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        return true;
      }
      onFailure();
      return false;
    } catch {
      onFailure();
      return false;
    }
  })();

  // Clear the mutex once settled so a LATER expiry can trigger a fresh refresh; queued callers
  // above already captured this promise instance and will resolve correctly regardless.
  refreshPromise.finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}
