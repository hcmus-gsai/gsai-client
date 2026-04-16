'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cleanupShowcaseGuestSession, ensureShowcaseGuestSession } from '../utils/guestSession';

export default function ShowcaseTeacherLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const unloadingRef = useRef(false);

    useEffect(() => {
        const onBeforeUnload = () => {
            unloadingRef.current = true;
        };

        window.addEventListener('beforeunload', onBeforeUnload);

        void ensureShowcaseGuestSession('teacher').catch(() => {
            router.replace('/auth/signin');
        });

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            if (!unloadingRef.current) {
                const path = window.location.pathname;
                if (!path.startsWith('/showcase/teacher')) {
                    void cleanupShowcaseGuestSession();
                }
            }
        };
    }, [router]);

    return <>{children}</>;
}
