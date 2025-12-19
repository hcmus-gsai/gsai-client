'use client';
import '@ant-design/v5-patch-for-react-19';

import { useParams, useRouter } from "next/navigation";
import { FooterSection } from "@/components/guest/ui/guest";
import { Button, Card } from "antd";
import { ChevronDown, ChevronUp, Check } from "@deemlol/next-icons"
import { useState, useEffect } from 'react';

// import { useGetCourseByIdQuery, useGetCourseModulesQuery, useLazyGetModuleLessonsQuery } from "@/store/api/[module]/courseApi";

import {useGetCourseByIdQuery, useGetCourseModulesQuery} from "@/store/api/[module]/courseApi";
import {useLazyGetModuleLessonsQuery} from "@/store/api/[module]/moduleApi";
import { useAppDispatch } from "@/store/hook";
import { setModuleId } from "@/store/slice/lessonSlice";

import ClockIcon from "@/../public/student/ClockIcon.svg";
import ComputingIcon from "@/../public/student/ComputingIcon.svg";
import Image from "next/image";

interface IChapterState {
    id: string;
    isExtended: boolean;
};

const CourseModules = () => {
    

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {id} = useParams();

    
    
    const {data: courseRes} = useGetCourseByIdQuery(id as string, {
        skip: !id,
    });
    const course = courseRes?.data;
    const {data: moduleRes} = useGetCourseModulesQuery(id as string, {
        skip: !id,
    });
    const modules = moduleRes?.modules ?? [];
    const [triggerGetLessons] = useLazyGetModuleLessonsQuery();
    const [chapterState, setChapterState] = useState<IChapterState[]>([]);
    const [lessonsMap, setLessonsMap] = useState<Record<string, any[]>>({});

    useEffect(() => {
        if (modules.length > 0) {
            setChapterState(
                modules.map((m:any) => ({
                    id: String(m.id),
                    isExtended: false,
                }))
            );
        }
    }, [modules]);

    const handleToggleChapter = async (id: string) => {
        setChapterState((prev) =>
            prev.map((cs) =>
                cs.id === id ? { ...cs, isExtended: !cs.isExtended } : cs
            )
        );
        if (!lessonsMap[id]) {
            const res = await triggerGetLessons(id).unwrap();
            setLessonsMap((prev) => ({
                ...prev,
                [id]: res.lesson,
            }));
        }
    };

    return (
        // Mobile: w-full, Desktop: flex-1
        <section className="w-full md:flex-1 flex flex-col items-center justify-start">
            <div className="w-full mb-[1.5rem]">
                {/* Responsive Text: Mobile 3xl, Desktop 6xl */}
                <p className="text-3xl md:text-6xl font-semibold mb-4 text-[var(--color-primary)]">
                    {course?.course_name}
                </p>
                
                {/* Buttons wrapper: Wrap khi màn hình nhỏ */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Button className="!text-[var(--color-secondary)] !bg-[var(--color-neutral)] !w-[7rem] !h-[2.25rem] hover:!border-[var(--color-secondary)] !rounded-full !border-white">
                        Bài giảng
                    </Button>
                    <Button className="!text-black !bg-white !w-[7rem] !h-[2.25rem] hover:!border-[var(--color-secondary)] hover:!text-[var(--color-secondary)] hover:!bg-white !rounded-full !border-white">
                        Quiz
                    </Button>
                    <Button className="!text-black !bg-white !w-[7rem] !h-[2.25rem] hover:!border-[var(--color-secondary)] hover:!text-[var(--color-secondary)] hover:!bg-white !rounded-full !border-white">
                        Điểm
                    </Button>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <p className="text-[0.875rem] md:text-[1rem] font-light text-[var(--color-primary)]">
                        Hoàn thành 75% · Dự kiến hoàn thành: 05/11/2025
                    </p>
                    <div className="bg-[var(--color-secondary)] w-full h-[10px] rounded-full"></div>
                </div>
            </div>

            <div className="w-full mt-[1rem] md:mt-[2rem] mb-[2rem]">
                {modules.map((module:any) => (
                    <div key={module.id}>
                        <div className="flex items-center flex-col justify-center gap-2">
                            <div className="w-full flex flex-col items-center justify-center gap-2">
                                <div className="w-full flex items-center justify-center gap-2">
                                    <div className="flex items-center justify-start gap-2 mr-auto">
                                        <Button onClick={() => handleToggleChapter(module.id)} className="!bg-transparent !border-none !p-0 !m-0">
                                            {chapterState.find((cs) => cs.id === module.id)?.isExtended ? 
                                                <ChevronUp width={24} height={24} className="md:w-[32px] md:h-[32px] !text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300" /> : 
                                                <ChevronDown width={24} height={24} className="md:w-[32px] md:h-[32px] !text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300" />
                                            }
                                        </Button>
                                        {/* Module Name Responsive */}
                                        <p className="text-lg md:text-[1.5rem] font-bold text-[var(--color-primary)] line-clamp-1">
                                            {module.module_name}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-start gap-2 ml-auto">
                                        <Check width={24} height={24} className="md:w-[32px] md:h-[32px] !rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-1 md:!p-2" />
                                    </div>
                                </div>
                                <div className="w-full flex items-center justify-start gap-2 border-b border-gray-300 pb-[1.25rem] overflow-x-auto no-scrollbar">
                                    <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] whitespace-nowrap">Đã hoàn thành</p>
                                    <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] whitespace-nowrap">Video: 2/3</p>
                                    <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] whitespace-nowrap">Quiz: 1/1</p>
                                </div>
                            </div>
                            
                            {/* Animation Wrapper */}
                            <div className={`w-full grid transition-[grid-template-rows] duration-300 ease-out ${
                                chapterState.find(cs => cs.id === module.id)?.isExtended ? "grid-rows-[1fr] mt-[1rem]" : "grid-rows-[0fr] mt-0"
                            }`}>
                                <div className="overflow-hidden">
                                     <div className="flex flex-col gap-[1.25rem] pb-4">
                                        {(lessonsMap[module.id] ?? []).map((lesson, index) => (
                                            <Card
                                                key={lesson.id}
                                                className="!w-full !flex !items-center !justify-start !rounded-[20px] !border !border-gray-200 cursor-pointer hover:!border-[var(--color-secondary)] hover:shadow-md transition-all duration-200"
                                                onClick={() => { 
                                                    dispatch(setModuleId(module.id));
                                                    router.push(`/student/lesson/${lesson.id}/${lesson.type}`); 
                                                }}
                                                styles={{ body: { width: '100%', padding: '16px' } }}
                                            >
                                                <div className="w-full flex flex-col items-start justify-start">
                                                    <p className="text-[1rem] font-bold text-[var(--color-primary)]">
                                                        {lesson.lesson_name}
                                                    </p>
                                                    <div className="w-full flex items-center justify-start gap-2 mt-1">
                                                        <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)]">
                                                            {lesson.type === "video" ? "Video" : lesson.type === "quiz" ? "Quiz" : "Bài đọc"}
                                                        </p>
                                                        <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)]">
                                                            {lesson.estimated_completion_time}
                                                        </p>
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
        </section>
    );
}

