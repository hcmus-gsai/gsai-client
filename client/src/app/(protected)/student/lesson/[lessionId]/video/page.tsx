'use client';
import '@ant-design/v5-patch-for-react-19';
import {FooterSection} from "@/components/guest/ui/guest";
import React, {useState, useRef, useEffect} from 'react';
import { ChevronDown, ChevronUp,X, Check, Plus, ChevronRight, Send, Mic, Menu} from "@deemlol/next-icons";
import {Button, Card, Form, Input, Switch, Progress, Calendar} from "antd";

//For Voice Recorder
import { AudioOutlined, StopOutlined, DeleteOutlined, BorderOutlined } from '@ant-design/icons';
import {useTranscribeAudioMutation} from '@/store/api/[module]/voiceApi';

interface IChapterState {
    id: number;
    isExtended: boolean;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const QuizContent = () => {

    const [isCompleted, setIsCompleted] = useState(true);

    return (
        <div className = "flex-1">
            <div className = "w-full flex items-center justify-start mb-[1rem]">
                <p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">Bài tập toán ứng dụng 1</p>
            </div>

            <Card
                className = "!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-neutral)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
            >
                <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Thông tin chi tiết</p>
                <div className = "flex items-start justify-between gap-[1rem]">
                    <div className = "w-full flex items-start justify-start gap-[0.5rem]">
                        <div>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Hết hạn vào</p>
                            <p className = "text-[0.875rem] text-[var(--color-primary)]">T4 12/11/2025, 23:59</p>
                        </div>
                        <div>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Thời gian</p>
                            <p className = "text-[0.875rem] text-[var(--color-primary)]">30 phút</p>
                        </div>
                    </div>

                    <div className = "">
                        <Button
                            className = "!w-[155px] !h-[54px] !rounded-full !flex !items-center !justify-center !bg-[var(--color-secondary)] !text-white"
                        >
                            Bắt đầu
                        </Button>
                    </div>
                </div>

            </Card>

            {!isCompleted? (
                <Card
                    className = "!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-bg_white)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
                >
                    <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Điểm</p>
                    <p className = "text-[0.875rem] text-[var(--color-primary)]">Bạn chưa hoàn thành bài quiz này. Điểm cao nhát sẽ được ghi nhớ.</p>
                    <p className = "text-[0.875rem] text-[var(--color-primary)]">Điểm cao nhất: 100/100</p>
                </Card>
            ) : (
                <Card
                    className = "!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-bg_white)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
                >
                    <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Điểm của bạn</p>
                    <div className = "w-full flex items-center justify-between gap-[1rem]">
                        <Progress 
                            percent = {75}
                            type = "circle"
                            size = {200}
                            strokeWidth={12}
                            strokeLinecap ="square"
                            format = {() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className = "text-[1rem] font-bold text-[var(--color-primary)]">Trả lời đúng</div>
                                    <div className = "text-[1.5rem] font-bold text-[var(--color-secondary)]">
                                        4 / 15
                                    </div>
                                </div>
                            )}
                            
                        />
                        

                        <Progress 
                            percent = {75} 
                            type = "circle"
                            size = {200}
                            strokeWidth={12}
                            strokeLinecap ="square"
                            format = {() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className = "text-[2.5rem] font-bold text-[var(--color-secondary)]">
                                        2.67
                                    </div>
                                </div>
                            )}
                        />

                        <Progress 
                            percent = {75} 
                            type = "circle"
                            size = {200}
                            strokeWidth={12}
                            strokeLinecap ="square"
                            format = {() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className = "text-[1rem] font-bold text-[var(--color-primary)]">Thời gian</div>
                                    <div className = "text-[1.5rem] font-bold text-[var(--color-secondary)]">
                                        29:28
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </Card>
            )
            }

           
        </div>
    )
}

