'use client';

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Form, Input, Spin, Tree, Select, Empty, Tabs } from 'antd';
import { Send, Folder, File, Menu } from '@deemlol/next-icons';
import { useParams } from 'next/navigation';
import {
    useGetQAHistoryQuery,
    useStartQASessionMutation,
    useSendQAMessageMutation,
    useGetSubmitJsonQuery
} from '@/store/api/[module]/projectApi';
import type { QAMessage } from '@/type/project.type';
import type { DataNode, TreeProps } from 'antd/es/tree';
import Editor from '@monaco-editor/react';

interface FileNode {
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
    extension?: string;
    size?: number;
}

const EXTENSION_TO_LANGUAGE: Record<string, string> = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.c': 'c',
    '.cpp': 'cpp',
    '.h': 'cpp',
    '.hpp': 'cpp',
    '.cs': 'csharp',
    '.html': 'html',
    '.css': 'css',
    '.json': 'json',
    '.md': 'markdown',
    '.sql': 'sql',
    '.xml': 'xml',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.sh': 'shell',
    '.bash': 'shell',
    '.txt': 'plaintext',
};

// Files to always ignore
const IGNORED_EXTENSIONS = new Set([
    '.sln', '.vcxproj', '.vcxproj.filters', '.vx', '.user',
    '.suo', '.exe', '.dll', '.obj', '.o', '.pdb', '.idb',
    '.ipch', '.git', '.gitignore', '.vs', '.filters'
]);

const IGNORED_FOLDERS = new Set([
    '.git', '.vs', '.vscode', '.idea', 'bin', 'obj', 'debug', 'release', 'x64', 'x86'
]);

const LectureProjQA = () => {
    const { lessonId } = useParams();
    const [formData] = Form.useForm();
    const [messages, setMessages] = useState<QAMessage[]>([]);
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef(true);

    // Code Editor State
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('plaintext');
    const [selectedFileName, setSelectedFileName] = useState<string>('');

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

    // Filter and Convert file structure to tree data
    const filterAndConvertTreeData = (node: FileNode, parentKey = '0'): DataNode | null => {
        const lowerName = node.name.toLowerCase();

        if (node.type === 'folder') {
            if (IGNORED_FOLDERS.has(lowerName)) return null;

            // If folder, recursively process children
            const children = node.children
                ?.map((child, idx) => filterAndConvertTreeData(child, `${parentKey}-${idx}`))
                .filter(Boolean) as DataNode[];

            // If folder ends up empty after filtering, should we hide it? 
            // Maybe keep it if it's not explicitly ignored, user might want to see structure.
            // But if it has no children, it's less useful. Let's keep it for now.
            return {
                title: node.name,
                key: `${parentKey}-${node.name}`,
                icon: <Folder size={16} />,
                children: children,
                selectable: false // Folders not selectable for code view
            };
        } else {
            // Check extension
            const extension = node.extension?.toLowerCase() || (node.name.includes('.') ? `.${node.name.split('.').pop()?.toLowerCase()}` : '');
            if (IGNORED_EXTENSIONS.has(extension)) return null;

            const key = `${parentKey}-${node.name}`;
            return {
                title: node.name,
                key: key,
                icon: <File size={16} />,
                isLeaf: true,
                // Store extra data for retrieval
                // @ts-ignore
                fileData: {
                    content: node.content,
                    extension: extension,
                    name: node.name
                }
            };
        }
    };

    const treeData: DataNode[] = useMemo(() => {
        if (!submitJsonData?.submit_json) return [];
        const root = filterAndConvertTreeData(submitJsonData.submit_json);
        return root ? [root] : [];
    }, [submitJsonData]);

    const onSelectData = (node: any) => {
        const { content, extension, name } = node.fileData;
        setSelectedFileContent(content || '// No content available');
        setSelectedFileName(name);

        const lang = EXTENSION_TO_LANGUAGE[extension] || 'plaintext';
        setSelectedLanguage(lang);
    };

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        if (selectedKeys.length === 0) return;

        const node = info.node as any;
        if (node.fileData) {
            onSelectData(node);
        }
    };

    // Auto-select first file
    useEffect(() => {
        if (!selectedFileName && treeData.length > 0) {
            const findFirstFile = (nodes: DataNode[]): any => {
                for (const node of nodes) {
                    // @ts-ignore
                    if (node.isLeaf && node.fileData) {
                        return node;
                    }
                    if (node.children) {
                        const found = findFirstFile(node.children);
                        if (found) return found;
                    }
                }
                return null;
            };

            const firstFile = findFirstFile(treeData);
            if (firstFile) {
                onSelectData(firstFile);
            }
        }
    }, [treeData, selectedFileName]);

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
        // Add bottom padding to prevent content from being hidden by the bottom bar
        <div className="w-full h-[calc(100vh-8rem)] flex gap-4 overflow-hidden pb-4">
            {/* Left Column: File Tree */}
            <div className="w-[20%] min-w-[200px] max-w-[300px] flex flex-col bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold mb-3 uppercase text-gray-500">File Explorer</h3>
                {jsonLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Spin />
                    </div>
                ) : treeData.length > 0 ? (
                    <div className="flex-1 overflow-y-auto">
                        <Tree
                            showIcon
                            defaultExpandAll
                            treeData={treeData}
                            onSelect={onSelect}
                            className="bg-transparent"
                            blockNode
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No files found" />
                    </div>
                )}
            </div>

            {/* Middle Column: Code Editor */}
            <div className="flex-1 min-w-0 flex flex-col bg-[#1e1e1e] rounded-lg border border-gray-700 overflow-hidden shadow-lg">
                {/* Editor Header */}
                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#3e3e3e]">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-300 text-sm font-mono">{selectedFileName || 'No file selected'}</span>
                    </div>
                    <Select
                        className="w-32"
                        size="small"
                        value={selectedLanguage}
                        onChange={setSelectedLanguage}
                        options={Object.values(EXTENSION_TO_LANGUAGE).filter((v, i, a) => a.indexOf(v) === i).map(l => ({ label: l, value: l }))}
                    // Style select for dark theme if possible, otherwise Antd default
                    />
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        language={selectedLanguage}
                        value={selectedFileContent}
                        theme="vs-dark"
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 13,
                            wordWrap: 'on',
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>

            {/* Right Column: Chat QA */}
            <div className="w-[30%] min-w-[320px] max-w-[450px] flex flex-col bg-white rounded-lg border border-gray-200 p-3 pb-0">
                <h3 className="text-lg font-semibold mb-4 border-b pb-0">Vấn đáp về Dự án</h3>

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
                                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {renderMessageContent(msg)}
                                    </div>
                                </div>
                            ))}
                            {sendingMessage && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                        <Spin size="small" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input form */}
                        <div className="gap-2 border-t pt-4">
                            <Form
                                form={formData}
                                onFinish={handleSendMessage}
                                className="flex w-full gap-2"
                            >
                                <Form.Item name="message" className="w-full h-[1.5rem]">
                                    <Input.TextArea
                                        placeholder="Nhập câu hỏi..."
                                        autoSize={{ minRows: 1, maxRows: 4 }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                formData.submit();
                                            }
                                        }}
                                        className="!bg-gray-50"
                                    />
                                </Form.Item>
                                <Button
                                    type="primary"
                                    icon={<Send size={14} />}
                                    htmlType="submit"
                                    loading={sendingMessage}
                                >
                                </Button>
                            </Form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LectureProjQA;
