'use client';
import '@ant-design/v5-patch-for-react-19';

import { Switch } from "antd";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, notFound } from "next/navigation";

// Section imports
import ChatbotSection from '../components/chatbotSection';
import { useAppSelector } from '@/store/hook';
import { useGetVideoGenJobByIdQuery } from '@/store/api/[module]/ocrApi';
import { useLazyGetVideoUrlQuery } from '@/store/api/[module]/videoApi';

interface OCRItem {
    bbox: [number, number, number, number];
    text: string;
}

interface ContentItem {
    id: number;
    text: string;
    translatedText?: string;
}

interface OcrItem {
    renderTime: string;
    text: string;
}

const ContentPopover = ({ detectedLang, data, rect, containerRef, onClose }: any) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return null;

    console.log(detectedLang);

    // 1. Tính toán vị trí tương đối của Box so với Video Container
    const relativeTop = rect.top - containerRect.top;
    const relativeLeft = rect.left - containerRect.left;

    // 2. Tính điểm giữa (Center) của OCR Box
    const centerX = relativeLeft + rect.width / 2

    return (
        <>
            {/* 1. Backdrop: z-index thấp hơn Popover nhưng cao hơn OCR boxes */}
            <div
                className="absolute inset-0 z-[40] cursor-default"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />

            {/* 2. Popover Content: z-index cao hơn Backdrop */}
            <div
                className="absolute z-[50] bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-200  pointer-events-auto"
                style={{
                    top: relativeTop + rect.height + 12,
                    left: `${centerX}px`,
                    transform: 'translateX(-100%)',
                    minWidth: `${rect.width + 50}px`,
                    maxWidth: '300px'
                }}
                onClick={(e) => e.stopPropagation()} // Quan trọng: chặn click lọt xuống video
            >
                <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white/95"
                />

                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-600 text-[10px] uppercase tracking-tighter">{detectedLang} --&gt; vi</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                </div>
                <p className="text-sm text-gray-700 leading-snug">{data.text} --&gt; {data.translatedText}</p>
            </div>
        </>
    );
};

