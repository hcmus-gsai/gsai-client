'use client';
import '@ant-design/v5-patch-for-react-19';
import { FooterSection } from "@/components/guest/ui/guest";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Check, Plus, ChevronRight, Send, Mic, Menu } from "@deemlol/next-icons";
import { Button, Card, Form, Input, Switch, Progress, Calendar } from "antd";
import { RobotOutlined } from '@ant-design/icons';

//For Voice Recorder
import { AudioOutlined, StopOutlined, DeleteOutlined, BorderOutlined } from '@ant-design/icons';
import { useTranscribeAudioMutation } from '@/store/api/[module]/voiceApi';
import { useSendMessageMutation, useGetChatHistoryQuery } from '@/store/api/[module]/chatApi';
import { ContentType } from '@/type/chat.type';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hook';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const ChatbotSection = () => {

    const [sendMessage] = useSendMessageMutation();
    const moduleId = useAppSelector((state) => state.lesson.moduleId);

    const [extendableNavbar, setExtendableNavbar] = useState(false);
    const toggleExtendableNavbar = () => {
        setExtendableNavbar(prev => !prev);
    };

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

                    setMessages(prev => [...prev, {
                        sender: "user",
                        text: transcript
                    }]);
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

    // Ref để track xem đã load history lần đầu chưa
    const isInitialLoad = useRef(true);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: hasLoadedHistory.current ? "smooth" : "auto",
        });
    }, [messages]);

    // Load history từ API - chỉ load 1 lần khi có data và chưa có messages
    const hasLoadedHistory = useRef(false);

    useEffect(() => {
        if (historyData?.messages && historyData.messages.length > 0 && !hasLoadedHistory.current) {
            const loadedMessages: Message[] = historyData.messages.map((msg) => ({
                sender: msg.sender_type === 'user' ? 'user' : 'bot',
                text: msg.message_text || ''
            }));

            setMessages(loadedMessages);
            hasLoadedHistory.current = true;

            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "auto" });
            }, 0);
        }

        setIsHydrated(true);
    }, [historyData]);


    const handleMessageSubmit = async () => {
        const data = formData.getFieldsValue();



        if (!data.chatMessage?.trim()) return;

        setMessages((prev) => [...prev, { sender: 'user', text: data.chatMessage }])

        formData.resetFields(['chatMessage']);
        setRow(1);

        // Gọi API để gửi message đến chatbot

        if (!moduleId) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Không tìm thấy module. Vui lòng quay lại trang khóa học và chọn bài học." },
            ]);
            return;
        }

        try {
            const response = await sendMessage({
                module_id: moduleId,
                content_type: ContentType.TEXT,
                message_text: data.chatMessage,
            }).unwrap();

            console.log(response);

            // Thêm response từ bot vào messages
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: response.bot_response.message_text },
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Có lỗi xảy ra, vui lòng thử lại." },
            ]);
        }
    }
    //=======================================//
    return (
        <>
            {!extendableNavbar && (
                <Button
                    onClick={toggleExtendableNavbar}
                    style={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 9999,
                    }}
                    className="
                        !w-[56px]
                        !h-[56px]
                        !p-0
                        !rounded-full
                        !bg-[var(--color-secondary)]
                    "
                    icon={<RobotOutlined className="!text-white text-[24px]" />}
                />

            )}

            <nav
                className={`
                    fixed
                    bottom-6
                    right-6
                    z-50
                    h-[480px]
                    flex flex-col
                    border border-gray-200
                    rounded-[20px]
                    bg-white
                    shadow-xl
                    transition-all duration-300
                    ${extendableNavbar ? 'w-[360px]' : 'w-0 opacity-0 pointer-events-none'}
                `}
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
                    className="
                    flex-1
                    w-full
                    flex flex-col gap-[1rem]
                    overflow-y-auto
                    p-[0.5rem]
                "
                >
                    {messages.map((msg, index) =>
                        msg.sender === 'user' ? (
                            <div
                                key={index}
                                className="ml-auto max-w-[80%] bg-[var(--color-secondary)] rounded-[20px] px-[0.75rem] py-[0.5rem]"
                            >
                                <p className="text-white text-sm break-words">
                                    {msg.text}
                                </p>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className="max-w-[80%] bg-gray-200 rounded-[20px] px-[0.75rem] py-[0.5rem]"
                            >
                                <p className="text-[var(--color-primary)] text-sm break-words">
                                    {msg.text}
                                </p>
                            </div>
                        )
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
                                placeholder="Nhập câu hỏi"
                                autoSize={{ minRows: 1, maxRows: 7 }}
                                classNames={{
                                    textarea:
                                        "!border-none !outline-none focus:!shadow-none",
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        formData.submit();
                                    }
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
                    </Form>
                </div>
            </nav>
        </>
    );
}

export default ChatbotSection;