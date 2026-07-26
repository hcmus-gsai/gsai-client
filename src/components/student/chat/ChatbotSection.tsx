'use client';
import '@ant-design/v5-patch-for-react-19';
import { FooterSection } from "@/components/guest/ui/guest";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Check, Plus, ChevronRight, Send, Mic, Menu, Play } from "@deemlol/next-icons";
import { Button, Card, Form, Input, Switch, Progress, Calendar } from "antd";
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { RobotOutlined } from '@ant-design/icons';

//For Voice Recorder
import { AudioOutlined, StopOutlined, DeleteOutlined, BorderOutlined } from '@ant-design/icons';
import AudioWaveForm from "@/../public/student/AudioWaveForm.svg";
import AudioWaveFormHover from "@/../public/student/AudioWaveFormHover.svg";

import { useTranscribeAudioMutation } from '@/store/api/[module]/voiceApi';
import { useSendMessageMutation, useGetChatHistoryQuery, useSendMessageV2Mutation, chatApi } from '@/store/api/[module]/chatApi';
import { streamChatMessage } from '@/store/api/chatStream';
import { ContentType, SuggestedModule, ChatRefusalReason } from '@/type/chat.type';
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hook';
import { signOut } from '@/store/slice/authSlice';
import Image from 'next/image';
import { useGetCoursesByLessonIdQuery } from '@/store/api/[module]/courseApi';
//Clone voice
import { useCloneVoiceMutation } from "@/store/api/[module]/voiceApi";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

//===========

// Cờ để rollback về đường không-stream (useSendMessageV2Mutation) bằng một dòng nếu production
// có sự cố với luồng SSE.
const USE_STREAMING_CHAT = true;

interface Message {
    // Id sinh phía client, ỔN ĐỊNH suốt vòng đời một lượt stream. Dùng để định vị đúng bong bóng
    // khi token về, thay vì giữ chỉ số mảng qua `await`: mảng `messages` có thể bị THAY TOÀN BỘ
    // giữa chừng (effect nạp lịch sử ở dưới gọi `setMessages(loadedMessages)`), lúc đó chỉ số cũ
    // sẽ trỏ nhầm sang một tin nhắn khác và bị ghi đè.
    localId?: string;
    id?: string;                 // messageId từ server, có ở sự kiện `done`
    sender: 'user' | 'bot';
    text: string;
    audio?: string; // URL của audio nếu có
    streaming?: boolean;         // true khi token vẫn đang về
    error?: boolean;
    refusalReason?: ChatRefusalReason | null;
    suggestedModule?: SuggestedModule | null;
}

type ChatbotSectionProps = {
    variant?: 'floating' | 'inline';
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showTrigger?: boolean;
    onPanelWidthChange?: (width: number) => void;
};

