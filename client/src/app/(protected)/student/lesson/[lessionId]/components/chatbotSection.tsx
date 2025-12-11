'use client';
import '@ant-design/v5-patch-for-react-19';
import {FooterSection} from "@/components/guest/ui/guest";
import React, {useState, useRef, useEffect} from 'react';
import { ChevronDown, ChevronUp,X, Check, Plus, ChevronRight, Send, Mic, Menu} from "@deemlol/next-icons";
import {Button, Card, Form, Input, Switch, Progress, Calendar} from "antd";

//For Voice Recorder
import { AudioOutlined, StopOutlined, DeleteOutlined, BorderOutlined } from '@ant-design/icons';
import {useTranscribeAudioMutation} from '@/store/api/[module]/voiceApi';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const ChatbotSection = () => {
    //===========ASR Service============//
    const [permission, setPermission] = useState(false);
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [transcribeAudio] = useTranscribeAudioMutation();

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
                        sender: "ai",
                        text: "Transcription failed"
                    }]);
                }
            };

            mediaRecorder.start();
            setRecording(true);
            console.log("Recording started...");
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

    // Load messages từ sessionStorage sau khi hydration hoàn tất
    useEffect(() => {
        const saved = sessionStorage.getItem('chatMessages');
        if (saved) {
            setMessages(JSON.parse(saved));
        }
        setIsHydrated(true);
    }, []);

    // Lưu messages vào sessionStorage (chỉ sau khi đã hydrate)
    useEffect(() => {
        if (isHydrated) {
            sessionStorage.setItem('chatMessages', JSON.stringify(messages));
        }
    }, [messages, isHydrated]);


    const handleMessageSubmit = async() => {
        const data = formData.getFieldsValue();
        console.log(data);

        

        if (!data.chatMessage?.trim()) return;
        
        setMessages((prev) => [...prev, {sender : 'user', text: data.chatMessage}])
        
        formData.resetFields(['chatMessage']);
        setRow(1);
        
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "This is the AI's response." },
            ]);
        }, 800);
    }
    //=======================================//
    
    return (
        <div className="w-[24%] h-[487px] flex flex-col items-center justify-center bg-[var(--color-bg_white)] rounded-[20px] border border-gray-200 p-[0.5rem]">
            <div className='flex-1 w-full flex flex-col items-start justify-start gap-[1rem] overflow-y-auto border-b border-gray-200  p-[0.5rem]'>
                {messages.map((msg, index) => (
                    msg.sender === 'user' ? (
                        <div key={index} className="ml-auto flex items-center justify-end bg-[var(--color-secondary)] rounded-[20px] px-[0.75rem] py-[0.5rem]">
                            <p className="text-white">{msg.text}</p>
                        </div>
                    ) : (
                        <div key={index} className="flex items-center justify-start w-full">
                            <p className="text-[var(--color-primary)]">{msg.text}</p>
                        </div>
                    )
                ))}
            </div>
            <div className="w-full flex justify-center items-center mt-[1rem]">
                <Form
                    form={formData}
                    className={`w-full flex justify-between items-end !bg-[var(--color-white)] !border !border-gray-200 !px-[0.5rem] !py-[0.5rem] ${row >= 2 ? 'rounded-[20px]' : 'rounded-full'}`}
                    onFinish={handleMessageSubmit}
                >
                    <Form.Item name="chatMessage" className="!mb-0 !flex-1">

                        <Input.TextArea
                            placeholder="Nhập câu hỏi"
                            autoSize={{ minRows: 1, maxRows: 7 }}
                            onResize={(size) => {
                                const detectedRows = Math.round(size.height / 24);
                                setRow(detectedRows);
                            }}
                            classNames={{
                                textarea: "!border-none !w-full !outline-none focus:!shadow-none focus:!outline-none focus:!border-none"
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
                        className="!rounded-full !hover:bg-[var(--color-secondary)] border-none !shadow-none"
                        icon = {recording ? <BorderOutlined /> : <AudioOutlined />}
                    />
                </Form>
            </div>
        </div>
    )
}

export default ChatbotSection;