'use client';

import '@ant-design/v5-patch-for-react-19';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Collapse, Drawer, Empty, Form, Input, Popconfirm, Progress, Select, Skeleton, Spin, Tabs, Tree } from 'antd';
import { Check, File as FileIcon, Folder as FolderIcon, Menu as MenuIcon, RefreshCw as RefreshIcon, Send as SendIcon } from '@deemlol/next-icons';
import { AudioOutlined, CloseCircleFilled, WarningFilled } from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'next/navigation';

import {
    useCreateProjectQAV2SessionMutation,
    useGetSubmitJsonQuery,
    useLazyGetProjectQAV2ReportQuery,
    useRespondProjectQAV2Mutation,
    useRetakeProjectQAV2SessionMutation,
    useSaveProjectQAV2ResultMutation,
    useStartProjectQAV2InterviewMutation,
} from '@/store/api/[module]/projectApi';
import { useGetCoursesByLessonIdQuery } from '@/store/api/[module]/courseApi';
import { useTranscribeAudioMutation } from '@/store/api/[module]/voiceApi';
import type {
    QAV2GradingReport,
    QAV2Question,
    QAV2SubmissionValidation,
    QAV2ValidationStatus,
} from '@/type/project.type';
import { useAppDispatch } from '@/store/hook';
import { addNotification } from '@/store/slice/notifySlice';

type QAStage = 'loading' | 'interviewing' | 'grading' | 'result';

type QuestionStatus = 'asking' | 'clarifying' | 'probing' | 'concluded_pass' | 'concluded_fail';

type ChatRole = 'agent' | 'student';

type ChatTurn = {
    id: string;
    role: ChatRole;
    content: string;
    timestamp: string;
};

type FileNode = {
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
    extension?: string;
};

const QA_LABELS = {
    loadingSession: 'Đang khởi tạo phiên vấn đáp...',
    grading: 'Đang chấm điểm...',
    inputPlaceholder: 'Nhập câu trả lời của bạn...',
    nextQuestion: 'Câu hỏi tiếp theo →',
    resultTitle: 'Kết quả Vấn Đáp',
    detailsTitle: 'Chi tiết từng câu',
    summaryTitle: 'Nhận xét tổng thể của giáo viên AI',
    retry: 'Thử lại',
    validationTitle: 'Đối chiếu bài nộp với đề bài',
    retake: 'Vấn đáp lại từ đầu',
    retaking: 'Đang tạo phiên mới...',
};

/**
 * Cách hiển thị từng trạng thái đối chiếu bài nộp với đề bài.
 * `unknown` phải hiện là "chưa xác định" chứ không được hiện như "đạt" —
 * đó chính là chỗ trước đây bài nộp sai đề vẫn lọt qua mà không ai biết.
 */
