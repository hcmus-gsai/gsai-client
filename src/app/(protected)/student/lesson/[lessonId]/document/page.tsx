'use client';
import '@ant-design/v5-patch-for-react-19';

import React, { useEffect } from 'react';
import { Spin } from "antd";
import { useLazyGetDocumentQuery } from '@/store/api/[module]/documentApi';
import { useParams, redirect } from 'next/navigation';
import ChatbotSection from '../components/chatbotSection';

import { useAppDispatch } from '@/store/hook';
import { addNotification } from '@/store/slice/notifySlice';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

export default function LectureDocPage() {
    const { lessonId } = useParams();
    const [getDocument, { data: document, isLoading, error }] = useLazyGetDocumentQuery();

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isFetchBaseQueryError(error) && error.status === 403) {
            dispatch(addNotification({
                type: 'error',
                message: 'Cần quyền truy cập',
                description: 'Bạn chưa đăng ký môn học này!',
                createdAt: Date.now(),
                isShown: false
            }));

            redirect('/student/home'); 
        }
    }, [error]);

    useEffect(() => {
        if (lessonId) {
            getDocument(lessonId as string);
        }
    }, [lessonId, getDocument]);
    console.log('Document: ', document);

    console.log('Document URL: ', document?.file_url);

    return (
        <div className="relative flex w-full gap-4">
            <div className="flex-1 flex flex-col gap-[0.5rem]">
                <div className="w-full relative">
                    {isLoading ? (
                        <div className="w-full flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                            <Spin size="large" />
                        </div>
                    ) : error ? (
                        <div className="w-full flex items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600">
                            <p>Error: {(error as Error).message}</p>
                        </div>
                    ) : document ? (
                        <object data={document?.file_url} type="application/pdf" width="100%" height="100%"
                            style={{ height: 'calc(100vh - 17rem)' }}
                            className="w-full h-full object-contain"
                        >
                        </object>
                    ) : null}
                </div>
            </div>

            <ChatbotSection />
        </div>
    );
}