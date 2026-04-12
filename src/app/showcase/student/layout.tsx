'use client';

import { useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const SHOWCASE_GUEST_EMAIL_KEY = 'showcaseGuestEmail';
const SHOWCASE_GUEST_MANAGED_KEY = 'showcaseGuestManaged';

const cleanupShowcaseGuest = async () => {
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
        // Best-effort cleanup when user leaves showcase.
    } finally {
        sessionStorage.removeItem(SHOWCASE_GUEST_EMAIL_KEY);
        sessionStorage.removeItem(SHOWCASE_GUEST_MANAGED_KEY);
    }
};

export default function ShowcaseStudentLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const onBeforeUnload = () => {
            void cleanupShowcaseGuest();
        };

        window.addEventListener('beforeunload', onBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            void cleanupShowcaseGuest();
        };
    }, []);

    return <>{children}</>;
}
