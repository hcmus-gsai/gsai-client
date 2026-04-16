'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const SHOWCASE_GUEST_EMAIL_KEY = 'showcaseGuestEmail';
export const SHOWCASE_GUEST_MANAGED_KEY = 'showcaseGuestManaged';
export const SHOWCASE_MODE_COOKIE = 'showcaseMode';

type ShowcaseRole = 'student' | 'teacher';

export const setShowcaseModeCookie = () => {
    document.cookie = `${SHOWCASE_MODE_COOKIE}=1; path=/; max-age=86400; samesite=lax`;
};

export const clearShowcaseModeCookie = () => {
    document.cookie = `${SHOWCASE_MODE_COOKIE}=; path=/; max-age=0; samesite=lax`;
};

export const ensureShowcaseGuestSession = async (role: ShowcaseRole) => {
    const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        credentials: 'include',
    });

    if (profileResponse.ok) {
        const managed = sessionStorage.getItem(SHOWCASE_GUEST_MANAGED_KEY);
        if (managed === '1') {
            setShowcaseModeCookie();
        }
        return;
    }

    const guestEmail = `showcase.guest.${role}.${crypto.randomUUID()}@email.com`;
    const guestPassword = 'Password123!';

    const signUpResponse = await fetch(`${API_BASE_URL}/auth/sign-up`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: guestEmail,
            password: guestPassword,
            role,
        }),
    });

    if (!signUpResponse.ok) {
        throw new Error('Cannot create showcase guest account');
    }

    sessionStorage.setItem(SHOWCASE_GUEST_EMAIL_KEY, guestEmail);
    sessionStorage.setItem(SHOWCASE_GUEST_MANAGED_KEY, '1');
    setShowcaseModeCookie();
};

export const cleanupShowcaseGuestSession = async () => {
    const email = sessionStorage.getItem(SHOWCASE_GUEST_EMAIL_KEY);
    const managed = sessionStorage.getItem(SHOWCASE_GUEST_MANAGED_KEY);

    if (!email || managed !== '1') {
        return;
    }

    try {
        await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'DELETE',
            credentials: 'include',
            keepalive: true,
        });

        await fetch(`${API_BASE_URL}/auth/sign-out`, {
            method: 'POST',
            credentials: 'include',
            keepalive: true,
        });
    } catch {
        // Best-effort cleanup when leaving showcase flow.
    } finally {
        clearShowcaseModeCookie();
        sessionStorage.removeItem(SHOWCASE_GUEST_EMAIL_KEY);
        sessionStorage.removeItem(SHOWCASE_GUEST_MANAGED_KEY);
    }
};