const VALIDATION_STYLES: Record<QAV2ValidationStatus, {
    verdict: string;
    accent: string;
    badgeClass: string;
}> = {
    valid: {
        verdict: 'Bài làm đạt yêu cầu',
        accent: '#22c55e',
        badgeClass: 'bg-green-50 text-green-700 border-green-200',
    },
    invalid: {
        verdict: 'Bài làm không đạt yêu cầu',
        accent: '#ef4444',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
    },
    unknown: {
        verdict: 'Chưa xác định được mức độ phù hợp với đề bài',
        accent: '#f59e0b',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
};

const getValidationStatus = (
    validation: QAV2SubmissionValidation | null,
): QAV2ValidationStatus => validation?.status ?? 'unknown';

const SCORE_LABEL_MAP: Record<number, string> = {
    0: 'Không hiểu',
    1: 'Hiểu một phần',
    2: 'Hiểu hoàn toàn',
};

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

const IGNORED_EXTENSIONS = new Set([
    '.sln', '.vcxproj', '.vcxproj.filters', '.vx', '.user',
    '.suo', '.exe', '.dll', '.obj', '.o', '.pdb', '.idb',
    '.ipch', '.git', '.gitignore', '.vs', '.filters',
]);

const IGNORED_FOLDERS = new Set([
    '.git', '.vs', '.vscode', '.idea', 'bin', 'obj', 'debug', 'release', 'x64', 'x86',
]);

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

const hasValidGradingReport = (report: QAV2GradingReport | null | undefined): report is QAV2GradingReport => {
    return Boolean(report && Array.isArray(report.per_question) && report.per_question.length > 0);
};

const LectureProjQA = () => {
    const { lessonId } = useParams();
    const lessonIdValue = lessonId as string;
    const dispatch = useAppDispatch();

    const { data: submitJsonData, isLoading: isSubmitJsonLoading } = useGetSubmitJsonQuery(lessonIdValue, {
        skip: !lessonIdValue,
    });

    const { data: courseResult } = useGetCoursesByLessonIdQuery(lessonIdValue, {
        skip: !lessonIdValue,
    });

    const [createSession] = useCreateProjectQAV2SessionMutation();
    const [retakeSession] = useRetakeProjectQAV2SessionMutation();
    const [startInterview] = useStartProjectQAV2InterviewMutation();
    const [respondToInterview] = useRespondProjectQAV2Mutation();
    const [triggerReport] = useLazyGetProjectQAV2ReportQuery();
    const [saveResult] = useSaveProjectQAV2ResultMutation();
    const [transcribeAudio] = useTranscribeAudioMutation();

    const [stage, setStage] = useState<QAStage>('loading');
    const [questions, setQuestions] = useState<QAV2Question[]>([]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestionStatus, setCurrentQuestionStatus] = useState<QuestionStatus>('asking');
    const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [completedQuestions, setCompletedQuestions] = useState(0);

    const [gradingReport, setGradingReport] = useState<QAV2GradingReport | null>(null);
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

    const [submissionValidation, setSubmissionValidation] = useState<QAV2SubmissionValidation | null>(null);
    // Mặc định thu gọn để chừa chỗ cho khung chat; nội dung cảnh báo đầy đủ vẫn nằm ở
    // tin nhắn đầu tiên của giáo viên AI nên không mất thông tin.
    const [isValidationOpen, setIsValidationOpen] = useState(false);
    const [attempt, setAttempt] = useState(1);
    const [isRetaking, setIsRetaking] = useState(false);

    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [panelError, setPanelError] = useState<string | null>(null);

    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('plaintext');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const initRef = useRef(false);

    // ===================== Voice input (ASR) =====================
    const [permission, setPermission] = useState(false);
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [volume, setVolume] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const rafRef = useRef<number | null>(null);

    const notifyError = (message: string, description: string) => {
        dispatch(addNotification({
            type: 'error',
            message,
            description,
            createdAt: Date.now(),
            isShown: false,
        }));
    };

    const appendChat = (role: ChatRole, content: string) => {
        setChatHistory((prev) => [
            ...prev,
            {
                id: `${role}-${Date.now()}-${Math.random()}`,
                role,
                content,
                timestamp: new Date().toISOString(),
            },
        ]);
    };

    const simulateAgentMessage = async (content: string) => {
        setIsAgentTyping(true);
        await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY_MS));
        appendChat('agent', content);
        setIsAgentTyping(false);
    };

    const resetCurrentQuestionChat = async (message: string) => {
        setChatHistory([]);
        setIsInputDisabled(true);
        setCurrentQuestionStatus('asking');
        await simulateAgentMessage(message);
        setIsInputDisabled(false);
    };

    const initializeQASession = async (options?: { retake?: boolean }) => {
        if (!lessonIdValue) return;

        const isRetake = Boolean(options?.retake);

        setPanelError(null);
        setStage('loading');
        setIsInputDisabled(true);
        setChatHistory([]);

        if (isRetake) {
            // Dọn sạch kết quả lần trước để màn hình không lẫn điểm cũ với phiên mới.
            setGradingReport(null);
            setExpandedQuestion(null);
            setCurrentQuestionIndex(0);
            setCompletedQuestions(0);
            setCurrentQuestionStatus('asking');
            setInputValue('');
        }

        try {
            const session = isRetake
                ? await retakeSession(lessonIdValue).unwrap()
                : await createSession(lessonIdValue).unwrap();

            setQuestions(session.questions || []);
            setSubmissionValidation(session.submission_validation ?? null);
            setAttempt(session.attempt ?? 1);

            // Học sinh đã hoàn thành phiên trước đó → hiển thị lại báo cáo đã lưu.
            if (hasValidGradingReport(session.grading_report)) {
                setGradingReport(session.grading_report);
                setStage('result');
                setIsInputDisabled(true);
                return;
            }

            const firstPrompt = await startInterview(lessonIdValue).unwrap();
            if (firstPrompt.submission_validation) {
                setSubmissionValidation(firstPrompt.submission_validation);
            }
            setCurrentQuestionIndex(firstPrompt.question_index || 0);
            setStage('interviewing');
            await resetCurrentQuestionChat(firstPrompt.agent_message);
        } catch (error: any) {
            const status = error?.status || error?.originalStatus;
            if (status === 404) {
                setPanelError('Bạn chưa nộp bài cho dự án này.');
                notifyError('Chưa có bài nộp', 'Hãy nộp bài để có thể tiếp tục!');
                return;
            }

            const detail = error?.data?.message || error?.data?.detail || 'Không thể khởi tạo phiên vấn đáp.';
            setPanelError(detail);
            notifyError('Khởi tạo vấn đáp thất bại', detail);
        }
    };

    const handleRetake = async () => {
        if (isRetaking) return;
        setIsRetaking(true);
        try {
            await initializeQASession({ retake: true });
        } finally {
            setIsRetaking(false);
        }
    };

    useEffect(() => {
        if (!lessonIdValue || initRef.current) return;
        initRef.current = true;
        void initializeQASession();
    }, [lessonIdValue]);

    useEffect(() => {
        if (!chatContainerRef.current) return;
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [chatHistory, isAgentTyping]);

    // Bước 3: sau khi trả lời xong 3 câu, poll báo cáo chấm điểm cho tới khi agent chấm xong.
    useEffect(() => {
        if (stage !== 'grading' || !lessonIdValue) return;

        let cancelled = false;
        const poll = async () => {
            try {
                const report = await triggerReport(lessonIdValue).unwrap();
                if (cancelled) return;

                if (!hasValidGradingReport(report)) {
                    setPanelError('Dữ liệu kết quả chưa hợp lệ, vui lòng thử lại sau.');
                    notifyError('Kết quả chưa sẵn sàng', 'Dữ liệu chấm điểm chưa đầy đủ.');
                    return;
                }

                setGradingReport(report);
                setStage('result');
                setIsInputDisabled(true);
                void saveResult({ lessonId: lessonIdValue, grading_report: report });
            } catch (error: any) {
                if (cancelled) return;
                const status = error?.status || error?.originalStatus;
                if (status === 409) return;

                const detail = error?.data?.message || error?.data?.detail || 'Không thể lấy kết quả chấm điểm.';
                setPanelError(detail);
                notifyError('Lấy kết quả thất bại', detail);
            }
        };

        void poll();
        const interval = setInterval(poll, 2000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [stage, lessonIdValue, triggerReport, saveResult]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isSending || stage !== 'interviewing' || isInputDisabled) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setIsSending(true);
        setIsInputDisabled(true);
        appendChat('student', userMessage);

        const previousIndex = currentQuestionIndex;

        try {
            const response = await respondToInterview({
                lessonId: lessonIdValue,
                student_message: userMessage,
            }).unwrap();

            if (response.interview_status === 'completed') {
                await simulateAgentMessage(response.agent_message);
                setCurrentQuestionStatus('concluded_pass');
                setCompletedQuestions(Math.max(questions.length, DEFAULT_TOTAL_QUESTIONS));
                setStage('grading');
                setIsInputDisabled(true);
                setIsSending(false);
                return;
            }

            if (response.question_status === 'concluded_pass' || response.question_status === 'concluded_fail') {
                await simulateAgentMessage(response.agent_message);
                setCurrentQuestionStatus(response.question_status as QuestionStatus);
                setCompletedQuestions((prev) => Math.max(prev, previousIndex + 1));
                setIsInputDisabled(true);
            } else if (response.question_index > previousIndex) {
                await simulateAgentMessage(response.agent_message);
                setCurrentQuestionStatus((response.question_status || 'asking') as QuestionStatus);
                setCompletedQuestions((prev) => Math.max(prev, previousIndex + 1));
                setCurrentQuestionIndex(response.question_index);
                setIsInputDisabled(false);
            } else {
                await simulateAgentMessage(response.agent_message);
                setCurrentQuestionStatus((response.question_status || 'probing') as QuestionStatus);
                setIsInputDisabled(false);
            }
        } catch (error: any) {
            const detail = error?.data?.message || error?.data?.detail || 'Không thể gửi câu trả lời.';
            notifyError('Gửi câu trả lời thất bại', detail);
            setIsInputDisabled(false);
        } finally {
            setIsSending(false);
        }
    };

    const handleGoNextQuestion = async () => {
        if (stage !== 'interviewing') return;

        try {
            const nextQuestion = await startInterview(lessonIdValue).unwrap();
            setCurrentQuestionIndex(nextQuestion.question_index || 0);
            await resetCurrentQuestionChat(nextQuestion.agent_message);
        } catch (error: any) {
            const detail = error?.data?.message || error?.data?.detail || 'Không thể chuyển câu hỏi tiếp theo.';
            notifyError('Chuyển câu hỏi thất bại', detail);
            setIsInputDisabled(false);
        }
    };

    // Ghi âm → chuyển thành text và đổ vào ô nhập để học sinh xem lại trước khi gửi.
    const requestMicrophoneAccess = async () => {
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setPermission(true);
            setStream(streamData);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            notifyError('Không truy cập được micro', 'Hãy cho phép quyền micro trong trình duyệt.');
        }
    };

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
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

                const formData = new FormData();
                formData.append('file', audioFile);

                try {
                    const { transcript } = await transcribeAudio(formData).unwrap();
                    setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
                } catch (error) {
                    console.error(error);
                    notifyError('Nhận dạng giọng nói thất bại', 'Vui lòng thử lại hoặc nhập bằng bàn phím.');
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
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.fftSize);
            const animate = () => {
                analyser.getByteTimeDomainData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += Math.abs(dataArray[i] - 128);
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

    const totalQuestions = Math.max(questions.length, DEFAULT_TOTAL_QUESTIONS);
    const currentStep = Math.min(currentQuestionIndex + 1, totalQuestions);
    const progressPercent = Math.round((Math.max(completedQuestions, currentQuestionIndex) / totalQuestions) * 100);

    const scoreValue = gradingReport?.total_score || 0;
    const scoreColor = getScoreColor(scoreValue);

    const filterAndConvertTreeData = (node: FileNode, parentKey = '0'): DataNode | null => {
        const lowerName = node.name.toLowerCase();

        if (node.type === 'folder') {
            if (IGNORED_FOLDERS.has(lowerName)) return null;
            const children = node.children
                ?.map((child, idx) => filterAndConvertTreeData(child, `${parentKey}-${idx}`))
                .filter(Boolean) as DataNode[];

            return {
                title: node.name,
                key: `${parentKey}-${node.name}`,
                icon: <FolderIcon size={16} />,
                children,
                selectable: false,
            };
        }

        const extension = node.extension?.toLowerCase() || (node.name.includes('.') ? `.${node.name.split('.').pop()?.toLowerCase()}` : '');
        if (IGNORED_EXTENSIONS.has(extension)) return null;

        return {
            title: node.name,
            key: `${parentKey}-${node.name}`,
            icon: <FileIcon size={16} />,
            isLeaf: true,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fileData: {
                content: node.content,
                extension,
                name: node.name,
            },
        };
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
        setSelectedLanguage(EXTENSION_TO_LANGUAGE[extension] || 'plaintext');
    };

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        if (selectedKeys.length === 0) return;
        const node = info.node as any;
        if (node.fileData) {
            onSelectData(node);
        }
    };

    useEffect(() => {
        if (selectedFileName || treeData.length === 0) return;

        const findFirstFile = (nodes: DataNode[]): any => {
            for (const node of nodes) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (node.isLeaf && node.fileData) return node;
                if (node.children) {
                    const found = findFirstFile(node.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const firstFile = findFirstFile(treeData);
        if (firstFile) onSelectData(firstFile);
    }, [treeData, selectedFileName]);

    const isQuestionConcluded = currentQuestionStatus === 'concluded_pass' || currentQuestionStatus === 'concluded_fail';

    // --- Khối File Explorer ---
    const FileExplorerContent = (
        <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold mb-3 uppercase text-gray-500">File Explorer</h3>

            {isSubmitJsonLoading ? (
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
                    options={Object.values(EXTENSION_TO_LANGUAGE)
                        .filter((value, index, arr) => arr.indexOf(value) === index)
                        .map((lang) => ({ label: lang, value: lang }))}
                />
            </div>

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

    /**
     * Thanh điểm "mức độ phù hợp với đề bài" (0-100) kèm ngưỡng đạt.
     * Đây là con số trước đây agent tính ra nhưng không bao giờ hiển thị cho học sinh.
     */
    const renderValidityScoreBar = (validation: QAV2SubmissionValidation, accent: string) => (
        <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Mức độ phù hợp với đề bài</span>
                <span className="font-semibold" style={{ color: accent }}>
                    {validation.validity_score}/100
                </span>
            </div>
            <Progress
                percent={validation.validity_score}
                showInfo={false}
                size="small"
                strokeColor={accent}
            />
            <p className="text-[11px] text-gray-400 mt-1">
                Ngưỡng đạt: {validation.threshold}/100
            </p>
        </div>
    );

    // Cảnh báo hiện suốt phiên vấn đáp, không chỉ ở tin nhắn đầu tiên — học sinh cuộn qua
    // là mất, mà đây là thông tin quyết định điểm cuối cùng.
    //
    // Thu gọn mặc định: ở dạng mở, khối này ăn ~230px trong panel chat vốn đã hẹp, đẩy ô
    // nhập câu trả lời gần như ra khỏi màn hình. Dòng tiêu đề vẫn giữ đủ thông tin quyết
    // định (kết luận + điểm phù hợp), chi tiết nằm sau một cú bấm.
    const renderValidationBanner = () => {
        if (!submissionValidation || submissionValidation.status === 'valid') return null;

        const style = VALIDATION_STYLES[submissionValidation.status];
        const isInvalid = submissionValidation.status === 'invalid';

        return (
            <div className={`mb-3 rounded-xl border ${style.badgeClass}`}>
                <Collapse
                    ghost
                    size="small"
                    expandIconPosition="end"
                    activeKey={isValidationOpen ? ['validation'] : []}
                    onChange={(keys) => setIsValidationOpen((keys as string[]).length > 0)}
                    className="[&_.ant-collapse-header]:!px-3 [&_.ant-collapse-header]:!py-2 [&_.ant-collapse-header]:!items-center [&_.ant-collapse-content-box]:!px-3 [&_.ant-collapse-content-box]:!pt-0 [&_.ant-collapse-content-box]:!pb-3"
                    items={[
                        {
                            key: 'validation',
                            label: (
                                <div className="flex items-center gap-2 min-w-0">
                                    {isInvalid ? (
                                        <CloseCircleFilled style={{ color: style.accent }} />
                                    ) : (
                                        <WarningFilled style={{ color: style.accent }} />
                                    )}

                                    <span className="text-[13px] font-semibold flex-1 min-w-0 truncate">
                                        {style.verdict}
                                    </span>

                                    <span
                                        className="text-xs font-bold shrink-0 tabular-nums"
                                        style={{ color: style.accent }}
                                    >
                                        {submissionValidation.validity_score}/100
                                    </span>
                                </div>
                            ),
                            children: (
                                <div className="text-xs text-gray-600">
                                    {submissionValidation.summary && (
                                        <p className="mb-1">{submissionValidation.summary}</p>
                                    )}

                                    {submissionValidation.issues.length > 0 && (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            {submissionValidation.issues.slice(0, 3).map((issue, index) => (
                                                <li key={index}>{issue}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {isInvalid && (
                                        <p className="mt-1 font-medium text-red-600">
                                            Buổi vấn đáp vẫn diễn ra, nhưng nếu kết luận này không
                                            thay đổi thì kết quả sẽ bị tính 0 điểm.
                                        </p>
                                    )}

                                    {renderValidityScoreBar(submissionValidation, style.accent)}
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        );
    };

    const renderProgressSteps = () => (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-gray-700">Câu hỏi {currentStep}/{totalQuestions}</span>
                <span className="text-xs text-gray-400">{progressPercent}%</span>
            </div>
            <Progress percent={progressPercent} showInfo={false} strokeColor="var(--color-secondary)" />

            <div
                className="mt-2 grid gap-2"
                style={{ gridTemplateColumns: `repeat(${totalQuestions}, minmax(0, 1fr))` }}
                role="list"
                aria-label="Tiến độ câu hỏi"
            >
                {Array.from({ length: totalQuestions }).map((_, index) => {
                    const isDone = index < completedQuestions;
                    const isActive = index === currentQuestionIndex && stage === 'interviewing';

                    return (
                        <div
                            key={index}
                            className="flex items-center justify-center"
                            role="listitem"
                            aria-current={isActive ? 'step' : undefined}
                            aria-label={`Câu ${index + 1}`}
                        >
                            <div
                                className={[
                                    'w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold transition-all duration-300',
                                    isDone
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : isActive
                                            ? 'bg-[var(--color-secondary)] border-[var(--color-secondary)] text-white animate-pulse'
                                            : 'bg-gray-100 border-gray-200 text-gray-400',
                                ].join(' ')}
                            >
                                {isDone ? <Check width={14} height={14} /> : index + 1}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderInterviewView = () => (
        <>
            {renderValidationBanner()}
            {renderProgressSteps()}

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto rounded-xl border border-gray-100 bg-white px-3 py-4 space-y-3">
                {chatHistory.map((message) => {
                    const isAgent = message.role === 'agent';
                    return (
                        <div key={message.id} className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
                            <div
                                className={[
                                    'max-w-[85%] rounded-2xl px-3 py-2 shadow-sm',
                                    isAgent
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-[var(--color-secondary)]/90 text-white',
                                ].join(' ')}
                            >
                                <div className="text-[14px] leading-relaxed">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                                </div>
                                <p className={`mt-1 text-[11px] ${isAgent ? 'text-gray-400' : 'text-white/80'}`}>{formatTime(message.timestamp)}</p>
                            </div>
                        </div>
                    );
                })}

                {isAgentTyping && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl bg-gray-100 px-3 py-2">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.2s]" />
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.1s]" />
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isQuestionConcluded && (
                <div className="mt-3">
                    <Button type="primary" className="!rounded-full" onClick={handleGoNextQuestion}>
                        {QA_LABELS.nextQuestion}
                    </Button>
                </div>
            )}

            <div className="mt-3 border border-gray-200 rounded-2xl p-2">
                <Form onFinish={handleSendMessage}>
                    <div className="flex items-end gap-2">
                        <Input.TextArea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={QA_LABELS.inputPlaceholder}
                            autoSize={{ minRows: 1, maxRows: 5 }}
                            aria-label={QA_LABELS.inputPlaceholder}
                            disabled={isInputDisabled || isSending || stage !== 'interviewing'}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    void handleSendMessage();
                                }
                            }}
                        />

                        <Button
                            onClick={handleAudioRecording}
                            disabled={isInputDisabled || isSending || stage !== 'interviewing'}
                            className="!rounded-full !border-none !flex !items-center !justify-center"
                            title="Trả lời bằng giọng nói"
                        >
                            {recording ? (
                                <div className="flex items-center gap-[3px] h-[22px]">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="w-[3px] bg-[var(--color-secondary)] rounded"
                                            style={{
                                                height: `${Math.min(22, Math.max(4, volume * 0.8 * Math.random()))}px`,
                                                transition: 'height 0.08s linear',
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <AudioOutlined />
                            )}
                        </Button>

                        <Button
                            htmlType="submit"
                            type="primary"
                            shape="circle"
                            icon={<SendIcon width={16} height={16} />}
                            loading={isSending}
                            disabled={isInputDisabled || !inputValue.trim() || stage !== 'interviewing'}
                        />
                    </div>
                </Form>
            </div>
        </>
    );

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

        // Báo cáo là nguồn chính; state validation chỉ là dự phòng khi báo cáo cũ chưa có field.
        const verdictStatus: QAV2ValidationStatus =
            gradingReport.submission_status ?? getValidationStatus(submissionValidation);
        const verdictStyle = VALIDATION_STYLES[verdictStatus];
        const verdictLabel = gradingReport.submission_verdict || verdictStyle.verdict;
        const validityScore =
            gradingReport.submission_validity_score ?? submissionValidation?.validity_score ?? 0;
        const validityThreshold =
            gradingReport.submission_validity_threshold ?? submissionValidation?.threshold ?? 40;
        const verdictIssues = gradingReport.submission_issues ?? submissionValidation?.issues ?? [];
        const verdictSummary = gradingReport.submission_summary || submissionValidation?.summary || '';
        const isForcedZero = gradingReport.forced_zero ?? verdictStatus === 'invalid';

        // Mỗi câu tối đa 2 điểm, tổng = số câu × 2, quy về thang 10; điểm từng câu giữ 0/1/2.
        const numQuestions = perQuestion.length;
        const totalMax = numQuestions * 2;
        const totalScore = perQuestion.reduce((sum, q) => sum + (q.score ?? 0), 0);
        const scaledTotal = totalMax === 0 ? 0 : Math.round((totalScore / totalMax) * 10 * 10) / 10;
        const percent = totalMax === 0 ? 0 : Math.round((totalScore / totalMax) * 100);

        return (
            <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 md:p-5">
                <div className="text-center mb-5">
                    <h3 className="text-2xl font-bold text-[var(--color-primary)]">🎓 {QA_LABELS.resultTitle}</h3>
                    <p className="text-gray-500 mt-1">
                        {gradingReport.student_name || 'Học sinh'} · {courseResult?.data?.course_name || 'Project'}
                    </p>
                    {attempt > 1 && (
                        <p className="text-xs text-gray-400 mt-1">Lần vấn đáp thứ {attempt}</p>
                    )}
                </div>

                {/* Kết luận về bài nộp: "đạt" hay "không đạt" yêu cầu đề bài, kèm điểm phù hợp. */}
                <div className={`rounded-2xl border p-4 mb-4 ${verdictStyle.badgeClass}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wide opacity-70">
                                {QA_LABELS.validationTitle}
                            </p>
                            <p className="text-base font-bold mt-0.5">{verdictLabel}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-2xl font-bold leading-none">{validityScore}</p>
                            <p className="text-[11px] opacity-70">/ 100</p>
                        </div>
                    </div>

                    <div className="mt-3">
                        <Progress
                            percent={validityScore}
                            showInfo={false}
                            size="small"
                            strokeColor={verdictStyle.accent}
                        />
                        <p className="text-[11px] opacity-70 mt-1">Ngưỡng đạt: {validityThreshold}/100</p>
                    </div>

                    {verdictSummary && <p className="text-xs mt-2">{verdictSummary}</p>}

                    {verdictIssues.length > 0 && (
                        <ul className="list-disc pl-4 mt-2 space-y-0.5 text-xs">
                            {verdictIssues.slice(0, 4).map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))}
                        </ul>
                    )}

                    {isForcedZero && (
                        <p className="text-xs font-semibold mt-2">
                            Vì bài nộp không đáp ứng yêu cầu đề bài, toàn bộ câu hỏi được tính 0 điểm.
                        </p>
                    )}
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
                                    <p className="text-sm font-semibold text-[var(--color-primary)] truncate">Câu {index + 1} · {SCORE_LABEL_MAP[item.score]}</p>
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
                                <p><strong>✓ Đúng:</strong> {item.what_student_got_right || '—'}</p>
                                <p><strong>✗ Thiếu:</strong> {item.what_student_missed || '—'}</p>
                                <p><strong>💬 Trích dẫn:</strong> {item.key_evidence || '—'}</p>
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

                <div className="mt-5 flex flex-col items-center gap-2">
                    <Popconfirm
                        title="Vấn đáp lại từ đầu?"
                        description={
                            <span className="text-xs">
                                Hệ thống sẽ sinh bộ câu hỏi mới và chấm lại từ đầu.
                                <br />
                                Kết quả lần này vẫn được lưu trong lịch sử.
                            </span>
                        }
                        okText="Bắt đầu lại"
                        cancelText="Huỷ"
                        onConfirm={() => void handleRetake()}
                    >
                        <Button
                            type="primary"
                            className="!rounded-full"
                            icon={<RefreshIcon width={16} height={16} />}
                            loading={isRetaking}
                        >
                            {isRetaking ? QA_LABELS.retaking : QA_LABELS.retake}
                        </Button>
                    </Popconfirm>

                    {isForcedZero && (
                        <p className="text-xs text-gray-500 text-center max-w-[320px]">
                            Nếu em nộp nhầm repository, hãy nộp lại đúng bài trước khi vấn đáp lại.
                        </p>
                    )}
                </div>
            </div>
        );
    };

    // --- Khối vấn đáp ---
    const ChatQAContent = (
        <div className="flex flex-col bg-white rounded-lg border border-gray-200 h-full p-3">
            <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">Vấn đáp về Dự án</h3>

                {/* Làm lại giữa chừng: hữu ích khi học sinh phát hiện mình nộp nhầm repo. */}
                {(stage === 'interviewing' || stage === 'grading') && (
                    <Popconfirm
                        title="Vấn đáp lại từ đầu?"
                        description={
                            <span className="text-xs">
                                Toàn bộ câu trả lời của phiên hiện tại sẽ bị bỏ
                                <br />
                                và hệ thống sinh bộ câu hỏi mới.
                            </span>
                        }
                        okText="Bắt đầu lại"
                        cancelText="Huỷ"
                        onConfirm={() => void handleRetake()}
                    >
                        <Button
                            type="text"
                            size="small"
                            className="!text-gray-500 !flex !items-center !gap-1"
                            icon={<RefreshIcon width={14} height={14} />}
                            loading={isRetaking}
                        >
                            Làm lại
                        </Button>
                    </Popconfirm>
                )}
            </div>

            {panelError && (
                <Alert
                    type="error"
                    showIcon
                    className="mb-3"
                    message={panelError}
                    action={<Button size="small" onClick={() => void initializeQASession()}>{QA_LABELS.retry}</Button>}
                />
            )}

            {stage === 'loading' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white">
                    <Spin size="large" />
                    <p className="text-gray-500">{QA_LABELS.loadingSession}</p>
                </div>
            )}

            {stage === 'interviewing' && renderInterviewView()}
            {stage === 'grading' && renderGradingView()}
            {stage === 'result' && renderResultView()}
        </div>
    );

    return (
        <div className="w-full h-[calc(100vh-8rem)] flex gap-4 overflow-hidden pb-4">
            {/* DESKTOP LAYOUT */}
            <div className="hidden md:flex w-full h-full gap-4">
                <div className="w-[20%] min-w-[200px]">
                    {FileExplorerContent}
                </div>
                <div className="flex-1 min-w-0">
                    {CodeEditorContent}
                </div>
                <div className="w-[34%] min-w-[340px] max-w-[520px]">
                    {ChatQAContent}
                </div>
            </div>

            {/* MOBILE LAYOUT */}
            <div className="flex md:hidden w-full h-full flex-col">
                <Tabs
                    defaultActiveKey="chat"
                    className="h-full project-qa-mobile-tabs"
                    items={[
                        {
                            key: 'code',
                            label: '💻 Code Editor',
                            children: CodeEditorContent,
                            className: 'h-[calc(100vh-12rem)]',
                        },
                        {
                            key: 'chat',
                            label: '💬 Vấn đáp',
                            children: ChatQAContent,
                            className: 'h-[calc(100vh-12rem)]',
                        },
                    ]}
                />

                <Drawer
                    title="File Explorer"
                    placement="left"
                    onClose={() => setIsMobileDrawerOpen(false)}
                    open={isMobileDrawerOpen}
                    width={280}
                    style={{ padding: 0 }}
                >
                    <div onClick={(e) => {
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
