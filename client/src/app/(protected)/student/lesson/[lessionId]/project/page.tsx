'use client';
import '@ant-design/v5-patch-for-react-19';

import React, { useEffect } from 'react';
import { Spin } from "antd";   
import { useLazyGetDocumentQuery, useGetDocumentQuery } from '@/store/api/[module]/documentApi';
import { useParams } from 'next/navigation';
import ChatbotSection from '../components/chatbotSection';

export default function LectureDocPage() {
    const { lessionId } = useParams();
    console.log('Lesson ID: ', lessionId);
    const [getDocument, { data: document, isLoading, error }] = useLazyGetDocumentQuery();
    useEffect(() => {
        if (lessionId) {
            getDocument(lessionId as string);
        }
    }, [lessionId, getDocument]);
    console.log('Document: ', document);

    return (
        <>
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
                        <iframe
                            src={document.file_url}
                            className="w-full rounded-lg border border-gray-200"
                            style={{ height: 'calc(100vh - 17rem)' }}
                            title="Document Viewer"
                        />
                    ) : null}
                </div>
            </div>

            <ChatbotSection />
        </>
    );
}