const CourseSchedule = () => {
    const events = [
        { id: 1, name: "Thi cuối kì", deadline: "23:59 15/12/2025" },
        { id: 2, name: "Bài tập lớn", deadline: "23:59 15/12/2025" },
        { id: 3, name: "Bài tập lớn", deadline: "23:59 15/12/2025" },
        { id: 4, name: "Toán ứng dụng 2", deadline: "23:59 15/12/2025" },
        { id: 5, name: "Thi cuối kì", deadline: "23:59 15/12/2025" },
    ]
    
    return (
        // Mobile: w-full, Desktop: w-[25%]
        <section className="w-full md:w-[25%] flex flex-col items-start justify-start">
            <div className="w-full h-full flex flex-col items-start justify-start gap-[1.5rem] md:gap-[2rem]">

                <Card className="w-full !rounded-[20px] !border !border-gray-300">
                    <p className="text-[1rem] font-bold text-[var(--color-primary)] mb-[0.5rem]">Lịch học</p>
                    <p className="text-[0.875rem] mb-[0.5rem]">Tôi cam kết sẽ học 3 ngày mỗi tuần.</p>
                    
                    {/* Day Buttons: Justify between để dàn đều */}
                    <div className="w-full flex items-center justify-between mb-[0.5rem] gap-1">
                        {['T2','T3','T4','T5','T6','T7','CN'].map(day => (
                            <Button key={day} className="!w-[32px] !h-[32px] md:!w-[38px] md:!h-[38px] !p-0 !min-w-0 !rounded-full !border !border-gray-300 !text-[0.75rem] md:!text-[1rem] font-bold text-[var(--color-primary)] flex items-center justify-center">
                                {day}
                            </Button>
                        ))}
                    </div>
                    <p className="text-[1rem] font-bold text-[var(--color-secondary)] cursor-pointer">Điều chỉnh lịch học</p>
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
                    <div className="flex-1 overflow-y-auto flex flex-col gap-[0.5rem] pr-2 custom-scrollbar">
                        {events.map((e) => (
                            <Card
                                key={e.id}
                                className="w-full min-h-[80px] rounded-[20px] !border !border-gray-300 shrink-0"
                                styles={{ body: { padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }}
                            >
                                <div className="bg-[var(--color-neutral)] w-[48px] h-[48px] rounded-full flex-shrink-0 flex items-center justify-center">
                                    <Image src={ComputingIcon} alt="Icon" width={20} height={20} />
                                </div>
                                <div className="flex-1 min-w-0"> {/* min-w-0 giúp truncate hoạt động trong flex */}
                                    <p className="text-[0.875rem] md:text-[1rem] font-bold text-[var(--color-primary)] truncate">
                                        {e.name}
                                    </p>
                                    <div className="flex items-center justify-between gap-1 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Image src={ClockIcon} alt="Clock" width={16} height={16} />
                                            <p className="text-[0.75rem] font-light text-[var(--color-primary)] whitespace-nowrap">
                                               15/12
                                            </p>
                                        </div>
                                        <p className="text-[0.75rem] font-light text-[var(--color-primary)]">
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
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    if (!isClient) {
        return <div>Loading...</div>;
    }
    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-hidden bg-white">
            {/* CONTAINER CHÍNH */}
            <div className="
                w-full px-4 md:px-0 md:w-[var(--global-width)] 
                mx-auto h-full 
                flex flex-col-reverse md:flex-row 
                items-start justify-center 
                mt-[6rem] md:mt-[10rem] 
                gap-[2rem]
            ">
            {/* Duc code here */}
            {/* <div className="w-full px-4 md:px-0 md:w-[var(--global-width)] mx-auto h-full flex flex-col-reverse md:flex-row items-start justify-center mt-[6rem] md:mt-[10rem] gap-[2rem]"> */}

                {/* flex-col-reverse:
                   - Mobile: CourseSchedule (Item 2) lên đầu, CourseModules (Item 1) xuống dưới.
                   - Desktop (md:flex-row): Modules bên Trái, Schedule bên Phải.
                */}
                <CourseModules />
                <CourseSchedule />
            </div>
            <FooterSection hasRegisterBox={false} />
        </main>
    )
}