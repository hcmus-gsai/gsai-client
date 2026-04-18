'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cleanupShowcaseGuestSession, ensureShowcaseGuestSession } from './utils/guestSession';

export default function ShowcaseGuestLayout({
    children,
    role,
}: {
    children: React.ReactNode;
    role: 'student' | 'teacher';
}) {
    const router = useRouter();
    const cleanedUpRef = useRef(false);
    const isUnloadingRef = useRef(false);

    useEffect(() => {
        ensureShowcaseGuestSession(role).catch(() => {
            router.replace('/showcase');
        });

        const runCleanup = () => {
            if (cleanedUpRef.current) return;
            cleanedUpRef.current = true;
            void cleanupShowcaseGuestSession();
        };

        const onBeforeUnload = () => { isUnloadingRef.current = true; };
        const onPageHide = () => { runCleanup(); };

        window.addEventListener('beforeunload', onBeforeUnload);
        window.addEventListener('pagehide', onPageHide);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            window.removeEventListener('pagehide', onPageHide);
            if (!isUnloadingRef.current) runCleanup();
        };
    }, [role, router]);

    return <>{children}</>;
}