export default function LectureVideoPage() {
    const { lessonId } = useParams();
    const { data } = useGetVideoGenJobByIdQuery(lessonId as string);
    const jobDetail = data?.videoGenJob;

    const ocrJson = jobDetail?.ocr_json;
    const parsedOcrData = useMemo(() => {
        if (!ocrJson || typeof ocrJson !== 'string') return [];

        try {
            const rawData = JSON.parse(ocrJson);
            if (!Array.isArray(rawData)) return [];

            let accumulatedTime = 0;
            return rawData.map((item) => {
                accumulatedTime += item.renderTime;
                return {
                    ...item,
                    renderTime: accumulatedTime
                };
            });
        } catch (e) {
            console.error("Lỗi parse OCR JSON:", e);
            return [];
        }
    }, [ocrJson]);

    //===========Video OCR Service============//
    const videoContainerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [activeBoxes, setActiveBoxes] = useState<OCRItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<{ detectLang: string, item: ContentItem, rect: DOMRect } | null>(null);

    const [videoDisplayRect, setVideoDisplayRect] = useState({ width: 0, height: 0, left: 0, top: 0 });

    const calculateVideoDisplaySize = () => {
        const video = videoRef.current;
        const container = videoContainerRef.current;
        if (!video || !container) return;

        const videoRatio = video.videoWidth / video.videoHeight;
        const containerRatio = container.clientWidth / container.clientHeight;

        let width, height, left, top;

        if (containerRatio > videoRatio) {
            // Video bị giới hạn bởi chiều cao (Pillarboxing - trống 2 bên)
            height = container.clientHeight;
            width = height * videoRatio;
            top = 0;
            left = (container.clientWidth - width) / 2;
        } else {
            // Video bị giới hạn bởi chiều rộng (Letterboxing - trống trên dưới)
            width = container.clientWidth;
            height = width / videoRatio;
            left = 0;
            top = (container.clientHeight - height) / 2;
        }

        setVideoDisplayRect({ width, height, left, top });
    };

    const getOCRForTime = (time: number) => {
        if (!Array.isArray(parsedOcrData)) return [];
        let closestFrame = parsedOcrData[0];
        for (const frame of parsedOcrData) {
            if (frame.renderTime >= time) {
                closestFrame = frame;
                break;
            }
        }

        return closestFrame?.data || [];
    };

    const handlePause = () => {
        setIsPlaying(false); // Cập nhật icon Play/Pause
        if (videoRef.current) {
            const boxes = getOCRForTime(videoRef.current.currentTime);
            setActiveBoxes(boxes); // Hiển thị các ô đỏ
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
        setActiveBoxes([]);
        setSelectedItem(null);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleDoubleClick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopImmediatePropagation();
        };

        video.addEventListener("dblclick", handleDoubleClick);
        video.addEventListener('loadedmetadata', calculateVideoDisplaySize);
        window.addEventListener('resize', calculateVideoDisplaySize);

        return () => {
            video.removeEventListener("dblclick", handleDoubleClick);
            video?.removeEventListener('loadedmetadata', calculateVideoDisplaySize);
            window.removeEventListener('resize', calculateVideoDisplaySize);
        };
    }, []);

    //===========Translate============//
    const handleItemClick = async (e: React.MouseEvent, item: ContentItem) => {
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const containerRect = videoContainerRef.current?.getBoundingClientRect();

        if (!containerRect) return;

        try {
            const languageDetectResult = await fetch(`${process.env.LIBERTRANS}/detect`, {
                method: "POST",
                body: JSON.stringify({ q: item.text }),
                headers: { "Content-Type": "application/json" }
            }).then(res => res.json());

            const lang = languageDetectResult[0].language;

            const translateResult = await fetch(`${process.env.LIBERTRANS}/translate`, {
                method: "POST",
                body: JSON.stringify({ q: item.text, source: lang, target: "vi" }),
                headers: { "Content-Type": "application/json" }
            }).then(res => res.json());

            const translatedText = translateResult.translatedText;

            setSelectedItem({
                detectLang: lang,
                item: { ...item, translatedText },
                rect
            });

        } catch (error) {
            console.error("Lỗi dịch:", error);
        }
    };

    const closePopover = () => {
        setSelectedItem(null);
    }

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
        if (!videoState) {
            console.error('Video element not found');
            return;
        }

        if (videoState.paused) {
            videoState.play();
            setIsPlaying(true);
        }
        else {
            videoState.pause();
            setIsPlaying(false);
        }
    }

    //===========Video Controller Bar============//
    // Source
    const [getVideoUrl, { data: video, isLoading, error }] = useLazyGetVideoUrlQuery();
    useEffect(() => {
        if (lessonId) {
            getVideoUrl(lessonId as string);
        }
    }, [lessonId, getVideoUrl]);

    // Volume Control
    const volumeRef = useRef<HTMLButtonElement | null>(null);
    const volumeSliderRef = useRef<HTMLDivElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVolumeDragging, setIsVolumeDragging] = useState(false);

    const [volumeLevel, setVolumeLevel] = useState(1);
    const [prevVolumeLevel, setPrevVolumeLevel] = useState(1);

    const updateVolumeLevelDirect = (newVolume: number) => {
        setVolumeLevel(newVolume);

        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }

        if (newVolume === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };

    const handleVolumeSliderInteraction = (clientX: number) => {
        if (!volumeSliderRef.current) return;

        const rect = volumeSliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        updateVolumeLevelDirect(percent);
    };

    const handleVolumeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsVolumeDragging(true);
        handleVolumeSliderInteraction(e.clientX);
    };

    const handleVolumeTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        setIsVolumeDragging(true);
        handleVolumeSliderInteraction(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isVolumeDragging) {
                e.preventDefault();
                handleVolumeSliderInteraction(e.clientX);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isVolumeDragging) {
                handleVolumeSliderInteraction(e.touches[0].clientX);
            }
        };

        const handleEnd = () => {
            setIsVolumeDragging(false);
        };

        if (isVolumeDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isVolumeDragging]);

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

    // Video Slider
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPercent, setDragPercent] = useState<number | null>(null);

    const getSliderPercent = (clientX: number): number => {
        if (!sliderRef.current) return 0;
        const rect = sliderRef.current.getBoundingClientRect();
        return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    };

    const getDuration = (): number => {
        return duration > 0 ? duration : (videoRef.current?.duration || 0);
    };

    const handleSliderMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const percent = getSliderPercent(e.clientX);
        const currentDuration = getDuration();

        setIsDragging(true);
        setDragPercent(percent * 100);

        if (currentDuration > 0 && videoRef.current) {
            const newTime = percent * currentDuration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleSliderTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();

        const percent = getSliderPercent(e.touches[0].clientX);
        const currentDuration = getDuration();

        setIsDragging(true);
        setDragPercent(percent * 100);

        if (currentDuration > 0 && videoRef.current) {
            const newTime = percent * currentDuration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !sliderRef.current) return;
            e.preventDefault();

            const percent = getSliderPercent(e.clientX);
            const currentDuration = getDuration();

            setDragPercent(percent * 100);

            if (currentDuration > 0 && videoRef.current) {
                const newTime = percent * currentDuration;
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging || !sliderRef.current) return;

            const percent = getSliderPercent(e.touches[0].clientX);
            const currentDuration = getDuration();

            setDragPercent(percent * 100);

            if (currentDuration > 0 && videoRef.current) {
                const newTime = percent * currentDuration;
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        };

        const handleEnd = () => {
            setIsDragging(false);
            setDragPercent(null);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, duration]);

    // Progress percent: dùng dragPercent khi đang kéo, ngược lại dùng currentTime
    const actualDuration = getDuration();
    const progressPercent = dragPercent !== null
        ? dragPercent
        : (actualDuration > 0 ? (currentTime / actualDuration) * 100 : 0);

    return (
        <div className="relative flex w-full gap-4">
            <div className="flex-1 flex flex-col gap-[0.5rem]">
                <div
                    className="relative w-full h-full aspect-video rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                    onDoubleClick={toggleFullScreen}
                    ref={videoContainerRef}
                >
                    <video
                        id='video'
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        src={video?.file_url}
                        controls={false}
                        autoPlay={false}
                        onClick={togglePlayPause}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    />

                    {/* Lớp phủ Bounding Boxes */}
                    <div className="video-ocr-overlay" style={{
                        position: 'absolute',
                        left: `${videoDisplayRect.left}px`,
                        top: `${videoDisplayRect.top}px`,
                        width: `${videoDisplayRect.width}px`,
                        height: `${videoDisplayRect.height}px`,
                        pointerEvents: 'none',
                        overflow: 'hidden'
                    }}>
                        {!isPlaying && activeBoxes.map((item, index) => {
                            const [x, y, w, h] = item.bbox;
                            return (
                                <div
                                    key={index}
                                    className="hover:bg-yellow-200/50 transition-colors"
                                    style={{
                                        position: 'absolute',
                                        left: `${x * 100}%`,
                                        top: `${y * 100}%`,
                                        width: `${w * 100}%`,
                                        height: `${h * 100}%`,
                                        cursor: 'pointer',
                                        pointerEvents: 'auto',
                                    }}

                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(e, { id: 1, text: item.text });
                                    }}
                                    title={item.text}
                                />
                            );
                        })}

                        {selectedItem && (
                            <ContentPopover
                                detectedLang={selectedItem.detectLang}
                                data={selectedItem.item}
                                rect={selectedItem.rect}
                                containerRef={videoContainerRef}
                                onClose={closePopover}
                            />
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                        {/* Custom Video Slider */}
                        <div
                            ref={sliderRef}
                            className="w-full mb-3 relative h-3 group/slider cursor-pointer select-none flex items-center"
                            onMouseDown={handleSliderMouseDown}
                            onTouchStart={handleSliderTouchStart}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Track background (chưa xem) */}
                            <div className="absolute left-0 right-0 h-1 group-hover/slider:h-[6px] bg-gray-500/60 rounded-full transition-all duration-150" />

                            {/* Progress bar (đã xem) */}
                            <div
                                className="absolute left-0 h-1 group-hover/slider:h-[6px] bg-[var(--color-secondary)] rounded-full transition-all duration-75"
                                style={{ width: `${progressPercent}%` }}
                            />

                            {/* Thumb (nút kéo) */}
                            <div
                                className="absolute w-3 h-3 group-hover/slider:w-4 group-hover/slider:h-4 bg-white rounded-full shadow-md transition-all duration-150 pointer-events-none"
                                style={{
                                    left: `calc(${progressPercent}% - ${progressPercent > 50 ? '8px' : '4px'})`,
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                    className="text-white hover:text-[var(--color-secondary)] transition-colors p-1"
                                    onClick={togglePlayPause}
                                >
                                    {
                                        isPlaying ? (
                                            <svg className="w-8 h-8 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 32 32">
                                                <path d="M8 4h6v24H8V4zm10 0h6v24h-6V4z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-8 h-8 fill-current" focusable="false" aria-hidden="true" viewBox="0 0 32 32">
                                                <path d="M6 4l20 12-20 12V4z"></path>
                                            </svg>
                                        )
                                    }
                                </button>

                                <button
                                    aria-label="Mute"
                                    className="text-white hover:text-[var(--color-secondary)] transition-colors p-1"
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

                                <div className="relative group/volume">
                                    {/* Tooltip hiển thị % âm lượng */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover/volume:opacity-100 transition-opacity whitespace-nowrap">
                                        {Math.round(volumeLevel * 100)}%
                                    </div>

                                    {/* Custom Volume Slider */}
                                    <div
                                        ref={volumeSliderRef}
                                        className="w-20 h-3 relative cursor-pointer select-none flex items-center"
                                        onMouseDown={handleVolumeMouseDown}
                                        onTouchStart={handleVolumeTouchStart}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Track background */}
                                        <div className="absolute left-0 right-0 h-1 bg-gray-500/60 rounded-full" />

                                        {/* Volume level bar */}
                                        <div
                                            className="absolute left-0 h-1 bg-white rounded-full transition-all duration-75"
                                            style={{ width: `${volumeLevel * 100}%` }}
                                        />

                                        {/* Thumb */}
                                        <div
                                            className="absolute w-3 h-3 bg-white rounded-full shadow-md transition-all duration-75 pointer-events-none"
                                            style={{ left: `calc(${volumeLevel * 100}% - 6px)` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-2">
                                    <button
                                        aria-label="Seek backward 10 seconds"
                                        className="px-2 py-1 text-white text-xs font-semibold bg-white/10 hover:bg-white/20 rounded transition-colors"
                                        onClick={() => handleSeek(-10)}
                                    >
                                        -10s
                                    </button>
                                    <div className="text-white text-sm font-medium min-w-[80px] text-center">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                    <button
                                        aria-label="Seek forward 10 seconds"
                                        className="px-2 py-1 text-white text-xs font-semibold bg-white/10 hover:bg-white/20 rounded transition-colors"
                                        onClick={() => handleSeek(10)}
                                    >
                                        +10s
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    aria-label="Fullscreen"
                                    className="text-white hover:text-[var(--color-secondary)] transition-colors p-1"
                                    onClick={toggleFullScreen}
                                >
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChatbotSection />
        </div>
    )
}