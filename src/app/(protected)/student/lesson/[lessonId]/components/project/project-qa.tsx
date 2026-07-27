'use client';

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Form, Input, Spin, Tree, Select, Empty, Drawer, Tabs, Alert, Collapse, Skeleton, Progress } from 'antd';
import { Send as SendIcon, Folder as FolderIcon, File as FileIcon, Menu as MenuIcon, Play } from '@deemlol/next-icons';
import { useParams } from 'next/navigation';
import {
    ShowcaseGradingReport,
    ShowcaseQAQuestion,
    useGetQAHistoryQuery,
    useStartQASessionMutation,
    useSendQAMessageMutation,
    useGetSubmitJsonQuery,
    useLazyGetProjectQAReportQuery
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

import { useAppDispatch } from '@/store/hook';
import { addNotification } from '@/store/slice/notifySlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

type QAStage = 'loading' | 'interviewing' | 'grading' | 'result';

type QuestionStatus = 'asking' | 'clarifying' | 'probing' | 'concluded_pass' | 'concluded_fail';

type ChatRole = 'agent' | 'student';

const QA_LABELS = {
    loadingSession: 'Đang khởi tạo phiên vấn đáp...',
    waitingAgent: 'AI đang phản hồi...',
    grading: 'Đang chấm điểm...',
    inputPlaceholder: 'Nhập câu trả lời của bạn...',
    nextQuestion: 'Câu hỏi tiếp theo →',
    resultTitle: 'Kết quả Vấn Đáp',
    detailsTitle: 'Chi tiết từng câu',
    summaryTitle: 'Nhận xét tổng thể của giáo viên AI',
    concludedMessage: 'Cảm ơn bạn! Hãy chuyển sang câu hỏi tiếp theo.',
    retry: 'Thử lại',
};

const SCORE_LABEL_MAP: Record<number, string> = {
    0: 'Không hiểu',
    1: 'Hiểu một phần',
    2: 'Hiểu hoàn toàn',
};

type ChatTurn = {
    id: string;
    role: ChatRole;
    content: string;
    timestamp: string;
};

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

const TYPING_DELAY_MS = 480;
const DEFAULT_TOTAL_QUESTIONS = 3;

const formatTime = (iso: string) => {
    const date = new Date(iso);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const getScoreColor = (score: number) => {
    if (score <= 4) return '#ef4444';
    if (score <= 7) return '#f59e0b';
    return '#22c55e';
};

const getDotLabel = (score: number) => {
    if (score === 2) return '●●';
    if (score === 1) return '●○';
    return '○○';
};

const hasValidGradingReport = (report: ShowcaseGradingReport | null | undefined): report is ShowcaseGradingReport => {
    return Boolean(report && Array.isArray(report.per_question) && report.per_question.length > 0);
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

    const [triggerReport] = useLazyGetProjectQAReportQuery();
    const [stage, setStage] = useState<QAStage>('interviewing');
    const [questions, setQuestions] = useState<ShowcaseQAQuestion[]>([]);
    const [panelError, setPanelError] = useState<string | null>(null);
    const [gradingReport, setGradingReport] = useState<ShowcaseGradingReport | null>(null);
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

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

    const [startSession, { isLoading: startingSession, error }] = useStartQASessionMutation();
    const [sendMessage, { isLoading: sendingMessage }] = useSendQAMessageMutation();
    const { data: submitJsonData, isLoading: jsonLoading } = useGetSubmitJsonQuery(lessonId as string, {
        skip: !lessonId,
    });
    console.log(historyData);

    const dispatch_error = useAppDispatch();
    useEffect(() => {
        if (isFetchBaseQueryError(error) && error.status === 404) {
            dispatch_error(addNotification({
                type: 'error',
                message: 'Chưa có bài nộp',
                description: 'Hãy nộp bài để có thể tiếp tục!',
                createdAt: Date.now(),
                isShown: false
            }));
        }
    }, [error]);

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

            if (historyData?.grading_status === 'Graded') {
                // setStage('result');
                triggerReport(lessonId as string)
                    .unwrap()
                    .then((report) => {
                        setGradingReport(report);
                        setStage('result');
                    })
                    .catch((err) => {
                        console.error('Failed to fetch grading report:', err);
                        setStage('result'); // Display what we can or empty result
                    });
            }
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

            if (response.gradingResult && response.gradingResult.completed) {
                setStage('grading');
                triggerReport(lessonId as string)
                    .unwrap()
                    .then((report) => {
                        setGradingReport(report);
                        setStage('result');
                    })
                    .catch((err) => {
                        console.error('Failed to fetch grading report:', err);
                        setStage('result'); // Display what we can or empty result
                    });
            }
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


    //
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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

    // --- Khối File Explorer ---
    const FileExplorerContent = (
        <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 p-4">
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
    );

    // --- Khối Code Editor ---
    const CodeEditorContent = (
        <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-lg h-full overflow-hidden">
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#3e3e3e]">
                <div className="flex items-center gap-2">
                    <MenuIcon
                        className="md:hidden text-white cursor-pointer"
                        onClick={() => setIsMobileDrawerOpen(true)}
                    />
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
    );

    // --- Khối Chat QA ---
    // const ChatQAContent = (
    //     <div className="flex flex-col bg-white rounded-lg h-full p-3 pb-0">
    //         <h3 className="text-lg font-semibold mb-4 border-b pb-0">Vấn đáp về Dự án</h3>

    const renderGradingView = () => (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white">
            <Skeleton.Avatar active size={64} shape="circle" />
            <p className="text-gray-500">{QA_LABELS.grading}</p>
            <Spin />
        </div>
    );

    const renderResultView = () => {
        if (!gradingReport) {
            return renderGradingView();
        }

        const perQuestion = Array.isArray(gradingReport.per_question) ? gradingReport.per_question : [];
        const safeSummary = gradingReport.summary || 'Chưa có nhận xét tổng thể.';
        const scoreColor = getScoreColor(gradingReport.total_score || 0);

        const numQuestions = perQuestion.length;
        const totalMax = numQuestions > 0 ? numQuestions * 2 : gradingReport.max_score || 10;
        const totalScore = gradingReport.total_score || 0;
        const scaledTotal = totalMax === 0 ? 0 : Math.round((totalScore / totalMax) * 10 * 10) / 10;
        const percent = gradingReport.percentage || (totalMax === 0 ? 0 : Math.round((totalScore / totalMax) * 100));

        return (
            <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-center mb-5">
                    <h3 className="text-xl font-bold text-[var(--color-primary)]">{QA_LABELS.resultTitle}</h3>
                    <p className="text-gray-500 mt-1">
                        {gradingReport.student_name || 'Học viên'}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4 mb-5">
                    <div className="text-center mb-2">
                        <p className="text-3xl font-bold" style={{ color: scoreColor }}>{scaledTotal} / 10</p>
                        <p className="text-sm text-gray-500">({totalScore} / {totalMax} điểm gốc)</p>
                        <p className="text-sm text-gray-500">{percent}%</p>
                    </div>
                    <Progress percent={percent} showInfo={false} strokeColor={scoreColor} />
                </div>

                <h4 className="text-base font-semibold text-[var(--color-primary)] mb-3">{QA_LABELS.detailsTitle}</h4>
                <Collapse
                    accordion
                    activeKey={expandedQuestion ?? undefined}
                    onChange={(key) => {
                        if (Array.isArray(key)) {
                            setExpandedQuestion((key[0] as string) || null);
                            return;
                        }
                        setExpandedQuestion((key as string) || null);
                    }}
                    items={perQuestion.map((item, index) => ({
                        key: item.question_id,
                        label: (
                            <div className="flex items-center justify-between gap-2 pr-2">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[var(--color-primary)] truncate">Câu {index + 1} · {SCORE_LABEL_MAP[item.score] || 'Không rõ'}</p>
                                    <p className="text-xs text-gray-500 break-words whitespace-pre-line max-w-[220px]">{item.question_content}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-600">{getDotLabel(item.score)}</p>
                                    <p className="text-xs text-gray-500">{item.score} / 2</p>
                                </div>
                            </div>
                        ),
                        children: (
                            <div className="space-y-2 text-sm">
                                <p><strong>Đúng:</strong> {item.what_student_got_right || '—'}</p>
                                <p><strong>Thiếu:</strong> {item.what_student_missed || '—'}</p>
                                <p><strong>Trích dẫn:</strong> {item.key_evidence || '—'}</p>
                            </div>
                        ),
                    }))}
                />

                {perQuestion.length === 0 && (
                    <div className="mt-3">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có chi tiết từng câu hỏi" />
                    </div>
                )}

                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-[var(--color-primary)] mb-2">{QA_LABELS.summaryTitle}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{safeSummary}</p>
                </div>
            </div>
        );
    };

    const renderInterviewView = () => (
        <>
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
                                        textarea: '!border-none !bg-transparent !shadow-none focus:!shadow-none hover:!shadow-none !px-2 !py-1 !resize-none custom-scrollbar custom-textarea',
                                    }}
                                    onChange={(e) => {
                                        const newRows = e.target.value.split('\n').length;
                                        setRow(Math.min(newRows, 7));
                                    }}
                                    onPressEnter={(e) => {
                                        if (!e.shiftKey) {
                                            e.preventDefault();
                                            formData.submit();
                                        }
                                    }}
                                />
                            </Form.Item>

                            {/* Nút Voice / Stop Voice */}
                            {/* <Button
                                type="text"
                                onClick={() => {
                                    if (recording) {
                                        stopRecording();
                                    } else {
                                        startRecording();
                                    }
                                }}
                                icon={recording ? <StopOutlined className="!text-red-500" /> : <AudioOutlined className="!text-gray-500" />}
                                className={`!flex !items-center !justify-center !w-8 !h-8 !p-0 ${recording ? 'bg-red-50' : 'bg-transparent'}`}
                                title={recording ? "Dừng ghi âm" : "Ghi âm"}
                            />

                            <Button
                                type="text"
                                htmlType="submit"
                                loading={sendingMessage}
                                disabled={sendingMessage}
                                icon={<SendIcon size={16} />}
                                className="!flex !items-center !justify-center !w-8 !h-8 !p-0 !text-[var(--color-primary)] hover:!bg-[var(--color-primary)]/10"
                            /> */}

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
                                type="text"
                                onClick={() => {
                                    setAnswerMode(prev => prev === 'audio' ? 'text' : 'audio');
                                }}
                                icon={
                                    <div className="relative w-[24px] h-[24px]">
                                        <Image
                                            src={AudioWaveForm}
                                            alt="Audio wave form"
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
            )
            }
        </>
    );

    const ChatQAContent = (
        <div className="flex flex-col bg-white rounded-lg h-full p-3 pb-0">
            <h3 className="text-lg font-semibold mb-4 border-b pb-0">Vấn đáp về Dự án</h3>

            {stage === 'interviewing' && renderInterviewView()}
            {stage === 'grading' && renderGradingView()}
            {stage === 'result' && renderResultView()}
        </div>
    );

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

    if (historyLoading) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-8rem)] flex gap-4 overflow-hidden pb-4">
            {/* DESKTOP LAYOUT (Ẩn trên màn hình nhỏ, hiện trên màn md trở lên) */}
            <div className="hidden md:flex w-full h-full gap-4">
                <div className="w-[20%] min-w-[200px]">
                    {FileExplorerContent}
                </div>
                <div className="flex-1 min-w-0">
                    {CodeEditorContent}
                </div>
                <div className="w-[30%] min-w-[320px]">
                    {ChatQAContent}
                </div>
            </div>

            {/* MOBILE LAYOUT (Hiện trên màn hình nhỏ, ẩn trên md) */}
            <div className="flex md:hidden w-full h-full flex-col">
                <Tabs
                    defaultActiveKey="code"
                    className="h-full project-qa-mobile-tabs"
                    items={[
                        {
                            key: 'code',
                            label: '💻 Code Editor',
                            children: CodeEditorContent,
                            className: "h-[calc(100vh-12rem)]" // Đảm bảo scroll đúng
                        },
                        {
                            key: 'chat',
                            label: '💬 Trợ lý QA',
                            children: ChatQAContent,
                            className: "h-[calc(100vh-12rem)]"
                        }
                    ]}
                />

                {/* Drawer chứa File Explorer cho Mobile */}
                <Drawer
                    title="File Explorer"
                    placement="left"
                    onClose={() => setIsMobileDrawerOpen(false)}
                    open={isMobileDrawerOpen}
                    width={280}
                    // bodyStyle={{ padding: 0 }}
                    style={{ padding: 0 }}
                >
                    {/* Khi chọn file xong, tự động đóng Drawer */}
                    <div onClick={(e) => {
                        // Nếu click vào một file (không phải folder), đóng drawer
                        if ((e.target as HTMLElement).closest('.ant-tree-treenode-switcher-open') === null) {
                            setIsMobileDrawerOpen(false);
                        }
                    }}>
                        {FileExplorerContent}
                    </div>
                </Drawer>
            </div>
        </div>
    );
};

export default LectureProjQA;
