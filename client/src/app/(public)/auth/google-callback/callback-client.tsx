'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin } from 'antd';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const success = searchParams.get('success');
        const role = searchParams.get('role');
        const error = searchParams.get('error');

        if (success === 'true') {
            // Cookies are already set by backend
            // Redirect based on role
            if (role === 'student') {
                router.push('/student/home');
            } else if (role === 'teacher') {
                router.push('/teacher/dashboard');
            } else {
                router.push('/');
            }
        } else {
            // Authentication failed
            router.push(`/auth/signin?error=${error || 'unknown'}`);
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <Spin size="large" />
                <h2 className="mt-4 text-xl font-semibold">Đang xác thực...</h2>
                <p className="mt-2 text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
}
