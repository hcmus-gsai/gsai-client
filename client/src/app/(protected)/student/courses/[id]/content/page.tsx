'use client';
import '@ant-design/v5-patch-for-react-19';

import { useParams, useRouter } from "next/navigation";
import { FooterSection } from "@/components/guest/ui/guest";
import { Button, Card, Progress } from "antd";
import { ChevronDown, ChevronUp, Check, Circle } from "@deemlol/next-icons"
import { useState, useEffect, useMemo } from 'react';

// import { useGetCourseByIdQuery, useGetCourseModulesQuery, useLazyGetModuleLessonsQuery } from "@/store/api/[module]/courseApi";

import { useGetCourseByIdQuery, useGetCourseModulesQuery } from "@/store/api/[module]/courseApi";
import { useLazyGetModuleLessonsQuery } from "@/store/api/[module]/moduleApi";
import { useGetLearningProgressByCourseQuery, useLazyGetLearningProgressByCourseQuery, useUpdateLearningProgressByLessonIdMutation } from "@/store/api/[module]/lessonProgressApi";
import { useLazyGetCourseModulesQuery } from "@/store/api/[module]/courseApi";
import { useGetQuizzesByCourseIdQuery } from '@/store/api/[module]/quizApi';
import { useGetAllEnrollmentsQuery } from '@/store/api/[module]/enrollmentApi';
import { LessonProgress } from "@/type/lessonProgress.type";
import { QuizCard } from '../components/quizCard';

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setModuleId } from "@/store/slice/lessonSlice";
import {
    setLessonProgressData,
    setModuleStats,
    setTotalLessons,
    toggleLessonCompletion,
    selectCompletionPercent,
    selectAllModuleStats,
    selectLessonCompletionStatus,
} from "@/store/slice/lessonProgressSlice";

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
    const { id } = useParams();



    const { data: courseRes } = useGetCourseByIdQuery(id as string, {
        skip: !id,
    });
    const course = courseRes?.data;
    const { data: moduleRes } = useGetCourseModulesQuery(id as string, {
        skip: !id,
    });
    const modules = moduleRes?.modules ?? [];
    const [triggerGetLessons] = useLazyGetModuleLessonsQuery();
    const [chapterState, setChapterState] = useState<IChapterState[]>([]);
    const [lessonsMap, setLessonsMap] = useState<Record<string, any[]>>({});

    useEffect(() => {
        if (modules.length > 0) {
            setChapterState(
                modules.map((m: any) => ({
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

    const { data: progressData } = useGetLearningProgressByCourseQuery(id as string, {
        skip: !id,
    });

    const [fetchCourseProgress] = useLazyGetLearningProgressByCourseQuery();
    const [fetchCourseModules] = useLazyGetCourseModulesQuery();
    const [fetchModuleLessons] = useLazyGetModuleLessonsQuery();
    const [triggerLessonUpdate] = useUpdateLearningProgressByLessonIdMutation();

    // Use Redux state instead of local state
    const completionPercent = useAppSelector(selectCompletionPercent);
    const moduleStats = useAppSelector(selectAllModuleStats);
    const lessonCompletionStatus = useAppSelector(selectLessonCompletionStatus);

    //Foreach module => 
    //Example Module A: {video: 2, document: 1, quiz: 1}
    type StatCount = { total: number; completed: number };
    type ModuleStats = { video: StatCount; document: StatCount; quiz: StatCount };


    useEffect(() => {
        if (!progressData) return;

        const loadCourseProgress = async () => {
            try {
                // Set lesson progress data to Redux
                dispatch(setLessonProgressData({
                    courseId: id as string,
                    lessonProgress: progressData.lessonProgress,
                }));

                const moduleResponse = await fetchCourseModules(id as string).unwrap();
                let totalLesson = 0;

                for (const module of moduleResponse.modules) {
                    const lessonsResponse = await fetchModuleLessons(module.id).unwrap();
                    totalLesson += lessonsResponse.lesson.length;

                    let currentStats = {
                        video: { total: 0, completed: 0 },
                        document: { total: 0, completed: 0 },
                        quiz: { total: 0, completed: 0 }
                    };

                    for (const lesson of lessonsResponse.lesson) {
                        const isCompleted = progressData.lessonProgress.some(
                            (progress: any) => progress.lesson_id === lesson.id && progress.is_completed
                        );

                        if (lesson.type === "video") {
                            currentStats.video.total++;
                            if (isCompleted) currentStats.video.completed++;
                        } else if (lesson.type === "document") {
                            currentStats.document.total++;
                            if (isCompleted) currentStats.document.completed++;
                        } else if (lesson.type === "quiz") {
                            currentStats.quiz.total++;
                            if (isCompleted) currentStats.quiz.completed++;
                        }
                    }

                    dispatch(setModuleStats({
                        moduleId: module.id,
                        stats: currentStats,
                    }));
                }

                dispatch(setTotalLessons(totalLesson));
            } catch (error) {
                console.error('Error loading course progress', error);
            }
        }
        loadCourseProgress();
    }, [id, progressData, dispatch, fetchCourseModules, fetchModuleLessons]);


    const handleUpdateLesson = async (
        lessonId: string,
        moduleId: string,
        lessonType: 'video' | 'document' | 'quiz'
    ) => {
        try {
            // Optimistic update in Redux
            dispatch(toggleLessonCompletion({ lessonId, moduleId, lessonType }));

            const progressResponse = await fetchCourseProgress(id as string).unwrap();
            const currentLessonProgress = progressResponse.lessonProgress.find(
                (progress: any) => progress.lesson_id === lessonId && progress.module_id === moduleId
            );

            await triggerLessonUpdate({
                lessonId: lessonId,
                isCompleted: !currentLessonProgress?.is_completed
            }).unwrap();

            // Update local lessonsMap for UI
            const lessonMap = { ...lessonsMap };
            if (lessonMap[moduleId]) {
                lessonMap[moduleId] = lessonMap[moduleId].map((lesson: any) =>
                    lesson.id === lessonId
                        ? { ...lesson, is_completed: !currentLessonProgress?.is_completed }
                        : lesson
                );
                setLessonsMap(lessonMap);
            }
        } catch (error) {
            console.error('Error updating lesson', error);
            // Revert optimistic update on error
            dispatch(toggleLessonCompletion({ lessonId, moduleId, lessonType }));
        }
    }

    return (
        <section className="w-full md:flex-1 flex flex-col items-center justify-start">
            <div className="w-full mb-[1.5rem]">
                <p className="text-3xl md:text-6xl font-semibold mb-4 text-[var(--color-primary)]">
                    {course?.course_name}
                </p>

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
                        Hoàn thành {completionPercent}% · Dự kiến hoàn thành: {course?.duration}
                    </p>
                    <Progress
                        percent={completionPercent}
                        showInfo={false}
                        strokeColor={completionPercent === 100 ? "#22c55e" : "#1363DF"}
                        trailColor="#E5E7EB"
                        className="w-full"
                    />
                </div>
            </div>

            <div className="w-full mt-[1rem] md:mt-[2rem] mb-[2rem]">
                {modules.map((module: any) => (

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
                                        <p className="text-lg md:text-[1.5rem] font-bold text-[var(--color-primary)] line-clamp-1">
                                            {module.module_name}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-start gap-2 ml-auto">
                                        {completionPercent === 100 && (
                                            <Check width={24} height={24} className="md:w-[32px] md:h-[32px] !rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-1 md:!p-2" />
                                        )}
                                    </div>
                                </div>
                                <div className="w-full flex items-center justify-start gap-2 border-b border-gray-300 pb-[1.25rem] overflow-x-auto no-scrollbar">
                                    <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] whitespace-nowrap">
                                        {completionPercent === 100 ? "Đã hoàn thành" : "Chưa hoàn thành"}
                                    </p>
                                    <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] whitespace-nowrap">
                                        {moduleStats[module.id]?.video?.total > 0 &&
                                            `Video: ${moduleStats[module.id]?.video.completed} / ${moduleStats[module.id]?.video.total}`
                                        }
                                    </p>
                                    <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] whitespace-nowrap">
                                        {moduleStats[module.id]?.quiz?.total > 0 &&
                                            `Quiz: ${moduleStats[module.id]?.quiz.completed} / ${moduleStats[module.id]?.quiz.total}`
                                        }
                                    </p>
                                    <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] whitespace-nowrap">
                                        {moduleStats[module.id]?.document?.total > 0 &&
                                            `Bài đọc: ${moduleStats[module.id]?.document.completed} / ${moduleStats[module.id]?.document.total}`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className={`w-full grid transition-[grid-template-rows] duration-300 ease-out ${chapterState.find(cs => cs.id === module.id)?.isExtended ? "grid-rows-[1fr] mt-[1rem]" : "grid-rows-[0fr] mt-0"
                                }`}>
                                <div className="overflow-hidden">
                                    <div className="flex flex-col gap-[1.25rem] pb-4">
                                        {(lessonsMap[module.id] ?? []).map((lesson, index) => (
                                            <Card
                                                key={lesson.id}
                                                className="!w-full !flex !items-center !justify-start !rounded-[20px] !border !border-gray-200 cursor-pointer hover:!border-[var(--color-secondary)] hover:shadow-md transition-all duration-200 flex"
                                                onClick={() => {
                                                    dispatch(setModuleId(module.id));
                                                    router.push(`/student/lesson/${lesson.id}/${lesson.type}`);
                                                }}
                                                styles={{ body: { width: '100%', padding: '16px' } }}
                                            >
                                                <div className="flex items-stretch gap-4 p-2">
                                                    <div className="flex items-center justify-start gap-2">
                                                        {/* <Check width={24} height={24} className="md:w-[32px] md:h-[32px] !rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-1 md:!p-2" /> */}
                                                        <Button
                                                            type="primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUpdateLesson(lesson.id, module.id, lesson.type as 'video' | 'document' | 'quiz');
                                                            }}
                                                            className="flex items-center justify-center !bg-transparent !border-none !p-0 !m-0 !shadow-none"
                                                            icon={
                                                                lessonCompletionStatus[lesson.id] ? (
                                                                    <Check
                                                                        width={24}
                                                                        height={24}
                                                                        className="md:w-[32px] md:h-[32px] !rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-1 md:!p-2 cursor-pointer"
                                                                    />
                                                                ) : (
                                                                    <Circle
                                                                        width={24}
                                                                        height={24}
                                                                        className="md:w-[32px] md:h-[32px] !rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-1 md:!p-2 cursor-pointer"
                                                                    />
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-start justify-start">
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
    const [visibleCount, setVisibleCount] = useState(0);

    const { id: courseId } = useParams();
    const { data: quizzes } = useGetQuizzesByCourseIdQuery(courseId as string);

    const { enrollment } = useGetAllEnrollmentsQuery(undefined, {
        selectFromResult: ({ data, isLoading }) => ({
            enrollment: data?.data?.find(
                (e) => e.course_id === courseId
            ),
            isLoading,
        }),
    });

    useEffect(() => {
        setVisibleCount(0);
    }, [quizzes]);

    return (
        // Mobile: w-full, Desktop: w-[25%]
        <section className="w-full md:w-[25%] flex flex-col items-start justify-start">
            <div className="w-full h-full flex flex-col items-start justify-start gap-[1.5rem] md:gap-[2rem]">

                <Card className="w-full !rounded-[20px] !border !border-gray-300">
                    <p className="text-[1rem] font-bold text-[var(--color-primary)] mb-[0.5rem]">Lịch học</p>
                    <p className="text-[0.875rem] mb-[0.5rem]">Tôi cam kết sẽ học 3 ngày mỗi tuần.</p>

                    {/* Day Buttons: Justify between để dàn đều */}
                    <div className="w-full flex items-center justify-between mb-[0.5rem] gap-1">
                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                            <Button key={day} className="!w-[32px] !h-[32px] md:!w-[38px] md:!h-[38px] !p-0 !min-w-0 !rounded-full !border !border-gray-300 !text-[0.75rem] md:!text-[1rem] font-bold text-[var(--color-primary)] flex items-center justify-center">
                                {day}
                            </Button>
                        ))}
                    </div>
                    <p className="text-[1rem] font-bold text-[var(--color-secondary)] cursor-pointer">Điều chỉnh lịch học</p>
                </Card>

                <Card
                    className="w-full h-auto !rounded-[20px] !border !border-gray-300 shadow-sm"
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
                        {!quizzes || !enrollment ? null : (
                            quizzes.map(q => (
                                <QuizCard
                                    key={q.id}
                                    quiz={q}
                                    enrollment={enrollment}
                                    onVisible={() => setVisibleCount(v => v + 1)}
                                />
                            ))
                        )}
                        {visibleCount === 0 && (
                            <p className="text-sm text-gray-400 text-center mt-4">
                                Chưa có sự kiện nào
                            </p>
                        )}
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
                <CourseModules />
                <CourseSchedule />
            </div>
            <FooterSection hasRegisterBox={false} />
        </main>
    )
}