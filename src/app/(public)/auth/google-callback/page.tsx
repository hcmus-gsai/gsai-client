import { Suspense } from 'react';
import AuthCallbackClient from './callback-client';

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<AuthCallbackLoading />}>
            <AuthCallbackClient />
        </Suspense>
    );
}

function AuthCallbackLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h2 className="mt-4 text-xl font-semibold">Đang xác thực...</h2>
                <p className="mt-2 text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
}