const ChatbotSection = ({
    variant = 'floating',
    open,
    onOpenChange,
    showTrigger = true,
    onPanelWidthChange,
}: ChatbotSectionProps) => {

    // const [sendMessage, { isLoading: isMessagingLoading }] = useSendMessageMutation();
    const [sendMessageV2] = useSendMessageV2Mutation();
    const moduleId = useAppSelector((state) => state.lesson.moduleId);
    const params = useParams();
    const dispatch = useAppDispatch();

    const [extendableNavbar, setExtendableNavbar] = useState(false);
    const isControlled = typeof open === 'boolean';
    const isOpen = isControlled ? (open as boolean) : extendableNavbar;
    const panelRef = useRef<HTMLElement | null>(null);

    const setOpenState = (next: boolean) => {
        if (!isControlled) {
            setExtendableNavbar(next);
        }
        onOpenChange?.(next);
    };

    const toggleExtendableNavbar = () => {
        setOpenState(!isOpen);
    };

    const { data: courseResult } = useGetCoursesByLessonIdQuery(params.lessonId as string);
    const teacherId = courseResult?.data?.teacher_id;
    // console.log('Teacher id in chatbot:', teacherId);


    useEffect(() => {
    }, [moduleId]);

    useEffect(() => {
        if (variant !== 'floating' || !onPanelWidthChange) {
            return;
        }

        if (!isOpen) {
            onPanelWidthChange(0);
            return;
        }

        const panel = panelRef.current;
        if (!panel) {
            return;
        }

        const updateWidth = () => {
            onPanelWidthChange(Math.ceil(panel.getBoundingClientRect().width));
        };

        updateWidth();

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(() => {
            updateWidth();
        });
        observer.observe(panel);

        return () => observer.disconnect();
    }, [isOpen, onPanelWidthChange, variant]);


    // Skip query nếu moduleId chưa có (tránh gọi API với moduleId undefined)
    const { data: historyData, isLoading, isFetching } = useGetChatHistoryQuery(
        {
            module_id: moduleId as string,
            limit: 50,
            offset: 0
        },
        {
            skip: !moduleId
        }
    );

    useEffect(() => {
        console.log('Loaded previous history data for chatbot', historyData);


    }, [])



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
                console.log("formData:", formData);

                try {
                    const { transcript } = await transcribeAudio(formData).unwrap();
                    console.log("Transcription:", transcript);

                    // Cùng lý do như handleMessageSubmit: chỉ thêm bong bóng người dùng khi chắc
                    // chắn lượt gửi sẽ chạy, tránh câu hỏi treo không có câu trả lời.
                    if (isSendingRef.current) return;

                    setMessages(prev => [...prev, {
                        sender: "user",
                        text: transcript
                    }]);

                    await sendMessageToBot(transcript);
                } catch (error) {
                    console.error(error);
                    setMessages(prev => [...prev, {
                        sender: "bot",
                        text: "Transcription failed"
                    }]);
                }

                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                audioContextRef.current?.close();
                setVolume(0);
            };

            mediaRecorder.start();
            setRecording(true);
            console.log("Recording started...");

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
            console.log("Recording stopped.");
        }
    };
    //====================================

    //===========Chatbot Service===============//
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    const [messages, setMessages] = useState<Message[]>([]);
    const [row, setRow] = useState(1);
    const [isHydrated, setIsHydrated] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<TextAreaRef>(null);
    const [answerMode, setAnswerMode] = useState<'text' | 'audio'>('text');
    const answerModeRef = useRef<'text' | 'audio'>('text');
    const moduleIdRef = useRef<string | null>(moduleId ?? null);
    const activeBotAudioRef = useRef<HTMLAudioElement | null>(null);
    const hasAutoPlayedFirstBotAudioRef = useRef(false);
    const [isSending, setIsSending] = useState(false);
    // Bản ref của `isSending` để chặn ĐỒNG BỘ: `setIsSending` cập nhật bất đồng bộ nên không dùng
    // được state để gác ở đầu handler (hai lần Enter liên tiếp vẫn lọt qua).
    const isSendingRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const localIdSeqRef = useRef(0);

    useEffect(() => {
        answerModeRef.current = answerMode;
    }, [answerMode]);

    useEffect(() => {
        moduleIdRef.current = moduleId ?? null;
    }, [moduleId]);

    // Đổi module hoặc unmount -> hủy stream đang chạy dở. Lưu ý BẤT ĐỐI XỨNG: abort ở client
    // KHÔNG dừng server — vòng lặp SSE trong `sendMessageStream` (gsai-server) vẫn chạy hết và
    // vẫn lưu tin nhắn đầy đủ vào DB, nên tải lại trang sẽ thấy câu trả lời đủ dù bong bóng lúc
    // rời trang bị cụt.
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [moduleId]);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const focusChatInput = () => {
        requestAnimationFrame(() => {
            chatInputRef.current?.focus();
        });
    };

    const sendMessageToBot = async (messageText: string) => {
        const trimmedMessage = messageText?.trim();
        if (!trimmedMessage) return;
        // Chặn gửi chồng: chỉ cho một lượt hỏi/đáp chạy tại một thời điểm.
        if (isSendingRef.current) return;

        const currentModuleId = moduleIdRef.current;
        if (!currentModuleId) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Không tìm thấy module. Vui lòng quay lại trang khóa học và chọn bài học." },
            ]);
            return;
        }

        isSendingRef.current = true;
        setIsSending(true);
        try {
            if (!USE_STREAMING_CHAT) {
                await sendMessageToBotNonStreaming(trimmedMessage, currentModuleId);
            } else {
                await sendMessageToBotStreaming(trimmedMessage, currentModuleId);
            }
        } finally {
            isSendingRef.current = false;
            setIsSending(false);
            focusChatInput();
        }
    };

    // Đường không-stream cũ — giữ lại làm phương án dự phòng, chuyển đổi bằng `USE_STREAMING_CHAT`.
    const sendMessageToBotNonStreaming = async (trimmedMessage: string, currentModuleId: string) => {
        try {
            const response = await sendMessageV2({
                module_id: currentModuleId,
                content_type: ContentType.TEXT,
                message_text: trimmedMessage,
                answer_mode: answerModeRef.current,
            }).unwrap();

            const botAudioUrl = response.bot_response.audio_url;

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: response.bot_response.message_text,
                    audio: botAudioUrl,
                    refusalReason: response.bot_response.refusal_reason,
                    suggestedModule: response.bot_response.suggested_module,
                },
            ]);

            if (botAudioUrl && !hasAutoPlayedFirstBotAudioRef.current) {
                hasAutoPlayedFirstBotAudioRef.current = true;
                handlePlayBotAudio(botAudioUrl);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Có lỗi xảy ra, vui lòng thử lại.", error: true },
            ]);
        }
    };

    // Đường streaming (SSE) qua `POST /chat/messages/stream`.
    const sendMessageToBotStreaming = async (trimmedMessage: string, currentModuleId: string) => {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Đẩy trước một bong bóng bot rỗng, đang stream — chỉ báo "đang gõ" hiển thị khi text rỗng.
        // Định danh bằng `localId` chứ KHÔNG giữ chỉ số mảng: nếu effect nạp lịch sử thay toàn bộ
        // `messages` giữa chừng, `findIndex` trả -1 và ta bỏ qua, thay vì ghi đè nhầm tin nhắn cũ.
        const botLocalId = `bot-${Date.now()}-${localIdSeqRef.current++}`;
        setMessages((prev) => [...prev, { localId: botLocalId, sender: "bot", text: "", streaming: true }]);

        /** Cập nhật đúng bong bóng của lượt stream này; no-op nếu nó không còn trong danh sách. */
        const updateBotMessage = (patch: (msg: Message) => Message) => {
            setMessages((prev) => {
                const idx = prev.findIndex((m) => m.localId === botLocalId);
                if (idx === -1) return prev;
                const next = [...prev];
                next[idx] = patch(next[idx]);
                return next;
            });
        };

        // Gom token theo ~50ms thay vì setState mỗi delta — ReactMarkdown parse lại toàn bộ câu
        // trả lời mỗi lần cập nhật, câu trả lời dài (~400 từ) sẽ giật nếu cập nhật theo từng token.
        let pendingText = "";
        let flushTimer: ReturnType<typeof setTimeout> | null = null;
        const flush = () => {
            flushTimer = null;
            if (!pendingText) return;
            const delta = pendingText;
            pendingText = "";
            updateBotMessage((msg) => ({ ...msg, text: msg.text + delta }));
        };
        const scheduleFlush = () => {
            if (flushTimer === null) {
                flushTimer = setTimeout(flush, 50);
            }
        };

        let finalAudioUrl: string | undefined;
        try {
            for await (const event of streamChatMessage(
                {
                    module_id: currentModuleId,
                    content_type: ContentType.TEXT,
                    message_text: trimmedMessage,
                    answer_mode: answerModeRef.current,
                },
                controller.signal,
                () => dispatch(signOut()),
            )) {
                if (event.type === "token") {
                    pendingText += event.delta || "";
                    scheduleFlush();
                } else if (event.type === "done") {
                    if (flushTimer !== null) {
                        clearTimeout(flushTimer);
                    }
                    flush();
                    finalAudioUrl = event.audio_url;
                    updateBotMessage((msg) => ({
                        ...msg,
                        id: event.messageId,
                        audio: event.audio_url,
                        streaming: false,
                        refusalReason: event.refusal_reason,
                        suggestedModule: event.suggested_module,
                    }));
                } else if (event.type === "error") {
                    if (flushTimer !== null) {
                        clearTimeout(flushTimer);
                    }
                    flush();
                    updateBotMessage((msg) => ({
                        ...msg,
                        text: msg.text || event.detail || "Có lỗi xảy ra, vui lòng thử lại.",
                        streaming: false,
                        error: true,
                    }));
                }
            }

            if (finalAudioUrl && !hasAutoPlayedFirstBotAudioRef.current) {
                hasAutoPlayedFirstBotAudioRef.current = true;
                handlePlayBotAudio(finalAudioUrl);
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'AbortError') {
                // Người dùng rời trang/đổi module giữa chừng — giữ nguyên phần text đã nhận,
                // không hiển thị lỗi (tải lại trang sẽ thấy câu trả lời đầy đủ, xem ghi chú ở effect abort).
                updateBotMessage((msg) => ({ ...msg, streaming: false }));
            } else {
                console.error("Error streaming message:", error);
                updateBotMessage((msg) => ({
                    ...msg,
                    text: msg.text || "Có lỗi xảy ra, vui lòng thử lại.",
                    streaming: false,
                    error: true,
                }));
            }
        } finally {
            // Đồng bộ lại cache lịch sử (RTK Query) — tương đương `invalidatesTags` mà
            // `sendMessageV2` vẫn làm cho đường không-stream. Đặt ở `finally` để cả khi stream lỗi
            // hoặc bị abort, lịch sử vẫn được nạp (server đã lưu xong tin nhắn của nó).
            dispatch(chatApi.util.invalidateTags([{ type: 'ChatModule', id: currentModuleId }]));
        }
    };

    const handlePlayBotAudio = (audioUrl: string) => {
        // Stop any media currently playing in page (lesson video/audio) before playing latest bot audio.
        document.querySelectorAll('video, audio').forEach((media) => {
            const mediaElement = media as HTMLMediaElement;
            if (!mediaElement.paused) {
                mediaElement.pause();
            }
        });

        // Stop previous chatbot audio instance (created with new Audio) if still active.
        if (activeBotAudioRef.current) {
            activeBotAudioRef.current.pause();
            activeBotAudioRef.current.currentTime = 0;
        }

        const nextAudio = new Audio(audioUrl);
        activeBotAudioRef.current = nextAudio;
        nextAudio.currentTime = 0;
        nextAudio.play().catch((error) => {
            console.error('Error playing audio response:', error);
        });
    };

    // Ref để track xem đã load history lần đầu chưa
    const isInitialLoad = useRef(true);
    const hasLoadedHistory = useRef(false);

    // Debug logs - để theo dõi bug history mất khi reload
    useEffect(() => {
        console.log('ChatBot Debug:', {
            moduleId,
            hasHistoryData: !!historyData,
            historyMessagesCount: historyData?.messages?.length || 0,
            isLoading,
            isFetching,
            hasLoadedHistory: hasLoadedHistory.current,
            currentMessagesCount: messages.length
        });
    }, [moduleId, historyData, isLoading, isFetching, messages.length]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: hasLoadedHistory.current ? "smooth" : "auto",
        });
    }, [messages]);

    useEffect(() => {
        // KHÔNG thay toàn bộ danh sách khi đang có một lượt hỏi/đáp chạy dở: lịch sử có thể về
        // muộn hơn lúc người dùng vừa gửi câu đầu tiên, và việc thay mảng sẽ nuốt mất câu hỏi +
        // câu trả lời đang stream. Bỏ qua lần này; `invalidateTags` chạy ở cuối mỗi lượt stream sẽ
        // kích hoạt lại effect này với dữ liệu đã đầy đủ.
        if (isSendingRef.current) {
            setIsHydrated(true);
            return;
        }

        if (historyData?.messages && historyData.messages.length > 0 && !hasLoadedHistory.current) {
            const loadedMessages: Message[] = historyData.messages.map((msg) => ({
                sender: msg.sender_type === 'user' ? 'user' : 'bot',
                text: msg.message_text || '',
                audio: msg.audio_url
            }));

            setMessages(loadedMessages);
            hasLoadedHistory.current = true;

            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "auto" });
            }, 0);
        }

        setIsHydrated(true);
    }, [historyData]);

    useEffect(() => {
        return () => {
            if (activeBotAudioRef.current) {
                activeBotAudioRef.current.pause();
                activeBotAudioRef.current.currentTime = 0;
            }
        };
    }, []);


    const handleMessageSubmit = async () => {
        const data = formData.getFieldsValue();

        if (!data.chatMessage?.trim()) return;
        // Gác trước khi thêm bong bóng người dùng: nếu không, câu hỏi sẽ hiện lên nhưng bị
        // `sendMessageToBot` chặn, thành ra treo không có câu trả lời.
        if (isSendingRef.current) return;

        setMessages((prev) => [...prev, { sender: 'user', text: data.chatMessage }])

        formData.resetFields(['chatMessage']);
        setRow(1);
        focusChatInput();

        await sendMessageToBot(data.chatMessage);
    }
    //=======================================//

    

    //===========Voice Clone Service===============//
    /* 
    const [voiceCloneRecording, setVoiceCloneRecording] = useState(false);
    const [voiceCloneStream, setVoiceCloneStream] = useState<MediaStream | null>(null);
    const voiceCloneMediaRecorderRef = useRef<MediaRecorder | null>(null);
    const voiceCloneChunksRef = useRef<Blob[]>([]);
    const voiceCloneAudioContextRef = useRef<AudioContext | null>(null);
    const voiceCloneAnalyserRef = useRef<AnalyserNode | null>(null);
    const voiceCloneRafRef = useRef<number | null>(null);

    const requestVoiceCloneMicrophoneAccess = async () => {
        try {
            const voiceCloneStreamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            setPermission(true);
            setVoiceCloneStream(voiceCloneStreamData);
            alert("Cho phép truy cập Micro thành công!");
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }

    const [cloneVoiceTrigger] = useCloneVoiceMutation();

    const handleVoiceClone = async () => {
        if (!permission) {
            await requestVoiceCloneMicrophoneAccess();
            return;
        }

        try {
            if (!voiceCloneRecording && voiceCloneStream) {
                const mediaRecorder = new MediaRecorder(voiceCloneStream);
                voiceCloneMediaRecorderRef.current = mediaRecorder;
                voiceCloneChunksRef.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) voiceCloneChunksRef.current.push(e.data);
                };

                mediaRecorder.onstop = async () => {
                    const asrAudioBlob = new Blob(voiceCloneChunksRef.current, { type: "audio/webm" });
                    const asrAudioFile = new File([asrAudioBlob], "recording.webm", { type: "audio/webm" });

                    const formData = new FormData();
                    formData.append("file", asrAudioFile);

                    try {
                        const { transcript } = await transcribeAudio(formData).unwrap();
                        console.log("User transcript:", transcript);

                        // setMessages(prev => [...prev, {
                        //     sender: "user",
                        //     text: transcript
                        // }]);

                        // if (!moduleId) {
                        //     setMessages((prev) => [
                        //         ...prev,
                        //         { sender: "bot", text: "Không tìm thấy module. Vui lòng quay lại trang khóa học và chọn bài học." },
                        //     ]);
                        //     return;
                        // }

                        // const chatResponse = await sendMessage({
                        //     module_id: moduleId,
                        //     content_type: ContentType.TEXT,
                        //     message_text: transcript,
                        // }).unwrap();

                        // const botResponseText = chatResponse.bot_response.message_text;
                        // console.log("Bot response text:", botResponseText);

                        const voiceCloneResponse = await cloneVoiceTrigger({
                            text: transcript,
                            voice_name: "lnthanh", // Có thể thay đổi voice_name
                            teacher_id: teacherId as string
                        }).unwrap();

                        console.log('Voice cloned successfully:', voiceCloneResponse);

                        setMessages(prev => [...prev, {
                            sender: "bot",
                            text: transcript
                        }]);

                        // Phát audio đã clone
                        const audioUrl = voiceCloneResponse.cloned_audio_url;
                        const clonedAudio = new Audio(audioUrl);
                        clonedAudio.play().catch(error => {
                            console.error('Error playing cloned audio:', error);
                        });

                    } catch (error) {
                        console.error("Error in voice clone flow:", error);
                        setMessages(prev => [...prev, {
                            sender: "bot",
                            text: "Có lỗi xảy ra trong quá trình xử lý giọng nói."
                        }]);
                    }

                    // Cleanup volume animation
                    if (voiceCloneRafRef.current) cancelAnimationFrame(voiceCloneRafRef.current);
                    voiceCloneAudioContextRef.current?.close();
                    setVolume(0);
                };

                mediaRecorder.start();
                setVoiceCloneRecording(true);
                console.log("Voice recording started...");

                // Setup volume visualization
                const audioContext = new AudioContext();
                await audioContext.resume();
                voiceCloneAudioContextRef.current = audioContext;

                const source = audioContext.createMediaStreamSource(voiceCloneStream);
                const voiceCloneAnalyser = audioContext.createAnalyser();
                voiceCloneAnalyser.fftSize = 512;
                voiceCloneAnalyserRef.current = voiceCloneAnalyser;

                source.connect(voiceCloneAnalyser);

                const dataArray = new Uint8Array(voiceCloneAnalyser.fftSize);

                const animate = () => {
                    voiceCloneAnalyser.getByteTimeDomainData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        const value = dataArray[i] - 128;
                        sum += Math.abs(value);
                    }

                    setVolume(sum / dataArray.length);
                    voiceCloneRafRef.current = requestAnimationFrame(animate);
                };

                animate();

            } else if (voiceCloneRecording && voiceCloneMediaRecorderRef.current) {
                // Dừng recording khi bấm lần 2
                voiceCloneMediaRecorderRef.current.stop();
                setVoiceCloneRecording(false);
                console.log("Voice recording stopped.");
            }

        } catch (error) {
            console.error("Error in handleVoiceClone:", error);
            setMessages(prev => [...prev, {
                sender: "bot",
                text: "Có lỗi xảy ra khi xử lý giọng nói."
            }]);
        }
    }
     */
    //=======================================//


    return (
        <>
            {showTrigger && !isOpen && (
                <Button
                    onClick={toggleExtendableNavbar}
                    style={variant === 'floating' ? {
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 9999,
                    } : undefined}
                    className={`!w-[56px] !h-[56px] !p-0 !rounded-full !bg-[var(--color-secondary)] ${variant === 'inline' ? '!static !shadow-md' : ''}`}
                    icon={<RobotOutlined className="!text-white text-[24px]" />}
                />

            )}



            <nav
                ref={panelRef}
                className={
                    variant === 'floating'
                        ? `fixed bottom-6 right-6 z-50 h-[480px] flex flex-col border border-gray-200 rounded-[20px] bg-white shadow-xl transition-all duration-300 ${isOpen ? 'w-[360px]' : 'w-0 opacity-0 pointer-events-none'}`
                        : `h-[520px] min-h-[420px] flex flex-col border border-gray-200 rounded-[20px] bg-white shadow-xl transition-all duration-300 overflow-hidden ${isOpen ? 'w-[360px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`
                }
            >
                <div className="h-[48px] flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
                    <span className="font-semibold text-[var(--color-primary)]">
                        Trợ lý học tập
                    </span>
                    <Button
                        onClick={toggleExtendableNavbar}
                        icon={<X className="!w-[16px] !h-[16px]" />}
                        className="!border-none !shadow-none"
                    />
                </div>

                <div
                    ref={chatContainerRef}
                    className="flex-1 w-full flex flex-col gap-[1rem] overflow-y-auto p-[0.5rem]"
                >
                    {messages.map((msg, index) =>
                        msg.sender === 'user' ? (
                            <div
                                key={index}
                                className="ml-auto max-w-[80%] w-fit bg-[var(--color-secondary)] rounded-[20px] px-[0.75rem] py-[0.5rem] text-white"
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className={`max-w-[80%] w-fit rounded-[20px] px-[0.75rem] py-[0.5rem] ${msg.error ? 'bg-red-50 text-red-700' : 'bg-gray-200'}`}
                            >
                                {msg.streaming && !msg.text ? (
                                    // Chỉ báo "đang gõ" — hiện trong khoảng chờ trước token đầu tiên
                                    // (lúc này agent đang truy xuất + phân loại), biến mất ngay khi có token.
                                    <div className="flex space-x-1 h-6 items-center w-12 pl-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    </div>
                                ) : (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.text}
                                    </ReactMarkdown>
                                )}

                                {/* Nếu có audio response, hiển thị thêm nút play */}
                                {msg.audio && (
                                    <Button
                                        onClick={() => handlePlayBotAudio(msg.audio as string)}
                                        className="!mt-2 !px-2 !py-1 !text-sm !rounded-full !bg-gray-300 !text-black"
                                        icon={<Play className="!w-[16px] !h-[16px]" />}
                                    ></Button>
                                )}
                            </div>
                        )
                    )}
                    {!USE_STREAMING_CHAT && isSending && (
                        <div className="w-fit max-w-[80%] bg-gray-200 rounded-[20px] px-[0.75rem] py-[0.5rem]">
                            <div className="flex space-x-1 h-6 items-center w-12 pl-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="border-t border-gray-200 p-[0.5rem] flex-shrink-0">
                    <Form
                        form={formData}
                        onFinish={handleMessageSubmit}
                        className={`w-full flex items-end gap-2 !bg-white !border border-gray-200 !px-[0.5rem] !py-[0.5rem] ${row >= 2 ? 'rounded-[20px]' : 'rounded-full'}`}
                    >
                        <Form.Item name="chatMessage" className="!mb-0 flex-1">
                            <Input.TextArea
                                ref={chatInputRef}
                                // Khoá ô nhập trong lúc trợ giảng đang trả lời — chỉ cho một lượt
                                // hỏi/đáp chạy tại một thời điểm.
                                disabled={isSending}
                                placeholder={isSending ? "Đang trả lời…" : "Nhập câu hỏi"}
                                autoSize={{ minRows: 1, maxRows: 7 }}
                                classNames={{
                                    textarea:
                                        "!border-none !outline-none focus:!shadow-none",
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (isSending) return;
                                        formData.submit();
                                    }
                                }}
                            />
                        </Form.Item>

                        <Button
                            onClick={handleAudioRecording}
                            disabled={isSending}
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

                        {/* <Button
                            onClick={handleVoiceClone}
                            icon={
                                voiceCloneRecording ? (
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
                                    <div className="relative w-6 h-6">
                                        <Image src={AudioWaveForm} alt="Audio Wave Form" width={24} height={24} className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0" />
                                        <Image src={AudioWaveFormHover} alt="Audio wave form hover" width={24} height={24} className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100" />
                                    </div>
                                )
                            }
                            className="group !rounded-full !border-none !relative !flex !items-center !justify-center"
                        >
                        </Button> */}

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
            </nav>
        </>
    );
}

export default ChatbotSection;