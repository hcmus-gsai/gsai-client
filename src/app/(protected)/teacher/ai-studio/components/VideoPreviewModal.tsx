'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Switch } from 'antd';
import { LoaderCircle, X } from 'lucide-react';
import { useLazyGetVideoGenerationRequestByIdQuery } from '@/store/api/[module]/aiStudioApi';

interface OCRItem {
    bbox: [number, number, number, number];
    text: string;
}

interface OCRFrame {
    renderTime: number;
    data: OCRItem[];
}

interface VideoPreviewModalProps {
    open: boolean;
    jobId: string | null;
    onClose: () => void;
}

export default function VideoPreviewModal({ open, jobId, onClose }: VideoPreviewModalProps) {
    const [isOcrEnabled, setIsOcrEnabled] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [activeBoxes, setActiveBoxes] = useState<OCRItem[]>([]);
    const [videoDisplayRect, setVideoDisplayRect] = useState({ width: 0, height: 0, left: 0, top: 0 });

    const [getVideoDetail, { data: videoDetail, isFetching: isVideoDetailFetching }] = useLazyGetVideoGenerationRequestByIdQuery();

    const videoContainerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const parsedOcrData = useMemo<OCRFrame[]>(() => {
        if (!videoDetail?.ocrJson) {
            return [];
        }

        try {
            const rawData = typeof videoDetail.ocrJson === 'string'
                ? JSON.parse(videoDetail.ocrJson)
                : videoDetail.ocrJson;

            // Legacy format: [{ renderTime, data }]
            if (Array.isArray(rawData)) {
                let accumulatedTime = 0;
                return rawData.map((item: any) => {
                    const frameTime = Number(item?.renderTime ?? 0);
                    accumulatedTime += Number.isNaN(frameTime) ? 0 : frameTime;
                    return {
                        renderTime: accumulatedTime,
                        data: Array.isArray(item?.data) ? item.data : [],
                    };
                });
            }

            // Current OCR service format: { "<absolute_time>": OCRItem[] }
            if (rawData && typeof rawData === 'object') {
                return Object.entries(rawData as Record<string, unknown>)
                    .map(([timeKey, value]) => ({
                        renderTime: Number(timeKey),
                        data: Array.isArray(value) ? (value as OCRItem[]) : [],
                    }))
                    .filter((frame) => !Number.isNaN(frame.renderTime))
                    .sort((a, b) => a.renderTime - b.renderTime);
            }

            return [];
        } catch (err) {
            console.error('Loi parse OCR JSON:', err);
            return [];
        }
    }, [videoDetail?.ocrJson]);

    const calculateVideoDisplaySize = () => {
        const videoElement = videoRef.current;
        const container = videoContainerRef.current;
        if (!videoElement || !container || !videoElement.videoWidth || !videoElement.videoHeight) {
            return;
        }

        const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
        const containerRatio = container.clientWidth / container.clientHeight;

        let width: number;
        let height: number;
        let left: number;
        let top: number;

        if (containerRatio > videoRatio) {
            height = container.clientHeight;
            width = height * videoRatio;
            top = 0;
            left = (container.clientWidth - width) / 2;
        } else {
            width = container.clientWidth;
            height = width / videoRatio;
            left = 0;
            top = (container.clientHeight - height) / 2;
        }

        setVideoDisplayRect({ width, height, left, top });
    };

    const getOCRForTime = (time: number) => {
        if (parsedOcrData.length === 0) {
            return [];
        }

        let closestFrame = parsedOcrData[parsedOcrData.length - 1];
        for (const frame of parsedOcrData) {
            if (frame.renderTime >= time) {
                closestFrame = frame;
                break;
            }
        }

        return Array.isArray(closestFrame?.data) ? closestFrame.data : [];
    };

    useEffect(() => {
        if (!open || !jobId) {
            return;
        }

        setCurrentPlaybackTime(0);
        setActiveBoxes([]);
        setIsOcrEnabled(true);
        setIsPlaying(false);
        getVideoDetail(jobId);
    }, [open, jobId, getVideoDetail]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onResize = () => calculateVideoDisplaySize();
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [open]);

    useEffect(() => {
        if (!isOcrEnabled) {
            setActiveBoxes([]);
            return;
        }

        setActiveBoxes(getOCRForTime(currentPlaybackTime));
    }, [currentPlaybackTime, parsedOcrData, isOcrEnabled]);

    useEffect(() => {
        if (open) {
            return;
        }

        if (videoRef.current) {
            videoRef.current.pause();
        }
    }, [open]);

    if (!open || !jobId) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[1px] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-primary)]">Xem Video</h3>
                        <p className="text-xs text-slate-500">Job ID: {jobId}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>OCR</span>
                            <Switch checked={isOcrEnabled} onChange={setIsOcrEnabled} />
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {isVideoDetailFetching ? (
                    <div className="h-[420px] flex items-center justify-center text-slate-500">
                        <LoaderCircle size={18} className="animate-spin mr-2" /> Đang tải video...
                    </div>
                ) : !videoDetail?.generatedVideoUrl ? (
                    <div className="h-[420px] flex items-center justify-center text-slate-500">
                        Video chưa sẵn sàng hoặc không tồn tại.
                    </div>
                ) : (
                    <div
                        ref={videoContainerRef}
                        className="relative w-full aspect-video rounded-xl overflow-hidden bg-black"
                    >
                        <video
                            ref={videoRef}
                            src={videoDetail.generatedVideoUrl}
                            controls
                            className="w-full h-full object-contain"
                            onLoadedMetadata={calculateVideoDisplaySize}
                            onTimeUpdate={(e) => setCurrentPlaybackTime(e.currentTarget.currentTime)}
                            onPlay={() => {
                                setIsPlaying(true);
                                setActiveBoxes([]);
                            }}
                            onPause={(e) => {
                                setIsPlaying(false);
                                const pausedTime = e.currentTarget.currentTime;
                                setCurrentPlaybackTime(pausedTime);
                                if (isOcrEnabled) {
                                    setActiveBoxes(getOCRForTime(pausedTime));
                                }
                            }}
                            onSeeked={(e) => {
                                const seekTime = e.currentTarget.currentTime;
                                setCurrentPlaybackTime(seekTime);
                                if (isOcrEnabled) {
                                    setActiveBoxes(getOCRForTime(seekTime));
                                }
                            }}
                        />

                        {isOcrEnabled && !isPlaying && activeBoxes.length > 0 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${videoDisplayRect.left}px`,
                                    top: `${videoDisplayRect.top}px`,
                                    width: `${videoDisplayRect.width}px`,
                                    height: `${videoDisplayRect.height}px`,
                                    pointerEvents: 'none',
                                    overflow: 'hidden',
                                }}
                            >
                                {activeBoxes.map((item, index) => {
                                    const [x, y, w, h] = item.bbox;
                                    return (
                                        <div
                                            key={`${item.text}-${index}`}
                                            className="border border-yellow-300/70 bg-yellow-200/20 hover:border-yellow-400/95 hover:bg-yellow-200/40 transition-colors"
                                            title={item.text}
                                            style={{
                                                position: 'absolute',
                                                left: `${x * 100}%`,
                                                top: `${y * 100}%`,
                                                width: `${w * 100}%`,
                                                height: `${h * 100}%`,
                                                cursor: 'pointer',
                                                pointerEvents: 'auto',
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
