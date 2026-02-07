'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin } from 'antd';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const success = searchParams.get('success');
                const role = searchParams.get('role');
                const error = searchParams.get('error');
        

                if (success === 'true' && role) {
                    // Cookies are already set by backend
                    // Redirect based on role
                    
                    // Add a small delay to ensure cookies are processed
                    // (browser needs time to set the cookies from Set-Cookie headers)
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    if (role === 'student') {
                        console.log('→ Redirecting to /student/home');
                        router.push('/student/home');
                        window.history.replaceState({}, document.title, "/student/home");
                    } else if (role === 'teacher') {
                        console.log('→ Redirecting to /teacher/home');
                        router.push('/teacher/home');
                        window.history.replaceState({}, document.title, "/teacher/home");
                    } else if (role === 'guest') {
                        console.log('→ Redirecting to /');
                        router.push('/');
                    }
                } else if (!role) {
                    // First-time user, needs to complete profile
                    console.log('New user, redirecting to profile completion');
                    router.push('/auth/complete-profile');
                    window.history.replaceState({}, document.title, "/auth/complete-profile");
                } else {
                    // Authentication failed
                    const errorMsg = error || 'unknown';
                    console.error('Auth failed with error:', errorMsg);
                    setDebugInfo(`Error: ${errorMsg}`);
                    
                    // Redirect back to signin with error
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    router.push(`/auth/signin?error=${errorMsg}`);
                }
            } catch (err) {
                console.error('Error in AuthCallback:', err);
                setDebugInfo(`Error: ${err instanceof Error ? err.message : String(err)}`);
                
                // Redirect to signin on error
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push('/auth/signin');
            } finally {
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                {isProcessing ? (
                    <>
                        <Spin size="large" />
                        <h2 className="mt-4 text-xl font-semibold">Đang xác thực...</h2>
                        <p className="mt-2 text-gray-600">Vui lòng đợi trong giây lát</p>
                    </>
                ) : (
                    <p className="text-lg text-gray-600">Đang chuyển hướng...</p>
                )}
                {debugInfo && (
                    <p className="mt-4 text-xs text-blue-500 font-mono bg-blue-50 p-2 rounded max-w-md">
                        {debugInfo}
                    </p>
                )}
            </div>
        </div>
    );
}

// Wrap with Suspense to handle useSearchParams
import { Suspense } from 'react';

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spin size="large" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
