'use client';
import '@ant-design/v5-patch-for-react-19';

import React, { useMemo, useState } from 'react';
import { Button, Empty, Input, Tag } from 'antd';
import { Sparkles, Mic2, ScanSearch, Video, Clock3, LoaderCircle, AlertCircle, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { useGetVideoGenerationRequestsQuery, useDeleteVideoGenerationRequestMutation } from '@/store/api/[module]/aiStudioApi';
import { JobStatus, IVideoStatusCard } from '@/type/videoGenJob';
import VideoPreviewModal from './components/VideoPreviewModal';
import AssignVideoToCourseModal from './components/AddVideoToCourseModal';


const FEATURE_ITEMS = [
    {
        title: 'Tạo bài giảng bằng chính giọng đọc của bạn',
        description: 'Upload mẫu giọng để AI tạo video mang phong cách giảng dạy cá nhân, tăng độ quen thuộc với học sinh.',
        icon: Mic2,
    },
    {
        title: 'OCR cho video tương tác',
        description: 'Nhận diện nội dung (chữ viết) trong slide/video để tạo ocrInteractive video, cho phép học sinh click vào nội dung ngay trên video.',
        icon: ScanSearch,
    },
    {
        title: 'Theo dõi tiến trình xử lý theo thời gian thực',
        description: 'Mỗi AI Video hiển thị rõ trạng thái tổng, tiến trình tạo voice cloning + video và trạng thái OCR để bạn kiểm soát toàn bộ pipeline.',
        icon: Video,
    },
];

const STATUS_META: Record<JobStatus, { label: string; color: string }> = {
    [JobStatus.CREATED]: { label: 'Đã tạo', color: 'default' },
    [JobStatus.QUEUED]: { label: 'Đang chờ', color: 'gold' },
    [JobStatus.PROCESSING]: { label: 'Đang xử lý', color: 'processing' },
    [JobStatus.COMPLETED]: { label: 'Hoàn thành', color: 'success' },
    [JobStatus.FAILED]: { label: 'Thất bại', color: 'error' },
};

const formatDateTime = (value: string | Date) => {
    if (!value) {
        return '--';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return String(value);
    }

    return parsed.toLocaleString('vi-VN', {
        hour12: false,
    });
};

const getOverallCardState = (item: IVideoStatusCard) => {
    if (item.jobStatus === JobStatus.FAILED || item.videoGenStatus === JobStatus.FAILED || item.ocrStatus === JobStatus.FAILED) {
        return 'failed' as const;
    }

    if (item.jobStatus === JobStatus.COMPLETED && item.videoGenStatus === JobStatus.COMPLETED && item.ocrStatus === JobStatus.COMPLETED) {
        return 'completed' as const;
    }

    return 'processing' as const;
};

export default function TeacherAIStudioPage() {
    const [keyword, setKeyword] = useState('');
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
    const [previewJobId, setPreviewJobId] = useState<string | null>(null);
    const [assignJobId, setAssignJobId] = useState<string | null>(null);
    const [deleteVideoGenerationRequest] = useDeleteVideoGenerationRequestMutation();
    const {
        data: videoCards = [],
        isLoading: isVideoCardsLoading,
        isFetching: isVideoCardsFetching,
        isError: isVideoCardsError,
        refetch,
    } = useGetVideoGenerationRequestsQuery(undefined, {
        pollingInterval: 10000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const videos = useMemo(
        () => videoCards.filter((video) => video.videoName.toLowerCase().includes(keyword.trim().toLowerCase())),
        [videoCards, keyword],
    );

    const hasAnyVideo = videoCards.length > 0;

    const handleOpenPreview = (jobId: string) => {
        setPreviewJobId(jobId);
    };

    const handleClosePreview = () => {
        setPreviewJobId(null);
    };

    const handleOpenAssign = (jobId: string) => {
        setAssignJobId(jobId);
    };

    const handleCloseAssign = () => {
        setAssignJobId(null);
    };

    const handleDeleteVideo = async (jobId: string) => {
        if (deletingJobId) {
            return;
        }

        const shouldDelete = window.confirm('Bạn có chắc muốn xóa yêu cầu video này?');
        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingJobId(jobId);
            await deleteVideoGenerationRequest(jobId).unwrap();
            await refetch();
        } catch (err) {
            console.error('Delete video generation request failed:', err);
        } finally {
            setDeletingJobId(null);
        }
    };



    return (
        <section className="w-full flex flex-col items-center mt-[5rem] mb-[8rem]">
            <div className="w-[var(--global-width)] px-4 mt-10 space-y-6">
                <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-r from-[var(--color-neutral)] via-white to-white p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]">
                                <Sparkles size={14} />
                                AI Studio cho giáo viên
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-primary)]">
                                Kho video bài giảng AI
                            </h1>
                            <p className="mt-3 text-sm md:text-base text-slate-600">
                                Lưu trữ, xem lại và sắp xếp video bài giảng đã tạo bằng AI vào từng môn học để triển khai nhanh trong lớp học.
                            </p>
                        </div>

                        <Button
                            href="/teacher/create-slide"
                            className="!h-12 !rounded-full !border-none !px-6 !font-semibold !bg-[var(--color-secondary)] !text-white hover:!bg-[var(--color-primary)]"
                        >
                            Tạo video mới với AI
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-4 md:p-5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
                        <Input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm theo tên video..."
                            size="large"
                            className="!rounded-xl"
                        />

                        <Button
                            onClick={() => refetch()}
                            title="Refresh trạng thái"
                            aria-label="Refresh trạng thái"
                            className="!h-10 !w-10 !min-w-10 !rounded-xl !border-[var(--color-secondary)] !text-[var(--color-secondary)]"
                            icon={<RefreshCw size={16} className={isVideoCardsFetching ? 'animate-spin' : ''} />}
                        />
                    </div>
                </div>

                {isVideoCardsError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        Không thể tải danh sách AI Video. Vui lòng thử lại sau.
                    </div>
                )}

                {isVideoCardsLoading && (
                    <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center text-slate-600">
                        <LoaderCircle className="mx-auto mb-2 animate-spin text-[var(--color-secondary)]" size={20} />
                        Đang tải danh sách AI Video...
                    </div>
                )}

                {!isVideoCardsLoading && videos.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {videos.map((video) => (
                            <article
                                key={video.id}
                                className="relative rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteVideo(video.id)}
                                    disabled={deletingJobId === video.id || video.jobStatus === JobStatus.PROCESSING}
                                    title="Xóa video"
                                    aria-label="Xóa video"
                                    className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deletingJobId === video.id ? (
                                        <LoaderCircle size={14} className="animate-spin" />
                                    ) : (
                                        <X size={14} />
                                    )}
                                </button>

                                <div className="flex items-start justify-between gap-3 pr-10">
                                    <div className="pr-10">
                                        <h2 className="text-lg font-bold text-[var(--color-primary)] leading-snug">{video.videoName}</h2>
                                    </div>

                                    <Tag color={STATUS_META[video.jobStatus].color} className="!mr-1">
                                        {STATUS_META[video.jobStatus].label}
                                    </Tag>
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Clock3 size={15} className="text-[var(--color-secondary)]" />
                                        <span>Tạo lúc: {formatDateTime(video.createAt)}</span>
                                    </div>
                                </div>

                                {video.errorMessage && (
                                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                                        Lỗi hệ thống: {video.errorMessage}
                                    </div>
                                )}

                                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                    {getOverallCardState(video) === 'completed' ? (
                                        <>
                                            <CheckCircle2 size={15} className="text-emerald-500" />
                                            AI Video đã hoàn tất đầy đủ OCR và voice cloning.
                                        </>
                                    ) : getOverallCardState(video) === 'failed' ? (
                                        <>
                                            <AlertCircle size={15} className="text-red-500" />
                                            Pipeline xử lý thất bại, vui lòng kiểm tra chi tiết lỗi.
                                        </>
                                    ) : (
                                        <>
                                            <LoaderCircle size={15} className="animate-spin text-[var(--color-secondary)]" />
                                            Pipeline AI Video đang chạy, hệ thống sẽ tự cập nhật trạng thái.
                                        </>
                                    )}
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <Button
                                        className="!rounded-full !border-[var(--color-secondary)] !text-[var(--color-secondary)]"
                                        onClick={() => handleOpenPreview(video.id)}
                                        disabled={video.jobStatus === JobStatus.PROCESSING}
                                    >
                                        Xem Video
                                    </Button>
                                    <Button
                                        className="!rounded-full !border-none !bg-[var(--color-secondary)] !text-white hover:!bg-[var(--color-primary)]"
                                        onClick={() => handleOpenAssign(video.id)}
                                        disabled={video.jobStatus === JobStatus.PROCESSING}
                                    >
                                        Sắp xếp vào môn học
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!isVideoCardsLoading && videos.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-blue-200 bg-gradient-to-b from-white to-[var(--color-neutral)] p-8 md:p-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <Empty
                                description={
                                    <span className="text-slate-600">
                                        {hasAnyVideo
                                            ? 'Không có video phù hợp với bộ lọc hiện tại.'
                                            : 'Bạn chưa có video bài giảng AI nào trong thư viện.'}
                                    </span>
                                }
                            />

                            {!hasAnyVideo && (
                                <>
                                    <h2 className="mt-2 text-xl md:text-2xl font-bold text-[var(--color-primary)]">
                                        Hãy tạo AI Video đầu tiên
                                    </h2>
                                    <p className="mt-2 text-slate-600">
                                        Tạo nhanh video bài giảng bằng voice cloning và OCR, sau đó theo dõi đầy đủ trạng thái xử lý ngay trong AI Studio.
                                    </p>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                                        {FEATURE_ITEMS.map((feature) => {
                                            const Icon = feature.icon;
                                            return (
                                                <div
                                                    key={feature.title}
                                                    className="rounded-xl border border-blue-100 bg-white p-4"
                                                >
                                                    <Icon className="text-[var(--color-secondary)]" size={18} />
                                                    <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">{feature.title}</p>
                                                    <p className="mt-1 text-xs text-slate-500 leading-5">{feature.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        href="/teacher/create-slide"
                                        className="!mt-6 !h-11 !rounded-full !px-6 !border-none !bg-[var(--color-secondary)] !text-white hover:!bg-[var(--color-primary)]"
                                    >
                                        Bắt đầu tạo video AI đầu tiên
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <VideoPreviewModal
                    open={Boolean(previewJobId)}
                    jobId={previewJobId}
                    onClose={handleClosePreview}
                />

                <AssignVideoToCourseModal
                    open={Boolean(assignJobId)}
                    jobId={assignJobId}
                    onClose={handleCloseAssign}
                    onAssigned={refetch}
                />
            </div>
        </section>
    );
}
