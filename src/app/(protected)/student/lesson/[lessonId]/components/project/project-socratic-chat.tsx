'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, Input, Spin, Empty } from 'antd';
import {
    RobotOutlined,
    PlusOutlined,
    HistoryOutlined,
    DeleteOutlined,
    CloseOutlined,
    SendOutlined,
    AudioOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AudioWaveForm from '@/../public/student/AudioWaveForm.svg';
import AudioWaveFormHover from '@/../public/student/AudioWaveFormHover.svg';
import {
    useCreateSocraticSessionMutation,
    useDeleteSocraticSessionMutation,
    useLazyGetSocraticSessionMessagesQuery,
    useListSocraticSessionsQuery,
    useSendSocraticMessageMutation,
} from '@/store/api/[module]/projectApi';
import { useTranscribeAudioMutation } from '@/store/api/[module]/voiceApi';
import type { SocraticMessage } from '@/type/project.type';

type ProjectSocraticChatProps = {
    lessonId: string;
    variant?: 'floating' | 'inline';
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showTrigger?: boolean;
    onPanelWidthChange?: (width: number) => void;
};

const ProjectSocraticChat = ({
    lessonId,
    variant = 'floating',
    open,
    onOpenChange,
    showTrigger = true,
    onPanelWidthChange,
}: ProjectSocraticChatProps) => {
    const [form] = Form.useForm();
    const panelRef = useRef<HTMLElement | null>(null);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const isControlled = typeof open === 'boolean';
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = isControlled ? (open as boolean) : internalOpen;

    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<SocraticMessage[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [bootstrapped, setBootstrapped] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [row, setRow] = useState(1);
    const [answerMode, setAnswerMode] = useState<'text' | 'audio'>('text');

    const [permission, setPermission] = useState(false);
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [volume, setVolume] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);

    const { data: sessionsData, isFetching: sessionsLoading, refetch: refetchSessions } = useListSocraticSessionsQuery(lessonId, {
        skip: !lessonId,
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });

    const [createSession, { isLoading: creatingSession }] = useCreateSocraticSessionMutation();
    const [getSessionMessages, { isFetching: loadingMessages }] = useLazyGetSocraticSessionMessagesQuery();
    const [sendSocraticMessage, { isLoading: sendingMessage }] = useSendSocraticMessageMutation();
    const [deleteSocraticSession] = useDeleteSocraticSessionMutation();
    const [transcribeAudio] = useTranscribeAudioMutation();

    const setOpenState = (next: boolean) => {
        if (!isControlled) {
            setInternalOpen(next);
        }
        onOpenChange?.(next);
    };

    const normalizeText = (msg: SocraticMessage): string => {
        if (msg.role === 'user') {
            if (typeof msg.content === 'string') return msg.content;
            return msg.content?.message || msg.content?.text || '';
        }
        if (typeof msg.content === 'string') return msg.content;
        return msg.content?.response || msg.content?.text || '';
    };

    const renderMarkdown = (content: string) => (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ className, children, ...props }) {
                    const isBlock = Boolean(className);
                    if (!isBlock) {
                        return (
                            <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.85em]" {...props}>
                                {children}
                            </code>
                        );
                    }

                    return (
                        <pre className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-slate-100">
                            <code className={`${className} font-mono text-[13px] leading-relaxed`} {...props}>
                                {children}
                            </code>
                        </pre>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );

    const sessions = useMemo(() => sessionsData?.sessions || [], [sessionsData]);

    const openSession = async (sessionId: string) => {
        const response = await getSessionMessages({ lessonId, sessionId }).unwrap();
        setCurrentSessionId(sessionId);
        setMessages(response.messages || []);
    };

    const handleCreateSession = async () => {
        const created = await createSession(lessonId).unwrap();
        await refetchSessions();
        await openSession(created.session_id);
        setShowHistory(false);
    };

    const handleDeleteSession = async (sessionId: string) => {
        await deleteSocraticSession({ lessonId, sessionId }).unwrap();
        await refetchSessions();

        if (currentSessionId === sessionId) {
            const remaining = sessions.filter((s) => s.session_id !== sessionId);
            if (remaining.length > 0) {
                await openSession(remaining[0].session_id);
            } else {
                setCurrentSessionId(null);
                setMessages([]);
                await handleCreateSession();
            }
        }
    };

    const sendMessageText = async (text: string) => {
        if (!currentSessionId) {
            await handleCreateSession();
            return;
        }

        if (!text) return;

        const optimisticUser: SocraticMessage = {
            id: `temp-user-${Date.now()}`,
            session_id: currentSessionId,
            lesson_id: lessonId,
            user_id: '',
            role: 'user',
            content: { message: text },
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticUser]);

        try {
            const response = await sendSocraticMessage({
                lessonId,
                sessionId: currentSessionId,
                message: text,
                answer_mode: answerMode,
            }).unwrap();

            setMessages((prev) => [
                ...prev,
                response.assistantMessage,
            ]);
            await refetchSessions();
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `temp-error-${Date.now()}`,
                    session_id: currentSessionId,
                    lesson_id: lessonId,
                    user_id: '',
                    role: 'assistant',
                    content: { response: 'Co loi xay ra, vui long thu lai.' },
                    timestamp: new Date().toISOString(),
                },
            ]);
        }
    };

    const handleSendMessage = async () => {
        const text = (form.getFieldValue('chatMessage') || '').trim();
        if (!text) return;
        form.resetFields(['chatMessage']);
        setRow(1);
        await sendMessageText(text);
    };

    const requestMicrophoneAccess = async () => {
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            setPermission(true);
            setStream(streamData);
        } catch (error) {
            console.error('Error accessing microphone:', error);
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

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

                const formData = new FormData();
                formData.append('file', audioFile);

                try {
                    const { transcript } = await transcribeAudio(formData).unwrap();
                    const text = (transcript || '').trim();
                    if (text) {
                        await sendMessageText(text);
                    }
                } catch (error) {
                    console.error('Audio transcription error:', error);
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

    useEffect(() => {
        if (variant !== 'floating' || !onPanelWidthChange) return;

        if (!isOpen) {
            onPanelWidthChange(0);
            return;
        }

        const panel = panelRef.current;
        if (!panel) return;

        const updateWidth = () => {
            onPanelWidthChange(Math.ceil(panel.getBoundingClientRect().width));
        };

        updateWidth();
        if (typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver(updateWidth);
        observer.observe(panel);
        return () => observer.disconnect();
    }, [isOpen, onPanelWidthChange, variant]);

    useEffect(() => {
        if (!lessonId || !sessionsData || bootstrapped) return;

        const run = async () => {
            if (sessions.length > 0) {
                await openSession(sessions[0].session_id);
            } else {
                await handleCreateSession();
            }
            setBootstrapped(true);
        };

        run();
    }, [lessonId, sessionsData, sessions.length, bootstrapped]);

    useEffect(() => {
        if (!chatBodyRef.current) return;
        chatBodyRef.current.scrollTo({
            top: chatBodyRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    useEffect(() => {
        const updateViewportState = () => {
            setIsMobile(window.innerWidth < 1280);
        };

        updateViewportState();
        window.addEventListener('resize', updateViewportState);
        return () => window.removeEventListener('resize', updateViewportState);
    }, []);

    const panelClasses = variant === 'inline'
        ? 'relative w-full max-h-[70vh]'
        : `fixed z-50 transition-all duration-300 ${isMobile
            ? `inset-x-0 bottom-0 mx-auto w-full max-w-full ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'}`
            : `bottom-6 right-6 w-[430px] max-w-[calc(100vw-2rem)] ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}`;

    return (
        <>
            {variant === 'floating' && showTrigger && !isOpen && (
                <Button
                    onClick={() => setOpenState(true)}
                    className="!w-[56px] !h-[56px] !p-0 !rounded-full !bg-[var(--color-secondary)] fixed bottom-6 right-6 z-40"
                    icon={<RobotOutlined className="!text-white text-[24px]" />}
                />
            )}

            {variant === 'floating' && isOpen && isMobile && (
                <button
                    type="button"
                    aria-label="Close chat overlay"
                    className="fixed inset-0 z-40 bg-black/35"
                    onClick={() => setOpenState(false)}
                />
            )}

            {(variant === 'inline' || isOpen) && (
                <section ref={panelRef} className={panelClasses}>
                    <div className={`flex flex-col overflow-hidden border border-gray-200 bg-white shadow-2xl ${isMobile ? 'h-[78vh] rounded-t-2xl' : 'h-[620px] rounded-2xl'}`}>
                        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-white to-[#f3f7ff] px-4 py-3">
                            <div className="flex items-center gap-2">
                                <RobotOutlined className="text-[var(--color-secondary)]" />
                                <div className="text-sm font-semibold text-gray-800">Socratic AI</div>
                            </div>
                            <div className="relative flex items-center gap-2">
                                <Button
                                    type="text"
                                    icon={<PlusOutlined />}
                                    onClick={handleCreateSession}
                                    loading={creatingSession}
                                />
                                <Button
                                    type="text"
                                    icon={<HistoryOutlined />}
                                    onClick={() => setShowHistory((prev) => !prev)}
                                />
                                {variant === 'floating' && (
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => setOpenState(false)}
                                    />
                                )}

                                {showHistory && (
                                    <div className={`absolute top-10 z-50 max-h-72 w-72 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-xl ${isMobile ? 'right-0' : 'right-0'}`}>
                                        {sessionsLoading ? (
                                            <div className="flex items-center justify-center py-4"><Spin size="small" /></div>
                                        ) : sessions.length === 0 ? (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có session" />
                                        ) : (
                                            sessions.map((session) => (
                                                <div
                                                    key={session.session_id}
                                                    className={`mb-1 flex items-center justify-between rounded-md px-2 py-2 ${currentSessionId === session.session_id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                                >
                                                    <button
                                                        type="button"
                                                        className="mr-2 flex-1 text-left text-xs text-gray-700"
                                                        onClick={() => {
                                                            openSession(session.session_id);
                                                            setShowHistory(false);
                                                        }}
                                                    >
                                                        <div className="truncate font-medium">{session.session_id.slice(0, 8)}...</div>
                                                        <div className="text-[11px] text-gray-500">{new Date(session.last_message_at).toLocaleString()}</div>
                                                    </button>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDeleteSession(session.session_id)}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div ref={chatBodyRef} className="flex-1 space-y-3 overflow-y-auto bg-[#f8fafc] px-3 py-3">
                            {(loadingMessages || creatingSession) && messages.length === 0 ? (
                                <div className="flex h-full items-center justify-center">
                                    <Spin />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                    Chưa có tin nhắn
                                </div>
                            ) : (
                                messages
                                    .filter((msg) => msg.role !== 'system')
                                    .map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[var(--color-secondary)] text-white shadow-sm' : 'bg-white text-gray-800 border border-gray-200 shadow-sm'}`}>
                                                <div className={`${msg.role === 'user' ? '[&_a]:text-white [&_a]:underline [&_code]:bg-white/20 [&_pre]:bg-black/25 [&_pre]:text-white' : '[&_a]:text-[var(--color-secondary)] [&_a]:underline'} [&_blockquote]:border-l-2 [&_blockquote]:border-current/30 [&_blockquote]:pl-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5`}>
                                                    {renderMarkdown(normalizeText(msg))}
                                                </div>
                                                {msg.role === 'assistant' && msg.audio_url && (
                                                    <Button
                                                        type="text"
                                                        className="!mt-1 !px-1"
                                                        icon={<PlayCircleOutlined />}
                                                        onClick={() => {
                                                            const audio = new Audio(msg.audio_url);
                                                            audio.play().catch((err) => console.error('Play audio error:', err));
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))
                            )}

                            {sendingMessage && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-secondary)] [animation-delay:-0.2s]" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-secondary)] [animation-delay:-0.1s]" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-secondary)]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 p-[0.5rem] flex-shrink-0 bg-white">
                            <Form
                                form={form}
                                onFinish={handleSendMessage}
                                className={`w-full flex items-end gap-2 !bg-white !border border-gray-200 !px-[0.5rem] !py-[0.5rem] ${row >= 2 ? 'rounded-[20px]' : 'rounded-full'}`}
                            >
                                <Form.Item name="chatMessage" className="!mb-0 flex-1">
                                    <Input.TextArea
                                        autoSize={{ minRows: 1, maxRows: 4 }}
                                        classNames={{
                                            textarea: '!border-none !outline-none focus:!shadow-none',
                                        }}
                                        placeholder="Đặt câu hỏi về project..."
                                        onPressEnter={(e) => {
                                            if (!e.shiftKey) {
                                                e.preventDefault();
                                                form.submit();
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
                                    onClick={() => setAnswerMode((prev) => prev === 'text' ? 'audio' : 'text')}
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
                                    title="Chế độ phản hồi bằng giọng nói"
                                />


                            </Form>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default ProjectSocraticChat;
