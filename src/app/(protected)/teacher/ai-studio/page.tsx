'use client';
import '@ant-design/v5-patch-for-react-19';

import React, { useMemo, useState } from 'react';
import { Button, Empty, Input, Select, Tag } from 'antd';
import { Sparkles, Mic2, ScanSearch, MousePointerClick, Video, FolderKanban, Clock3 } from 'lucide-react';
import { useGetCoursesByTeacherQuery } from '@/store/api/[module]/courseApi';

type AILectureVideo = {
    id: string;
    title: string;
    duration: string;
    createdAt: string;
    teacherVoice: boolean;
    interactive: boolean;
    status: 'ready' | 'processing';
    courseId: string;
};

const SAMPLE_VIDEOS: AILectureVideo[] = [
    /* {
        id: 'v-001',
        title: 'Hàm số bậc hai và đồ thị parabol',
        duration: '12:20',
        createdAt: '16/03/2026',
        teacherVoice: true,
        interactive: true,
        status: 'ready',
        courseId: 'demo-math',
    },
    {
        id: 'v-002',
        title: 'Chiến tranh thế giới thứ hai - Tổng quan',
        duration: '09:45',
        createdAt: '14/03/2026',
        teacherVoice: false,
        interactive: false,
        status: 'processing',
        courseId: 'demo-history',
    }, */
];

const FEATURE_ITEMS = [
    {
        title: 'Tạo bài giảng bằng chính giọng đọc của bạn',
        description: 'Upload mẫu giọng để AI tạo video mang phong cách giảng dạy cá nhân, tăng độ quen thuộc với học sinh.',
        icon: Mic2,
    },
    {
        title: 'OCR cho video tương tác',
        description: 'Nhận diện nội dung (chữ viết) trong slide/video để tạo interactive video, cho phép học sinh click vào nội dung ngay trên video.',
        icon: ScanSearch,
    },
    {
        title: 'Quản lý và gắn vào môn học đã tạo',
        description: 'Sắp xếp video vào từng môn học cụ thể để tái sử dụng cho bài giảng, bài tập và lộ trình học tập.',
        icon: FolderKanban,
    },
];

export default function TeacherAIStudioPage() {
    const [keyword, setKeyword] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string>('all');

    const { data: coursesRes } = useGetCoursesByTeacherQuery({
        limit: 100,
        sortBy: 'created_at',
        sortOrder: 'ASC',
    });

    const activeCourses = useMemo(
        () => (coursesRes?.data ?? []).filter((course) => course.is_active),
        [coursesRes?.data],
    );

    const videos = useMemo(() => {
        const mapped = SAMPLE_VIDEOS.map((video, index) => {
            const linkedCourse = activeCourses[index % Math.max(activeCourses.length, 1)];
            return {
                ...video,
                courseId: linkedCourse?.id ?? video.courseId,
                courseName: linkedCourse?.course_name ?? 'Chưa gắn môn học',
            };
        });

        return mapped
            .filter((video) => (selectedCourse === 'all' ? true : video.courseId === selectedCourse))
            .filter((video) => video.title.toLowerCase().includes(keyword.trim().toLowerCase()));
    }, [activeCourses, keyword, selectedCourse]);

    const hasAnyVideo = SAMPLE_VIDEOS.length > 0;

    const courseOptions = [
        { label: 'Tất cả môn học', value: 'all' },
        ...activeCourses.map((course) => ({
            label: course.course_name,
            value: course.id,
        })),
    ];

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
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-3">
                        <Input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm theo tên video..."
                            size="large"
                            className="!rounded-xl"
                        />

                        <Select
                            size="large"
                            value={selectedCourse}
                            options={courseOptions}
                            onChange={setSelectedCourse}
                            className="w-full"
                        />
                    </div>
                </div>

                {videos.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {videos.map((video) => (
                            <article
                                key={video.id}
                                className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold text-[var(--color-primary)] leading-snug">{video.title}</h2>
                                        <p className="mt-1 text-sm text-slate-500">Môn học: {video.courseName}</p>
                                    </div>

                                    <Tag color={video.status === 'ready' ? 'blue' : 'processing'}>
                                        {video.status === 'ready' ? 'Sẵn sàng' : 'Đang xử lý'}
                                    </Tag>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {video.teacherVoice ? <Tag color="cyan">Giọng đọc cá nhân</Tag> : <Tag>Giọng mặc định</Tag>}
                                    {video.interactive ? <Tag color="geekblue">Interactive video (OCR)</Tag> : <Tag>Video thường</Tag>}
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Clock3 size={15} className="text-[var(--color-secondary)]" />
                                        <span>Thời lượng: {video.duration}</span>
                                    </div>
                                    <div className="text-right">Tạo ngày: {video.createdAt}</div>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <Button className="!rounded-full !border-[var(--color-secondary)] !text-[var(--color-secondary)]">
                                        Xem chi tiết
                                    </Button>
                                    <Button className="!rounded-full !border-none !bg-[var(--color-secondary)] !text-white hover:!bg-[var(--color-primary)]">
                                        Sắp xếp vào môn học
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
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
                                        Hãy tạo video bài giảng tự động bằng AI
                                    </h2>
                                    <p className="mt-2 text-slate-600">
                                        Tạo nhanh bài giảng bằng chính giọng đọc của bạn và bật OCR để biến video thành interactive video,
                                        nơi người học có thể click vào nội dung trực tiếp trên video.
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
            </div>
        </section>
    );
}
