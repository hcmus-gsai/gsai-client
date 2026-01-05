'use client';

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Input, Spin, Tree } from 'antd';
import { Send, Folder, File } from '@deemlol/next-icons';
import { useParams } from 'next/navigation';
import {
    useGetQAHistoryQuery,
    useStartQASessionMutation,
    useSendQAMessageMutation,
    useGetSubmitJsonQuery
} from '@/store/api/[module]/projectApi';
import type { QAMessage } from '@/type/project.type';
import type { DataNode } from 'antd/es/tree';

interface FileNode {
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
    extension?: string;
    size?: number;
}

const LectureProjQA = () => {
    const { lessonId } = useParams();
    const [formData] = Form.useForm();
    const [messages, setMessages] = useState<QAMessage[]>([]);
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef(true);

    // API hooks
    const { data: historyData, isLoading: historyLoading } = useGetQAHistoryQuery(lessonId as string, {
        skip: !lessonId,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
    });

    const [startSession, { isLoading: startingSession }] = useStartQASessionMutation();
    const [sendMessage, { isLoading: sendingMessage }] = useSendQAMessageMutation();
    const { data: submitJsonData, isLoading: jsonLoading } = useGetSubmitJsonQuery(lessonId as string, {
        skip: !lessonId,
    });

    // Load history on mount - only once
    const hasLoadedHistory = useRef(false);

    useEffect(() => {
        if (historyData?.history && historyData.history.length > 0 && !hasLoadedHistory.current) {
            const loadedMessages: QAMessage[] = historyData.history
                .filter((msg: any) => msg.role !== 'system')
                .map((msg: any) => ({
                    id: msg.id,
                    lesson_id: msg.lesson_id,
                    enrollment_id: msg.enrollment_id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp,
                }));
            setMessages(loadedMessages);
            setIsSessionStarted(true);
            hasLoadedHistory.current = true;
        }
    }, [historyData]);

    // Auto-scroll to latest message
    useEffect(() => {
        if (chatContainerRef.current && messages.length > 0) {
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTo({
                        top: chatContainerRef.current.scrollHeight,
                        behavior: isInitialLoad.current ? 'instant' : 'smooth'
                    });
                    isInitialLoad.current = false;
                }
            }, 100);
        }
    }, [messages]);

    // Handle start session
    const handleStartSession = async () => {
        try {
            await startSession(lessonId as string).unwrap();
            setIsSessionStarted(true);
        } catch (error) {
            console.error('Error starting session:', error);
        }
    };

    // Handle send message
    const handleSendMessage = async () => {
        const data = formData.getFieldsValue();
        if (!data.message?.trim()) return;

        const userMessage = data.message.trim();
        formData.resetFields(['message']);

        // Add user message optimistically
        const tempUserMsg: QAMessage = {
            id: `temp-${Date.now()}`,
            lesson_id: lessonId as string,
            enrollment_id: '', // Will be populated by backend
            role: 'user',
            content: { message: userMessage },
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);

        try {
            const response = await sendMessage({
                lessonId: lessonId as string,
                message: userMessage,
            }).unwrap();

            // Add bot response using the actual backend structure
            const botMsg: QAMessage = {
                id: response.assistantMessage.id,
                lesson_id: response.assistantMessage.lesson_id,
                enrollment_id: response.assistantMessage.enrollment_id,
                role: 'assistant',
                content: response.assistantMessage.content,
                timestamp: response.assistantMessage.timestamp,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg: QAMessage = {
                id: `error-${Date.now()}`,
                lesson_id: lessonId as string,
                enrollment_id: '',
                role: 'assistant',
                content: { response: 'Có lỗi xảy ra, vui lòng thử lại.' },
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    // Convert file structure to tree data
    const convertToTreeData = (node: FileNode, parentKey = '0'): DataNode => {
        const key = `${parentKey}-${node.name}`;
        const isFolder = node.type === 'folder';

        return {
            title: node.name,
            key,
            icon: isFolder ? <Folder size={16} /> : <File size={16} />,
            children: node.children?.map((child, idx) => convertToTreeData(child, `${key}-${idx}`)),
        };
    };

    const treeData: DataNode[] = submitJsonData?.submit_json
        ? [convertToTreeData(submitJsonData.submit_json)]
        : [];

    // Render message content
    const renderMessageContent = (msg: QAMessage) => {
        if (msg.role === 'user') {
            // User message - extract text from various possible structures
            const userText = typeof msg.content === 'string'
                ? msg.content
                : msg.content?.message || msg.content?.text || JSON.stringify(msg.content);
            return <p className="text-white text-wrap wrap-break-word">{userText}</p>;
        } else {
            // Assistant message - handle complex content structure
            let responseText = '';

            if (typeof msg.content === 'string') {
                responseText = msg.content;
            } else if (msg.content?.response) {
                // New message format from our optimistic update
                responseText = typeof msg.content.response === 'string'
                    ? msg.content.response
                    : JSON.stringify(msg.content.response);
            } else if (msg.content) {
                // Complex content from history (e.g., repository_structure, assignment_requirements)
                // For now, try to extract meaningful text or stringify
                responseText = JSON.stringify(msg.content, null, 2);
            }

            return <p className="text-gray-800 text-wrap wrap-break-word whitespace-pre-wrap">{responseText}</p>;
        }
    };

    if (historyLoading) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-17rem)] flex gap-4">
            {/* Left side - Chat interface */}
            <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">Vấn đáp về Dự án</h3>

                {!isSessionStarted && messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <p className="text-gray-500 text-center">
                            Bắt đầu phiên hỏi đáp để nhận được sự hỗ trợ từ AI về dự án của bạn
                        </p>
                        <Button
                            type="primary"
                            size="large"
                            loading={startingSession}
                            onClick={handleStartSession}
                        >
                            Bắt đầu hỏi đáp
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Messages container */}
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2"
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                            }`}
                                    >
                                        {renderMessageContent(msg)}
                                    </div>
                                </div>
                            ))}
                            {sendingMessage && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 rounded-2xl px-4 py-2">
                                        <Spin size="small" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input form */}
                        <Form
                            form={formData}
                            onFinish={handleSendMessage}
                            className="flex gap-2 items-end border-t pt-4"
                        >
                            <Form.Item name="message" className="flex-1 mb-0">
                                <Input.TextArea
                                    placeholder="Nhập câu hỏi về dự án..."
                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            formData.submit();
                                        }
                                    }}
                                />
                            </Form.Item>
                            <Button
                                type="primary"
                                icon={<Send size={16} />}
                                htmlType="submit"
                                loading={sendingMessage}
                            >
                                Gửi
                            </Button>
                        </Form>
                    </>
                )}
            </div>

            {/* Right side - File tree */}
            <div className="w-[400px] flex flex-col bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">Cấu trúc Dự án</h3>
                {jsonLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Spin />
                    </div>
                ) : submitJsonData?.submit_json ? (
                    <div className="flex-1 overflow-y-auto">
                        <Tree
                            showIcon
                            defaultExpandAll
                            treeData={treeData}
                            className="bg-transparent"
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500 text-center">
                            Chưa có thông tin cấu trúc dự án
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LectureProjQA;
