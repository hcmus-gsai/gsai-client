'use client';
import '@ant-design/v5-patch-for-react-19';

import React, { useEffect, useState } from 'react';
import { Button, Spin, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useLazyGetProjectDocumentQuery } from '@/store/api/[module]/projectApi';
import { useParams, redirect, useRouter } from 'next/navigation';
import { cleanupShowcaseGuestSession } from '@/app/showcase/utils/guestSession';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LectureProjContent from '../components/project/project-content';
import LectureProjSubmit from '../components/project/project-submit';
import LectureProjQAV2 from '../components/project/project-qa-v2';
import ProjectSocraticChat from '../components/project/project-socratic-chat';

import { useAppDispatch } from '@/store/hook';
import { setFullWidthMode } from '@/store/slice/lessonSlice';

import { addNotification } from '@/store/slice/notifySlice';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RobotOutlined } from '@ant-design/icons';
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

function isMarkdownFile(fileUrl?: string): boolean {
    if (!fileUrl) return false;
    const normalized = fileUrl.split('?')[0].toLowerCase();
    return normalized.endsWith('.md');
}

const markdownComponents: Components = {
    h1({ children, ...props }) {
        return (
            <h1 className="mt-6 mb-4 text-3xl font-bold text-[#24292f] border-b border-[#d0d7de] pb-2" {...props}>
                {children}
            </h1>
        );
    },
    h2({ children, ...props }) {
        return (
            <h2 className="mt-6 mb-3 text-2xl font-semibold text-[#24292f] border-b border-[#d0d7de] pb-1.5" {...props}>
                {children}
            </h2>
        );
    },
    h3({ children, ...props }) {
        return (
            <h3 className="mt-5 mb-2 text-xl font-semibold text-[#24292f]" {...props}>
                {children}
            </h3>
        );
    },
    h4({ children, ...props }) {
        return (
            <h4 className="mt-4 mb-2 text-lg font-semibold text-[#24292f]" {...props}>
                {children}
            </h4>
        );
    },
    h5({ children, ...props }) {
        return (
            <h5 className="mt-4 mb-2 text-base font-semibold text-[#24292f]" {...props}>
                {children}
            </h5>
        );
    },
    h6({ children, ...props }) {
        return (
            <h6 className="mt-4 mb-2 text-sm font-semibold text-[#57606a]" {...props}>
                {children}
            </h6>
        );
    },
    code({ className, children, ...props }: any) {
        const content = String(children ?? '');
        const isBlockCode = /language-/.test(className || '') || content.includes('\n');

        if (!isBlockCode) {
            return (
                <code
                    className="font-mono text-[0.92em] text-[#1f2328]"
                    {...props}
                >
                    {children}
                </code>
            );
        }

        return (
            <pre className="my-4 overflow-x-auto rounded-lg border border-[#d0d7de] bg-[#0d1117] p-4 text-[#e6edf3]">
                <code className={className} {...props}>
                    {children}
                </code>
            </pre>
        );
    },
    blockquote({ children, ...props }) {
        return (
            <blockquote
                className="my-4 border-l-4 border-[#d0d7de] pl-4 text-[#57606a]"
                {...props}
            >
                {children}
            </blockquote>
        );
    },
    table({ children, ...props }) {
        return (
            <div className="my-4 overflow-x-auto">
                <table className="min-w-full border-collapse border border-[#d0d7de]" {...props}>
                    {children}
                </table>
            </div>
        );
    },
    th({ children, ...props }) {
        return (
            <th className="border border-[#d0d7de] bg-[#f6f8fa] px-3 py-2 text-left font-semibold" {...props}>
                {children}
            </th>
        );
    },
    td({ children, ...props }) {
        return (
            <td className="border border-[#d0d7de] px-3 py-2" {...props}>
                {children}
            </td>
        );
    },
};