const ActivitySection = () => {
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    //===========Extendable Navbar============//
    const [extendableNavbar, setExtendableNavbar] = useState(true);
    const toggleExtendableNavbar = () => {
        setExtendableNavbar(!extendableNavbar);
    }
    const chapters = [
        {
            id : 1,
            name : "Chương 1: Đại số tuyến tính",
            status: "Hoàn thành",
            subItem: [
                {
                    id: 'st1',
                    name : 'Hệ phương trình tuyến tính',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st2',
                    name : 'Vector',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st3',
                    name : 'Hệ phương trình tuyến tính',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st4',
                    name : 'Vector',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                }
            ]
        },
        {
            id : 2,
            name : "Chương 2: Giải tích",
            status: "Chưa hoàn thành",
            subItem: [
                {
                    id: 'st1',
                    name : 'Vi tích phân',
                    type : 'Bài đọc',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st2',
                    name : 'Tích phân',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st3',
                    name : 'Bài tập toán ứng dụng 1',
                    type : 'Quiz',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st4',
                    name : 'Đạo hàm',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                }
            ]
        },

        {
            id : 3,
            name : "Chương 3: Xác suất thống kê",
            status: "Chưa hoàn thành",
            subItem: [
                {
                    id: 'st1',
                    name : 'Xác suất',
                    type : 'Bài đọc',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st2',
                    name : 'Thống kê',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st3',
                    name : 'Bài tập xác suất thống kê',
                    type : 'Quiz',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st4',
                    name : 'Bài tập thống kê',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                }
            ]
        },
        {
            id : 4,
            name : "Chương 4: Phương trình vi phân",
            status: "Chưa hoàn thành",
            subItem: [
                {
                    id: 'st1',
                    name : 'Phương trình vi phân',
                    type : 'Bài đọc',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st2',
                    name : 'Phương trình vi phân',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st3',
                    name : 'Bài tập phương trình vi phân',
                    type : 'Quiz',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st4',
                    name : 'Bài tập phương trình vi phân',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                }
            ]
        },
    ]

    const [chapterState, setChapterState] = useState<IChapterState[]>([
        ...chapters.map((c)=>{
            return {
                id: c.id,
                isExtended: false,
            }
        })
    ])

    const handleToggleChapter = (id: number) => {

        setChapterState(
            chapterState.map((cs)=>{
                return cs.id === id ?{
                    ...cs,
                    isExtended: !cs.isExtended
                }
                : cs;
            })
        )
    }
    //=======================================//

    //===========ASR Service============//
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [transcribe, { data, isLoading, error }] = useTranscribeAudioMutation();
    const [textAreaInputValue, setTextAreaInputValue] = useState<string>("");


    useEffect(() => {
        if (audioUrl) {
        transcribe({ 
            audioUrl: audioUrl,
            message: "Yêu cầu transcribe"
        }); 
        }
    }, [audioUrl, transcribe]);

    useEffect(() => {
        if (data?.text) {
          setTextAreaInputValue(data.text);           
        }
    }, [data, setTextAreaInputValue]);


    const VoiceRecorder: React.FC<{
        value?: Blob | null,
        onChange?: (value: Blob | null) => void,
    }> = (
        {
            value,
            onChange,
        }
    ) => {
        const [isRecording, setIsRecording] = useState(false);
    
        const mediaRecorderRef = useRef<MediaRecorder | null>(null);
        const audioChunksRef = useRef<Blob[]>([]);
        const startRecording = async() => {
    
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio:true});
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];
    
                mediaRecorder.ondataavailable = (event: BlobEvent) => {
                    if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                    }
                };
    
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, {type: 'audio/wav'});
                    const url = URL.createObjectURL(audioBlob);
                    setAudioUrl(url);
            
                    if (onChange) {
                    onChange(audioBlob);
                    }
    
                    stream.getTracks().forEach((track) => track.stop());
                    
                };
                mediaRecorder.start();
                setIsRecording(true);
    
            }
            catch(error) {
                console.error("Error accessing microphone:", error);
                alert("Không thể truy cập Micro. Vui lòng kiểm tra quyền.");
            }
        };
    
        const stopRecording = () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
            }
        };
    
        const deleteRecording = () => {
            setAudioUrl(null);
            if (onChange) {
                onChange(null);
            }
        };
        
        return (
            <>
            
            {
                !isRecording && !audioUrl &&(
                    <Button
                        icon={<AudioOutlined className="text-xl text-gray-500" />} 
                        onClick={startRecording}
                        className="
                            flex items-center pl-0 
                            !rounded-full !border-none 
                            hover:!bg-[var(--color-secondary)] 
                            hover:!text-white 
                            transition-all duration-400
                            !shadow-none
                        "
                    />
                )
            }
    
            {
                isRecording && (
                    <Button
                        icon={<BorderOutlined className="text-xl text-gray-500" />}                    
                        onClick={stopRecording}
                        className="
                            flex items-center pl-0 
                            !rounded-full !border-none 
                            !bg-red-500
                            !text-white
                            !shadow-none
                        "
                    />
                )
            }
    
            {audioUrl && (
                <>
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={deleteRecording} 
                        className="
                            flex items-center pl-0 
                            !rounded-full !border-none 
                            hover:!bg-[var(--color-secondary)] 
                            hover:!text-white 
                            transition-all duration-400
                            !shadow-none
                        "
                    />
                </>
            )}
            </>
        )
    }

    //====================================

    //===========Video OCR Service============//

    const videoContainerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const toggleFullScreen = () => {
        const ele = videoContainerRef.current;

        if (!ele) {
            console.error('Video container not found');
            return;
        }

        if (!document.fullscreenElement) {
            ele.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }        
    }

    const togglePlayPause = () => {
        const videoState = videoRef.current;
        if(!videoState) {
            console.error('Video element not found');
            return;
        }

        if (videoState.paused){
            videoState.play();
            setIsPlaying(true);
        }
        else {
            videoState.pause();
            setIsPlaying(false);
        }
    }

    const updateVideoProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = parseFloat(e.target.value);

        if (!videoRef.current) {
            console.error('Video element not found');
            return;
        }

        videoRef.current.currentTime = newProgress;
        setCurrentTime(newProgress);
    }

    const volumeRef = useRef<HTMLButtonElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    const [volumeLevel, setVolumeLevel] = useState(1);
    const [prevVolumeLevel, setPrevVolumeLevel] = useState(1);

    const updateVolumeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolumeLevel(newVolume);

        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }

        if (newVolume === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }

    }

    const toggleVolume = () => {
        if (!videoRef.current) {
            return;
        }

        if (isMuted) {
            videoRef.current.volume = prevVolumeLevel;
            setVolumeLevel(prevVolumeLevel);
            setIsMuted(false);
            volumeRef.current?.setAttribute("aria-label", "Mute");
        }
        else {
            setPrevVolumeLevel(volumeLevel);
            videoRef.current.volume = 0;
            setVolumeLevel(0);
            setIsMuted(true);
            volumeRef.current?.setAttribute("aria-label", "Unmute");
        }
    }

    const formatTime = (time: number): string => {

        if (isNaN(time) || time < 0) {
            return "00:00";
        }
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        else {
            return `${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`;
        }
    }

    const handleSeek = (seconds: number) => {
        if (!videoRef.current) {
            console.error('Video element not found');
            return;
        }

        videoRef.current.currentTime += seconds;
        if (videoRef.current.currentTime < 0) {
            videoRef.current.currentTime = 0;
        }
        else if (videoRef.current.currentTime > duration) {
            videoRef.current.currentTime = duration;
        }
    }

    //===========Chatbot Service===============//

    const [messages, setMessages] = useState<Message[]>([]);
    const [row, setRow] = useState(1);

    const handleMessageSubmit = async() => {
        const data = formData.getFieldsValue();
        console.log(data)


       
        setMessages((prev) => [...prev, {sender : 'user', text: data.chatMessage}])
     
        // // Simulate AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "This is the AI's response." },
            ]);
        }, 800);
    }
    //=======================================//


    

    //ASR and OCR Toggle
    const [enableASR, setEnableASR] = useState(false);
    const [enableOCR, setEnableOCR] = useState(false);

    
    return (
        <section className = "w-[calc(100%-12rem)] flex flex-col items-center justify-center mt-[10rem]">
            <div className = "w-full flex items-start justify-center gap-[1.5rem]">
                {/* Toggle Button - shows when navbar is collapsed */}
                <Button 
                    onClick={toggleExtendableNavbar}
                    className={`!w-[32px] !h-[32px] !p-0 !flex !items-center !justify-center !bg-[var(--color-secondary)] !border !border-gray-200 !rounded-full transition-all duration-300 ${
                        extendableNavbar ? '!opacity-0 !scale-0 !w-0 !min-w-0 !p-0 !m-0' : '!opacity-100 !scale-100'
                    }`}
                    icon={<Menu className = "!w-[16px] !h-[16px] !text-[var(--color-bg-white)]" />}
                />
                
                {/* Extendable Navbar with smooth transition */}
                <nav className={`h-full p-[1.5rem] border border-gray-200 rounded-[20px] overflow-hidden relative transition-all duration-300 ease-in-out ${
                    extendableNavbar 
                        ? 'w-[24%] opacity-100' 
                        : 'w-0 opacity-0 !p-0 !border-0'
                }`}>
                    <div className={`transition-all duration-300 ${extendableNavbar ? 'opacity-100' : 'opacity-0'}`}>
                        <div className = "w-full flex items-center justify-start border-b border-gray-200 pb-[1rem] mb-[1rem]">
                            <p className = "text-[1rem] font-bold text-[var(--color-secondary)] whitespace-nowrap">Toán ứng dụng và thống kê</p>
                        </div>
                        <Button 
                            onClick={toggleExtendableNavbar}
                            className = "!absolute !top-4 !right-4 !w-[32px] !h-[32px] !flex !items-center !justify-center !border-none !bg-transparent hover:!bg-gray-100 !rounded-full !transition-colors"
                            icon={<X className = "!w-[16px] !h-[16px] !text-[var(--color-primary)]" />}
                        />
                        
                        <div className="overflow-y-auto max-h-[60vh]">
                            {chapters.map((c)=>(
                            <div key={c.id} className = "w-full border-b border-gray-200 pb-[1rem] mb-[1rem]">
                                <div className = "flex items-center flex-col justify-center gap-2">
                                    <div className = "w-full flex flex-col items-center justify-center gap-2">
                                        <div className = "w-full flex items-center justify-center gap-2">
                                            <div className  = "w-full flex items-center justify-start gap-2">
                                                <div className = "text-[0.875rem] font-bold text-[var(--color-primary)] whitespace-nowrap">{c.name}</div>
                                                <div className = "ml-auto">
                                                    <Button onClick = {() => handleToggleChapter(c.id)} className = "!border-none !p-0 !m-0">
                                                        {chapterState.find((cs) => cs.id === c.id)?.isExtended ? <ChevronDown width = {32} height = {32} className = "!text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300"/> : <ChevronRight width = {32} height = {32} className = "!text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300"/>}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Chapter content with smooth transition */}
                                    <div className={`w-full grid transition-[grid-template-rows] duration-300 ease-out ${
                                        chapterState.find((cs) => cs.id === c.id)?.isExtended ? "grid-rows-[1fr] mt-[0.5rem]" : "grid-rows-[0fr] mt-0"
                                    }`}>
                                        <div className="overflow-hidden">
                                            <div className="flex flex-col gap-[0.5rem]">
                                                {c.subItem.map((si)=>(
                                                    <Card key={si.id}
                                                        className="!w-full !h-[2.5625rem] !flex !items-center !justify-start !rounded-none !border-none hover:!bg-gray-100 !transition-colors !duration-200 !cursor-pointer"
                                                    >
                                                        <div className = "w-full flex flex-col items-start justify-start">
                                                            <p className ="text-[0.75rem] font-bold text-[var(--color-primary)] line-clamp-1">{si.name}</p>
                                                            <div className = "w-full flex items-center justify-start gap-2">
                                                                <p className ="text-[0.75rem] font-light text-[var(--color-primary)]">
                                                                    {si.type === 'video' 
                                                                        ? 'Video' 
                                                                        : si.type === 'quiz' 
                                                                        ? 'Quiz' 
                                                                        : 'Bài tập'
                                                                    }
                                                                </p>
                                                                <p className ="text-[0.75rem] font-light text-[var(--color-primary)]">{si.duration}</p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </nav>

                <div className = "flex-1 flex flex-col gap-[0.5rem]">
                    <div
                        className = "relative w-full h-full aspect-video rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                        onDoubleClick={toggleFullScreen}
                        ref={videoContainerRef}
                    >
                        <video
                            id='video'
                            ref={videoRef}
                            className = "w-full h-full object-contain"
                            src="/student/sample_video.mp4"
                            controls={false}
                            autoPlay={false}
                            onClick={togglePlayPause}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        />
                        
                        <div className = "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                            <div className = "w-full mb-3">
                                <input
                                    type="range"
                                    min={0}
                                    max={duration}
                                    value={currentTime}
                                    step="0.1"
                                    className = "w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[var(--color-secondary)] hover:h-2 transition-all"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateVideoProgress(e)}
                                />
                            </div>

                            <div className = "flex items-center justify-between">
                                <div className = "flex items-center gap-3">
                                    <button
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                        className = "text-white hover:text-[var(--color-secondary)] transition-colors p-1"
                                        onClick={togglePlayPause}
                                    >
                                        {
                                            isPlaying ? (
                                                <svg className = "w-8 h-8 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 32 32">
                                                    <path d="M8 4h6v24H8V4zm10 0h6v24h-6V4z"></path>
                                                </svg>
                                            ) : (
                                                <svg className = "w-8 h-8 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 32 32">
                                                    <path d="M6 4l20 12-20 12V4z"></path>
                                                </svg>
                                            )
                                        }
                                    </button>

                                    <button
                                        aria-label="Mute"
                                        className = "text-white hover:text-[var(--color-secondary)] transition-colors p-1"
                                        onClick={toggleVolume}
                                        ref={volumeRef}
                                    >
                                        {
                                            isMuted ? (
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.5711 22.8377C19.3572 22.9738 19.1433 23.1002 18.9294 23.2169C18.7155 23.3335 18.4919 23.4405 18.2586 23.5377C17.9669 23.6738 17.6704 23.6738 17.369 23.5377C17.0676 23.4016 16.8586 23.178 16.7419 22.8669C16.6252 22.5752 16.6398 22.2884 16.7856 22.0064C16.9315 21.7245 17.1502 21.5155 17.4419 21.3794C17.578 21.321 17.7044 21.2578 17.8211 21.1898C17.9377 21.1217 18.0544 21.0488 18.1711 20.971L14.0002 17.2669V20.5044C14.0002 21.0294 13.762 21.3939 13.2856 21.5981C12.8093 21.8023 12.3863 21.7196 12.0169 21.3502L8.1669 17.5002H4.66689C4.33634 17.5002 4.05926 17.3884 3.83564 17.1648C3.61203 16.9412 3.50023 16.6641 3.50023 16.3335V11.6669C3.50023 11.3363 3.61203 11.0592 3.83564 10.8356C4.05926 10.612 4.33634 10.5002 4.66689 10.5002H7.23356L2.45023 5.71686C2.23634 5.50297 2.12939 5.23075 2.12939 4.9002C2.12939 4.56964 2.23634 4.29742 2.45023 4.08353C2.66412 3.86964 2.93634 3.7627 3.26689 3.7627C3.59745 3.7627 3.86967 3.86964 4.08356 4.08353L23.9169 23.9169C24.1308 24.1308 24.2377 24.403 24.2377 24.7335C24.2377 25.0641 24.1308 25.3363 23.9169 25.5502C23.703 25.7641 23.4308 25.871 23.1002 25.871C22.7697 25.871 22.4975 25.7641 22.2836 25.5502L19.5711 22.8377ZM22.1669 13.971C22.1669 12.3571 21.7391 10.8842 20.8836 9.55228C20.028 8.22033 18.8808 7.22381 17.4419 6.5627C17.1502 6.42658 16.9363 6.21756 16.8002 5.93561C16.6641 5.65367 16.6447 5.36686 16.7419 5.0752C16.8586 4.76408 17.0676 4.54047 17.369 4.40436C17.6704 4.26825 17.9766 4.26825 18.2877 4.40436C20.1738 5.24047 21.6808 6.51408 22.8086 8.2252C23.9363 9.93631 24.5002 11.8516 24.5002 13.971C24.5002 14.6127 24.4419 15.2495 24.3252 15.8814C24.2086 16.5134 24.0433 17.121 23.8294 17.7044C23.6738 18.1321 23.4356 18.3995 23.1148 18.5064C22.794 18.6134 22.4975 18.6183 22.2252 18.521C21.953 18.4238 21.7343 18.2488 21.569 17.996C21.4037 17.7433 21.3988 17.4516 21.5544 17.121C21.7683 16.6155 21.9238 16.1051 22.0211 15.5898C22.1183 15.0745 22.1669 14.5349 22.1669 13.971ZM17.2377 9.82936C17.8794 10.2377 18.3752 10.8502 18.7252 11.6669C19.0752 12.4835 19.2502 13.2613 19.2502 14.0002V14.2919C19.2502 14.3891 19.2405 14.4863 19.2211 14.5835C19.1822 14.8363 19.0461 15.0016 18.8127 15.0794C18.5794 15.1571 18.3655 15.0988 18.1711 14.9044L16.6836 13.4169C16.5669 13.3002 16.4794 13.1689 16.4211 13.0231C16.3627 12.8773 16.3336 12.7266 16.3336 12.571V10.3252C16.3336 10.0919 16.4356 9.92172 16.6398 9.81478C16.844 9.70783 17.0433 9.7127 17.2377 9.82936ZM11.3752 8.10853C11.2586 7.99186 11.2002 7.85575 11.2002 7.7002C11.2002 7.54464 11.2586 7.40853 11.3752 7.29186L12.0169 6.6502C12.3863 6.28075 12.8093 6.19811 13.2856 6.40228C13.762 6.60645 14.0002 6.97103 14.0002 7.49603V9.33353C14.0002 9.60575 13.8836 9.79047 13.6502 9.8877C13.4169 9.98492 13.203 9.93631 13.0086 9.74186L11.3752 8.10853ZM11.6669 17.6752V14.9335L9.5669 12.8335H5.83356V15.1669H9.15856L11.6669 17.6752Z" fill="white"></path></svg>
                                            ) : (
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5002 17.4999H7.00016C6.66961 17.4999 6.39252 17.3881 6.16891 17.1645C5.9453 16.9409 5.8335 16.6638 5.8335 16.3332V11.6666C5.8335 11.336 5.9453 11.0589 6.16891 10.8353C6.39252 10.6117 6.66961 10.4999 7.00016 10.4999H10.5002L14.3502 6.64989C14.7196 6.28045 15.1425 6.19781 15.6189 6.40197C16.0953 6.60614 16.3335 6.97072 16.3335 7.49572V20.5041C16.3335 21.0291 16.0953 21.3936 15.6189 21.5978C15.1425 21.802 14.7196 21.7193 14.3502 21.3499L10.5002 17.4999ZM21.5835 13.9999C21.5835 14.8166 21.3988 15.5895 21.0293 16.3186C20.6599 17.0478 20.1738 17.6457 19.571 18.1124C19.3766 18.2291 19.1772 18.2339 18.9731 18.127C18.7689 18.02 18.6668 17.8499 18.6668 17.6166V10.3249C18.6668 10.0916 18.7689 9.92142 18.9731 9.81447C19.1772 9.70753 19.3766 9.71239 19.571 9.82906C20.1738 10.3152 20.6599 10.9277 21.0293 11.6666C21.3988 12.4054 21.5835 13.1832 21.5835 13.9999ZM14.0002 10.3249L11.4918 12.8332H8.16683V15.1666H11.4918L14.0002 17.6749V10.3249Z" fill="white"></path></svg>
                                            )
                                        }
                                    </button>

                                    <div className = "relative group/volume">
                                        <div className = "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover/volume:opacity-100 transition-opacity whitespace-nowrap">
                                            {Math.round(volumeLevel * 100)}%
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            value={volumeLevel}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateVolumeLevel(e)}
                                            className = "w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[var(--color-secondary)]"
                                        />
                                    </div>

                                    <div className = "flex items-center gap-2 ml-2">
                                        <button 
                                            aria-label="Seek backward 10 seconds" 
                                            className = "px-2 py-1 text-white text-xs font-semibold bg-white/10 hover:bg-white/20 rounded transition-colors"
                                            onClick={() => handleSeek(-10)}
                                        >
                                            -10s
                                        </button>
                                        <div className = "text-white text-sm font-medium min-w-[80px] text-center">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </div>
                                        <button 
                                            aria-label="Seek forward 10 seconds" 
                                            className = "px-2 py-1 text-white text-xs font-semibold bg-white/10 hover:bg-white/20 rounded transition-colors"
                                            onClick={() => handleSeek(10)}
                                        >
                                            +10s
                                        </button>
                                    </div>
                                </div>

                                <div className = "flex items-center gap-3">
                                    <button
                                        aria-label="Fullscreen"
                                        className = "text-white hover:text-[var(--color-secondary)] transition-colors p-1"
                                        onClick={toggleFullScreen}
                                    >
                                        <svg className = "w-6 h-6 fill-current" viewBox="0 0 24 24">
                                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className = "w-full flex items-center justify-center gap-[1rem] mt-[1rem] mb-[1.5rem]">
                        <div className = "flex items-center justify-center gap-[0.5rem] bg-[var(--color-secondary)] rounded-[20px] border border-gray-200 px-[0.75rem] py-[0.5rem]">
                            <p className = "text-white">ASR</p>
                            <Switch 
                                checked = {enableASR} checkedChildren = "Bật" unCheckedChildren = "Tắt" value = {enableASR} onChange = {() => setEnableASR(!enableASR)} 
                            />
                        </div>
                        <div className = "flex items-center justify-center gap-[0.5rem] bg-[var(--color-secondary)] rounded-[20px] border border-gray-200 px-[0.75rem] py-[0.5rem]">
                            <p className = "text-white">OCR</p>
                            <Switch checked = {enableOCR} checkedChildren = "Bật" unCheckedChildren = "Tắt" value = {enableOCR} onChange = {() => setEnableOCR(!enableOCR)} />
                        </div>
                        
                    </div>
                </div>


                <div className = "w-[24%] h-[487px] flex flex-col items-center justify-center bg-[var(--color-bg_white)] rounded-[20px] border border-gray-200 p-[0.5rem]">
                    <div className='flex-1 w-full flex flex-col items-start justify-start gap-[1rem] overflow-y-auto border-b border-gray-200  p-[0.5rem]'>
                        {messages.map((msg, index) => (
                            msg.sender === 'user' ? (
                                <div key={index} className="ml-auto flex items-center justify-end bg-[var(--color-secondary)] rounded-[20px] px-[0.75rem] py-[0.5rem]">
                                    <p className = "text-white">{msg.text}</p>
                                </div>
                            ) : (
                                <div key={index} className="flex items-center justify-start w-full">
                                    <p className = "text-[var(--color-primary)]">{msg.text}</p>
                                </div>
                            )
                        ))}
                    </div>
                    <div className = "w-full flex justify-center items-center mt-[1rem]">
                        <Form
                            form = {formData}
                            className = {`w-full flex justify-between items-center !bg-[var(--color-white)] !border !border-gray-200 !px-[1rem] !py-[0.5rem] ${row > 2 ? 'rounded-[20px]' : 'rounded-full'}`}
                            onFinish={handleMessageSubmit}
                        >
                            <Form.Item name="chatMessage" className="!mb-0 !flex-1">
                                
                                <Input.TextArea
                                    placeholder="Nhập câu hỏi"
                                    autoSize={{ minRows: 1, maxRows: 7 }}
                                    onResize = {(size) =>{
                                        const detectedRows = Math.round(size.height / 24);
                                        setRow(detectedRows);
                                    }}
                                    classNames={{
                                        textarea: "!border-none !w-full !outline-none focus:!shadow-none focus:!outline-none focus:!border-none"
                                    }}
                                    
                                    onKeyDown = {(e)=>{
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            formData.submit();
                                        }
                                    }}
                                    value = {textAreaInputValue}
                                />
                            </Form.Item>

                            <Form.Item
                                name = "userVoice" className="!mb-0"
                            >
                                <VoiceRecorder />                                
                            </Form.Item>
                        </Form>
                    </div>
                </div> 

            </div>
        </section>
    )
}

export default function LecturePage({
    params,
}: {
    params: { lessonId: string };
}) {
    const { lessonId } = params;

    return(

        <main className="w-full grow flex flex-col items-center justify-center min-h-screen overflow-x-clip">
            <ActivitySection />
            <FooterSection hasRegisterBox = {false}/>
        </main>
    )
}