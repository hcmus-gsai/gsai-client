'use client';
import '@ant-design/v5-patch-for-react-19';

import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useLazyGetDocumentQuery } from '@/store/api/[module]/documentApi';
import { useParams } from 'next/navigation';
import LectureProjContent from '../components/project/project-content';
import LectureProjSubmit from '../components/project/project-submit';
import LectureProjQA from '../components/project/project-qa';

import { useAppDispatch } from '@/store/hook';
import { setFullWidthMode } from '@/store/slice/lessonSlice';

export default function LectureProjPage() {
    const { lessonId: projectId } = useParams();
    const dispatch = useAppDispatch();

    const [activeTab, setActiveTab] = useState<string>('content');

    // Handle full width mode for QA tab
    useEffect(() => {
        if (activeTab === 'qa') {
            dispatch(setFullWidthMode(true));
        } else {
            dispatch(setFullWidthMode(false));
        }

        // Cleanup on unmount
        return () => {
            dispatch(setFullWidthMode(false));
        };
    }, [activeTab, dispatch]);

    const [
        getProjectDocument,
        { data: projectDoc, isLoading, error }
    ] = useLazyGetDocumentQuery();

    useEffect(() => {
        if (projectId && activeTab === 'content') {
            getProjectDocument(projectId as string);
        }
    }, [projectId, activeTab, getProjectDocument]);

    // Cleanup on unmount of component
    useEffect(() => {
        return () => {
            dispatch(setFullWidthMode(false));
        }
    }, [dispatch]);

    const tabItems: TabsProps['items'] = [
        {
            key: 'content',
            label: 'Nội dung',
        },
        {
            key: 'submit',
            label: 'Nộp bài',
        },
        {
            key: 'qa',
            label: 'Vấn đáp',
        },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'content':
                return (
                    <LectureProjContent
                        isLoading={isLoading}
                        error={error}
                        projectDoc={projectDoc}
                    />
                );

            case 'submit':
                return <LectureProjSubmit />;

            case 'qa':
                return <LectureProjQA />;

            default:
                return null;
        }
    };

    return (
        <>
            <div className="flex-1 flex flex-col gap-[0.5rem]">
                {/* Tabs ở góc trên bên trái */}
                <Tabs
                    items={tabItems}
                    activeKey={activeTab}
                    onChange={setActiveTab}
                />

                <div className="w-full relative">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}