export default function LectureProjPage() {
    const { lessonId: projectId } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleBackToHome = async () => {
        await cleanupShowcaseGuestSession();
        router.push('/');
    };

    const [activeTab, setActiveTab] = useState<string>('content');
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [chatPanelWidth, setChatPanelWidth] = useState<number>(0);
    const [isWideScreen, setIsWideScreen] = useState<boolean>(false);
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [markdownLoading, setMarkdownLoading] = useState<boolean>(false);
    const [markdownError, setMarkdownError] = useState<string>('');

    // Handle full width mode for QA tab
    useEffect(() => {
        if (activeTab !== 'content' && isChatOpen) {
            setIsChatOpen(false);
        }

        if (activeTab === 'qa') {
            dispatch(setFullWidthMode(true));
        } else {
            dispatch(setFullWidthMode(false));
        }

        // Cleanup on unmount
        return () => {
            dispatch(setFullWidthMode(false));
        };
    }, [activeTab, dispatch, isChatOpen]);

    const [
        getProjectDocument,
        { data: projectDoc, isLoading, error }
    ] = useLazyGetProjectDocumentQuery();

    const dispatch_error = useAppDispatch();
    useEffect(() => {
        if (isFetchBaseQueryError(error) && error.status === 403) {
            dispatch_error(addNotification({
                type: 'error',
                message: 'Cần quyền truy cập',
                description: 'Bạn chưa đăng ký môn học này!',
                createdAt: Date.now(),
                isShown: false
            }));

            redirect('/showcase/student'); 
        }
    }, [error]);

    useEffect(() => {
        if (projectId && activeTab === 'content') {
            getProjectDocument(projectId as string);
        }
    }, [projectId, activeTab, getProjectDocument]);

    const hasMarkdownOption = isMarkdownFile(projectDoc?.file_url);

    useEffect(() => {
        const loadMarkdown = async () => {
            if (!hasMarkdownOption || activeTab !== 'content' || !projectDoc?.file_url) {
                return;
            }

            try {
                setMarkdownLoading(true);
                setMarkdownError('');
                const response = await fetch(projectDoc.file_url);
                if (!response.ok) {
                    throw new Error('Không thể tải nội dung markdown');
                }
                const text = await response.text();
                setMarkdownContent(text);
            } catch (err) {
                setMarkdownError('Không thể render markdown từ tài liệu hiện tại.');
            } finally {
                setMarkdownLoading(false);
            }
        };

        loadMarkdown();
    }, [activeTab, hasMarkdownOption, projectDoc?.file_url]);

    // Cleanup on unmount of component
    useEffect(() => {
        return () => {
            dispatch(setFullWidthMode(false));
        }
    }, [dispatch]);

    useEffect(() => {
        const updateScreenMode = () => {
            setIsWideScreen(window.innerWidth >= 1280);
        };

        updateScreenMode();
        window.addEventListener('resize', updateScreenMode);
        return () => window.removeEventListener('resize', updateScreenMode);
    }, []);

    const tabItems: TabsProps['items'] = [
        {
            key: 'content',
            label: 'Nội dung',
        },
        {
            key: 'submit',
            label: 'Bài nộp',
        },
        {
            key: 'qa',
            label: 'Vấn đáp',
        },
    ];

    const renderContent = () => {
        const reservedRightSpace = isWideScreen && isChatOpen && chatPanelWidth > 0 ? chatPanelWidth + 24 : 0;

        const renderMarkdownPanel = () => {
            if (markdownLoading) {
                return (
                    <div className="w-full flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-10">
                        <Spin size="large" />
                    </div>
                );
            }

            if (markdownError) {
                return (
                    <div className="w-full flex items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 py-6 px-4">
                        <p>{markdownError}</p>
                    </div>
                );
            }

            return (
                <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-4 md:px-6 md:py-6">
                    <article className="prose max-w-none prose-headings:text-[#24292f] prose-p:text-[#24292f] prose-strong:text-[#24292f] prose-a:text-[#0969da] prose-li:text-[#24292f]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {markdownContent || 'Tài liệu markdown trống.'}
                        </ReactMarkdown>
                    </article>
                </div>
            );
        };

        switch (activeTab) {
            case 'content':
                return (
                    <div className="w-full relative">
                        <div
                            className="w-full min-w-0 transition-all duration-300"
                            style={reservedRightSpace > 0 ? { paddingRight: `${reservedRightSpace * 0.8}px` } : undefined}
                        >
                            {hasMarkdownOption ? (
                                renderMarkdownPanel()
                            ) : (
                                <LectureProjContent
                                    isLoading={isLoading}
                                    error={error}
                                    projectDoc={projectDoc}
                                />
                            )}
                        </div>

                        {!isChatOpen && (
                            <div className="fixed bottom-6 right-6 z-40">
                                <Button
                                    onClick={() => setIsChatOpen(true)}
                                    className="!w-[56px] !h-[56px] !p-0 !rounded-full !bg-[var(--color-secondary)]"
                                    icon={<RobotOutlined className="!text-white text-[24px]" />}
                                />
                            </div>
                        )}

                        <div>
                            <ProjectSocraticChat
                                lessonId={projectId as string}
                                variant="floating"
                                open={isChatOpen}
                                onOpenChange={setIsChatOpen}
                                onPanelWidthChange={setChatPanelWidth}
                                showTrigger={false}
                            />
                        </div>
                    </div>
                );

            case 'submit':
                return <LectureProjSubmit />;

            case 'qa':
                return <LectureProjQAV2 />;

            default:
                return null;
        }
    };

    return (
        <>
            <div className="flex-1 flex flex-col gap-[0.5rem]">
                <button
                    onClick={handleBackToHome}
                    className="self-start inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[var(--color-secondary)] transition-colors"
                >
                    <span aria-hidden>←</span>
                    <span>Về trang chủ</span>
                </button>
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
