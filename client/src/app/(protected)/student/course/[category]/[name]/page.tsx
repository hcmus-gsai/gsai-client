'use client';
import '@ant-design/v5-patch-for-react-19';

import { useParams, useRouter } from "next/navigation";
import { StudentGreetingSection } from "@/components/student/greeting";
import { FooterSection } from "@/components/guest/ui/guest";
import { Button, Card } from "antd";
import { ChevronDown, ChevronUp, Check } from "@deemlol/next-icons"
import { useState, useEffect } from 'react';

import { useGetCourseByIdQuery, useGetCourseModulesQuery, useLazyGetModuleLessonsQuery } from "@/store/api/[module]/courseApi";

import ClockIcon from "@/../public/student/ClockIcon.svg";
import ComputingIcon from "@/../public/student/ComputingIcon.svg";
import Image from "next/image";
interface IChapterState {
    id: string;
    isExtended: boolean;
};

const CourseModules = () => {
    const router = useRouter();

    const params = useParams();
    const courseId = params.category as string;

    // Fetch course
    const { data: courseRes } = useGetCourseByIdQuery(courseId);
    const course = courseRes?.data;

    // Fetch modules
    const { data: modulesRes } = useGetCourseModulesQuery(courseId);
    const modules = modulesRes?.modules ?? [];

    // Lazy fetch lessons
    const [triggerGetLessons, { isFetching }] = useLazyGetModuleLessonsQuery();

    // Get lessons of module
    const [lessonsMap, setLessonsMap] = useState<Record<string, any[]>>({});

    // State toggle for module
    const [chapterState, setChapterState] = useState<IChapterState[]>([]);

    // Init chapterState after load modules
    useEffect(() => {
        if (modules.length > 0) {
            setChapterState(
                modules.map((m) => ({
                    id: String(m.id),
                    isExtended: false,
                }))
            );
        }
    }, [modules]);

    // Toggle
    const handleToggleChapter = async (id: string) => {
        setChapterState((prev) =>
            prev.map((cs) =>
                cs.id === id ? { ...cs, isExtended: !cs.isExtended } : cs
            )
        );

        // Fetch if not available
        if (!lessonsMap[id]) {
            const res = await triggerGetLessons(id).unwrap();

            setLessonsMap((prev) => ({
                ...prev,
                [id]: res.lesson,
            }));
        }
    };

    return (
        <section className="flex-1 flex flex-col items-center justify-start">
            <div className="w-full mb-[1.5rem]">
                <p className="text-6xl font-semibold mb-4">{course?.course_name}</p>
                <div className="flex gap-3 mb-6">
                    <Button
                        className="!text-[var(--color-secondary)] !bg-[var(--color-neutral)] !w-[7rem] !h-[2.25rem] hover:!border-[var(--color-secondary)] !rounded-full !border-white"
                    >
                        Bài giảng
                    </Button>
                    <Button
                        className="!text-black !bg-white !w-[7rem] !h-[2.25rem] hover:!border-[var(--color-secondary)] hover:!text-[var(--color-secondary)] hover:!bg-white !rounded-full !border-white"
                    >
                        Quiz
                    </Button>
                    <Button
                        className="!text-black !bg-white !w-[7rem] !h-[2.25rem] hover:!border-[var(--color-secondary)] hover:!text-[var(--color-secondary)] hover:!bg-white !rounded-full !border-white"
                    >
                        Điểm
                    </Button>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <p className="text-[1rem] font-light text-[var(--color-primary)]">
                        Hoàn thành 75% · Dự kiến hoàn thành: 05/11/2025
                    </p>
                    <div className="bg-[var(--color-secondary)] w-full h-[10px] rounded-full">
                    </div>
                </div>
            </div>

            <div className="w-full mt-[2rem] mb-[2rem]">
                {modules.map((module) => (
                    <div key={module.id}>
                        <div className="flex items-center flex-col justify-center gap-2">
                            <div className="w-full flex flex-col items-center justify-center gap-2">
                                <div className="w-full flex items-center justify-center gap-2">
                                    <div className="flex items-center justify-start gap-2 mr-auto">
                                        <Button onClick={() => handleToggleChapter(module.id)} className="!bg-transparent !border-none !p-0 !m-0">
                                            {chapterState.find((cs) => cs.id === module.id)?.isExtended ? <ChevronUp width={32} height={32} className="!text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300" /> : <ChevronDown width={32} height={32} className="!text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300" />}
                                        </Button>
                                        <p className="text-[1.5rem] font-bold text-[var(--color-primary)]">{module.module_name}</p>
                                    </div>  
                                    <div className="flex items-center justify-start gap-2 ml-auto">
                                        <Check width={32} height={32} className="!rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-2" />
                                        {/* <p className="text-[1rem] font-bold text-[var(--color-secondary)]">{module.status}</p> */}
                                    </div>
                                </div>
                                <div className="w-full flex items-center justify-start gap-2 border-b border-gray-300 pb-[1.25rem]">
                                    <p className="text-[1rem] font-light text-[var(--color-primary)]">Đã hoàn thành</p>
                                    <p className="text-[1rem] font-light text-[var(--color-primary)]">Đã hoàn thành</p>
                                    <p className="text-[1rem] font-light text-[var(--color-primary)]">Đã hoàn thành</p>
                                </div>
                            </div>
                            <div 
                                className={`w-full flex flex-col items-start justify-start gap-[1.25rem] overflow-hidden transition-all duration-300 ease-all mb-[1rem] ${
                                    chapterState.find(cs => cs.id === module.id)?.isExtended 
                                        ? 'max-h-[2000px] opacity-100 mt-[1rem]' 
                                        : 'max-h-0 opacity-0 mt-0'
                                }`}
                            >
                                {(lessonsMap[module.id] ?? []).map((lesson, index) => (
                                    <Card
                                        key={lesson.id}
                                        className="!w-full !flex !items-center !justify-start !rounded-[20px] !border !border-gray-200 cursor-pointer hover:!border-[var(--color-secondary)] hover:shadow-md transition-all duration-200"
                                        style={{
                                            transform: chapterState.find(cs => cs.id === module.id)?.isExtended 
                                                ? 'translateY(0)' 
                                                : 'translateY(-10px)',
                                            opacity: chapterState.find(cs => cs.id === module.id)?.isExtended ? 1 : 0,
                                            transitionProperty: 'transform, opacity',
                                            transitionDuration: '0.3s',
                                            transitionTimingFunction: 'ease',
                                            transitionDelay: chapterState.find(cs => cs.id === module.id)?.isExtended 
                                                ? `${index * 50}ms` 
                                                : '0ms'
                                        }}
                                        onClick={() => { router.push(`/student/lesson/${lesson.id}/${lesson.type}`); }}
                                    >
                                        <div className="w-full flex flex-col items-start justify-start">
                                            <p className="text-[1rem] font-bold text-[var(--color-primary)]">
                                                {lesson.lesson_name}
                                            </p>

                                            <div className="w-full flex items-center justify-start gap-2">
                                                <p className="text-[1rem] font-light text-[var(--color-primary)]">
                                                    {lesson.type === "video"
                                                        ? "Video"
                                                        : lesson.type === "quiz"
                                                            ? "Quiz"
                                                            : "Bài đọc"}
                                                </p>

                                                <p className="text-[1rem] font-light text-[var(--color-primary)]">
                                                    {lesson.estimated_completion_time}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
const CourseSchedule = () => {

    const events = [
        {
            id: 1,
            name: "Thi cuối kì",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 2,
            name: "Bài tập lớn",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 3,
            name: "Bài tập lớn",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 4,
            name: "Bài tập toán ứng dụng 2",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 5,
            name: "Thi cuối kì",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 6,
            name: "Bài tập lớn",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 7,
            name: "Bài tập lớn",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 8,
            name: "Bài tập toán ứng dụng 2",
            deadline: "23:59 15/12/2025",
        }
    ]
    return (
        <section className="w-[25%] flex flex-col items-start justify-start">
            <div className="w-full h-full flex flex-col items-start justify-start gap-[2rem]">

                <Card className="w-full !rounded-[20px] !border !border-gray-300">
                    <p className = "text-[1rem] font-bold text-[var(--color-primary)] mb-[0.5rem]">Lịch học</p>
                    <p className = "text-[0.875rem] mb-[0.5rem]">Tôi cam kết sẽ học 3 ngày mỗi tuần để hoàn thành môn học này.</p>
                    <div className="w-full flex items-center justify-between mb-[0.5rem]">
                        <Button
                            className="!w-[38px] !h-[38px] !rounded-full !border !border-gray-300 !text-[1rem] font-bold text-[var(--color-primary)]"
                        >T2
                        </Button>
                        <Button
                            className="!w-[38px] !h-[38px] !rounded-full !border !border-gray-300 !text-[1rem] font-bold text-[var(--color-primary)]"
                        >T3</Button>
                        <Button
                            className="!w-[38px] !h-[38px] !rounded-full !border !border-gray-300 !text-[1rem] font-bold text-[var(--color-primary)]"
                        >T4</Button>
                        <Button
                            className="!w-[38px] !h-[38px] !rounded-full !border !border-gray-300 !text-[1rem] font-bold text-[var(--color-primary)]"
                        >T5</Button>
                        <Button
                            className="!w-[38px] !h-[38px] !rounded-full !border !border-gray-300 !text-[1rem] font-bold text-[var(--color-primary)]"
                        >T6</Button>
                        <Button
                            className="!w-[38px] !h-[38px] !rounded-full !border !border-gray-300 !text-[1rem] font-bold text-[var(--color-primary)]"
                        >T7</Button>
                        <Button
                            className="!w-[38px] !h-[38px] !rounded-full !border !border-gray-300 !text-[1rem] font-bold text-[var(--color-primary)]"
                        >CN</Button>
                    </div>
                    <p className = "text-[1rem] font-bold text-[var(--color-secondary)]">Điều chỉnh lịch học</p>
                </Card>

                <Card
                    className="w-full h-[350px] !rounded-[20px] !border !border-gray-300 shadow-sm"
                    styles={{ 
                        body: { 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            padding: '24px' 
                        } 
                    }}
                >
                    <p className="text-[1rem] font-bold text-[var(--color-primary)] mb-[1rem]">
                        Sự kiện sắp tới
                    </p>
                    <div className="flex-1 overflow-y-auto flex flex-col gap-[0.5rem] pr-2">
                        {events.map((e) => (
                            <Card
                                key={e.id}
                                className="
                                    w-full h-[80px] rounded-[20px]
                                    !border !border-gray-300
                                    [&_.ant-card-body]:!flex [&_.ant-card-body]:!items-center [&_.ant-card-body]:!justify-start [&_.ant-card-body]:!gap-2
                                "
                                styles={{ body: { padding: '12px' } }} 
                            >
                                <div>
                                    <div className = "bg-[var(--color-neutral)] w-[56px] h-[56px] rounded-full flex items-center justify-center">
                                        <Image src={ComputingIcon} alt="Computing Icon" width={24} height={24} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[1rem] font-bold text-[var(--color-primary)] truncate">
                                        {e.name}
                                    </p>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center justify-start gap-2">
                                            <Image src={ClockIcon} alt="Clock Icon" width={24} height={24} />
                                            <p className="text-[0.875rem] font-light text-[var(--color-primary)]">
                                                {e.deadline}
                                            </p>
                                        </div>
                                        
                                        <p className="text-[0.875rem] font-light text-[var(--color-primary)]">
                                            23:59
                                        </p>
                                    </div>

                                </div>
                                
                                
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
        </section>
    );
}

export default function CourseDetailPage() {
    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <div className="w-[calc(100%-12rem)] mx-auto h-full flex items-start justify-center mt-[10rem] gap-[2rem]">
                <CourseModules />
                <CourseSchedule />
            </div>
            <FooterSection hasRegisterBox={false} />
        </main>
    )
}