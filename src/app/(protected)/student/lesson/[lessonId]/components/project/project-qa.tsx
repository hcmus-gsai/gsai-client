'use client';

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Form, Input, Spin, Tree, Select, Empty, Tabs } from 'antd';
import { Send as SendIcon, Folder as FolderIcon, File as FileIcon, Menu as MenuIcon, Play } from '@deemlol/next-icons';
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from 'next/image';
import AudioWaveForm from "@/../public/student/AudioWaveForm.svg";
import AudioWaveFormHover from "@/../public/student/AudioWaveFormHover.svg";

//For Voice Recorder
import { AudioOutlined, StopOutlined, DeleteOutlined, BorderOutlined } from '@ant-design/icons';
import { useTranscribeAudioMutation } from '@/store/api/[module]/voiceApi';
import { useGetCoursesByLessonIdQuery } from '@/store/api/[module]/courseApi';
import { ContentType } from '@/type/chat.type';

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
    const [answerMode, setAnswerMode] = useState<'text' | 'audio'>('text');
    const [row, setRow] = useState(1);

    const { data: courseResult } = useGetCoursesByLessonIdQuery(lessonId as string);
    const teacherId = courseResult?.data?.teacher_id;

    //===========ASR Service============//
    const [permission, setPermission] = useState(false);
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [transcribeAudio] = useTranscribeAudioMutation();

    const [volume, setVolume] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);

    const requestMicrophoneAccess = async () => {
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            setPermission(true);
            setStream(streamData);
            alert("Cho phép truy cập Micro thành công!");
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }

    const handleAudioRecording = async () => {
        if (!permission) {
            await requestMicrophoneAccess();
            return;
        }

        if (!recording && stream) {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });

                const formData = new FormData();
                formData.append("file", audioFile);

                try {
                    const { transcript } = await transcribeAudio(formData).unwrap();
                    setMessages(prev => [...prev, {
                        id: `temp-${Date.now()}`,
                        lesson_id: lessonId as string,
                        enrollment_id: '',
                        role: 'user',
                        content: { message: transcript },
                        timestamp: new Date().toISOString(),
                    }]);

                    const response = await sendMessage({
                        lessonId: lessonId as string,
                        message: transcript,
                        answer_mode: answerMode,
                    }).unwrap();

                    const botMsg: QAMessage = {
                        id: response.assistantMessage.id,
                        lesson_id: response.assistantMessage.lesson_id,
                        enrollment_id: response.assistantMessage.enrollment_id,
                        role: 'assistant',
                        content: response.assistantMessage.content,
                        audio_url: response.assistantMessage.audio_url,
                        timestamp: response.assistantMessage.timestamp,
                    };
                    setMessages((prev) => [...prev, botMsg]);
                } catch (error) {
                    console.error(error);
                }

                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                audioContextRef.current?.close();
                setVolume(0);
            };

            mediaRecorder.start();
            setRecording(true);

            const audioContext = new AudioContext();
            await audioContext.resume();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyserRef.current = analyser;

            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.fftSize);

            const animate = () => {
                analyser.getByteTimeDomainData(dataArray);

                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    const value = dataArray[i] - 128;
                    sum += Math.abs(value);
                }

                setVolume(sum / dataArray.length);
                rafRef.current = requestAnimationFrame(animate);
            };

            animate();
        } else if (recording && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };
    //====================================


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
                    audio_url: msg.audio_url,
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
    const handleMessageSubmit = async () => {
        const data = formData.getFieldsValue();
        if (!data.chatMessage?.trim()) return;

        const userMessage = data.chatMessage.trim();
        formData.resetFields(['chatMessage']);
        setRow(1);

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
                answer_mode: answerMode,
            }).unwrap();

            // Add bot response using the actual backend structure
            const botMsg: QAMessage = {
                id: response.assistantMessage.id,
                lesson_id: response.assistantMessage.lesson_id,
                enrollment_id: response.assistantMessage.enrollment_id,
                role: 'assistant',
                content: response.assistantMessage.content,
                audio_url: response.assistantMessage.audio_url,
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
                icon: <FolderIcon size={16} />,
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
                icon: <FileIcon size={16} />,
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

    // Helper to get message text string
    const getMessageText = (msg: QAMessage): string => {
        if (msg.role === 'user') {
            const userText = typeof msg.content === 'string'
                ? msg.content
                : msg.content?.message || msg.content?.text || JSON.stringify(msg.content);
            return typeof userText === 'string' ? userText : JSON.stringify(userText);
        } else {
            if (typeof msg.content === 'string') return msg.content;
            if (msg.content?.response) {
                return typeof msg.content.response === 'string'
                    ? msg.content.response
                    : JSON.stringify(msg.content.response);
            }
            if (msg.content) {
                return JSON.stringify(msg.content, null, 2);
            }
            return '';
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
                            {messages.map((msg, index) =>
                                msg.role === 'user' ? (
                                    <div
                                        key={index}
                                        className="ml-auto w-fit max-w-[80%] bg-[var(--color-secondary)] rounded-[20px] px-[0.75rem] py-[0.5rem] text-white"
                                    >
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {getMessageText(msg)}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div
                                        key={index}
                                        className="w-fit max-w-[80%] bg-gray-200 rounded-[20px] px-[0.75rem] py-[0.5rem]"
                                    >
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {getMessageText(msg)}
                                        </ReactMarkdown>
                                        {/* Nếu có audio response, hiển thị thêm nút play */}
                                        {msg.audio_url && (
                                            <Button
                                                onClick={() => {
                                                    const audio = new Audio(msg.audio_url);
                                                    audio.play().catch(error => {
                                                        console.error('Error playing audio response:', error);
                                                    });
                                                }}
                                                className="!mt-2 !px-2 !py-1 !text-sm !rounded-full !bg-gray-300 !text-black"
                                                icon={<Play className="!w-[16px] !h-[16px]" />}
                                            />
                                        )}
                                    </div>
                                )
                            )}
                            {sendingMessage && (
                                <div className="w-fit max-w-[80%] bg-gray-200 rounded-[20px] px-[0.75rem] py-[0.5rem]">
                                    <div className="flex space-x-1 h-6 items-center w-12 pl-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input form */}
                        <div className="border-t border-gray-200 p-[0.5rem] flex-shrink-0">
                            <Form
                                form={formData}
                                onFinish={handleMessageSubmit}
                                className={`w-full flex items-end gap-2 !bg-white !border border-gray-200 !px-[0.5rem] !py-[0.5rem] ${row >= 2 ? 'rounded-[20px]' : 'rounded-full'}`}
                            >
                                <Form.Item name="chatMessage" className="!mb-0 flex-1">
                                    <Input.TextArea
                                        placeholder="Nhập câu hỏi"
                                        autoSize={{ minRows: 1, maxRows: 7 }}
                                        classNames={{
                                            textarea: "!border-none !outline-none focus:!shadow-none",
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                formData.submit();
                                            }
                                        }}
                                        onChange={(e) => {
                                            const lines = e.target.value.split('\n').length;
                                            setRow(lines);
                                        }}
                                    />
                                </Form.Item>

                                <Button
                                    onClick={handleAudioRecording}
                                    className="!rounded-full !border-none !relative !flex !items-center !justify-center"
                                >
                                    {recording ? (
                                        <div className="flex items-center gap-[3px] h-[22px]">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className="w-[3px] bg-[var(--color-secondary)] rounded"
                                                    style={{
                                                        height: `${Math.min(
                                                            22,
                                                            Math.max(4, volume * 0.8 * Math.random())
                                                        )}px`,
                                                        transition: "height 0.08s linear",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <AudioOutlined />
                                    )}
                                </Button>

                                <Button
                                    onClick={() => setAnswerMode(prev => prev === 'text' ? 'audio' : 'text')}
                                    icon={
                                        <div className="relative w-6 h-6">
                                            <Image
                                                src={AudioWaveForm}
                                                alt="Audio Wave Form"
                                                width={24}
                                                height={24}
                                                className={`absolute top-0 left-1/2 -translate-x-1/2 transition-opacity duration-300 ease-in-out ${answerMode === 'audio' ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
                                            />
                                            <Image
                                                src={AudioWaveFormHover}
                                                alt="Audio wave form hover"
                                                width={24}
                                                height={24}
                                                className={`absolute top-0 left-1/2 -translate-x-1/2 transition-opacity duration-300 ease-in-out ${answerMode === 'audio' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                            />
                                        </div>
                                    }
                                    className={`group !rounded-full !border-none !relative !flex !items-center !justify-center !w-8 !h-8 !p-0 ${answerMode === 'audio' ? '!bg-blue-50' : ''}`}
                                    title="Chế độ phản hồi bằng âm thanh"
                                />
                            </Form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LectureProjQA;
