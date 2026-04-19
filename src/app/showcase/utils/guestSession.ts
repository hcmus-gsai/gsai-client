'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const SHOWCASE_SESSION_KEY = 'showcaseSession';

type ShowcaseRole = 'student' | 'teacher';

const setShowcaseModeCookie = () => {
    document.cookie = 'showcaseMode=1; path=/; max-age=86400; samesite=lax';
};

const clearShowcaseModeCookie = () => {
    document.cookie = 'showcaseMode=; path=/; max-age=0; samesite=lax';
};

export const ensureShowcaseGuestSession = async (role: ShowcaseRole): Promise<void> => {
    // Active showcase session exists in this tab — just re-arm the cookie
    if (sessionStorage.getItem(SHOWCASE_SESSION_KEY)) {
        setShowcaseModeCookie();
        return;
    }

    // No session key. Check if there's any authenticated user via existing cookie.
    try {
        const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'GET',
            credentials: 'include',
        });

        if (profileResponse.ok) {
            const profile = await profileResponse.json();
            // Real (non-guest) user — don't overwrite their session with a guest account.
            // Guest accounts use the @gsai.local email domain; anything else is a real user.
            if (!profile?.email?.endsWith('@gsai.local')) {
                setShowcaseModeCookie();
                return;
            }
            // Guest account detected but no session key — this is a race condition where
            // cleanup already removed the key but the DELETE request hasn't completed yet
            // (old JWT is still alive). Fall through to create a fresh guest account.
        }
    } catch {
        // Network error on profile check — proceed to create guest account
    }

    // Create a new showcase guest account
    const response = await fetch(`${API_BASE_URL}/showcase/guest-account`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
    });

    if (!response.ok) {
        throw new Error('Failed to create showcase guest account');
    }

    const data = await response.json();
    sessionStorage.setItem(
        SHOWCASE_SESSION_KEY,
        JSON.stringify({ userId: data.userId, role: data.role, courseId: data.courseId }),
    );
    setShowcaseModeCookie();
};

export const cleanupShowcaseGuestSession = async (): Promise<void> => {
    if (!sessionStorage.getItem(SHOWCASE_SESSION_KEY)) return;

    sessionStorage.removeItem(SHOWCASE_SESSION_KEY);
    clearShowcaseModeCookie();

    try {
        await fetch(`${API_BASE_URL}/showcase/guest-account`, {
            method: 'DELETE',
            credentials: 'include',
            keepalive: true,
        });
    } catch {
        // Best-effort cleanup — ignore errors on page unload
    }
};

export const getShowcaseSession = (): { userId: string; role: string; courseId: string | null } | null => {
    const raw = sessionStorage.getItem(SHOWCASE_SESSION_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};
