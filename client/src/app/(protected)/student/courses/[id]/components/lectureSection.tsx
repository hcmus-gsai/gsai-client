'use client';
import '@ant-design/v5-patch-for-react-19';

import { useParams, useRouter } from "next/navigation";
import { Button, Card } from "antd";
import { ChevronDown, ChevronUp, Check, Circle } from "@deemlol/next-icons"
import { useState, useEffect } from 'react';

import { useGetCourseModulesQuery, useLazyGetCourseModulesQuery } from "@/store/api/[module]/courseApi";
import { useLazyGetModuleLessonsQuery } from "@/store/api/[module]/moduleApi";
import { useGetLearningProgressByCourseQuery, useLazyGetLearningProgressByCourseQuery, useUpdateLearningProgressByLessonIdMutation } from "@/store/api/[module]/lessonProgressApi";

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

import Image from "next/image";
import QuizIcon from "@/../public/student/QuizIcon.svg";
import DocumentIcon from "@/../public/student/DocumentIcon.svg";
import VideoIcon from "@/../public/student/VideoIcon.svg";

interface IChapterState {
    id: string;
    isExtended: boolean;
};

const LectureSection = () => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { id } = useParams();

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
    const moduleStats = useAppSelector(selectAllModuleStats);
    const lessonCompletionStatus = useAppSelector(selectLessonCompletionStatus);

    const LessonTypeLabel = {
        video: 'Video',
        document: 'Bài đọc',
        quiz: 'Quiz',
        project: 'Project',
    } as const;

    type LessonType = keyof typeof LessonTypeLabel;


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
                        quiz: { total: 0, completed: 0 },
                        project: { total: 0, completed: 0 },
                        moduleCompletionPercent: 0
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
                        } else if (lesson.type === 'project') {
                            currentStats.project.total++;

                        }

                        const totalLessonInModule = currentStats.video.total + currentStats.document.total + currentStats.quiz.total + currentStats.project.total;
                        const completedLessonInModule = currentStats.video.completed + currentStats.document.completed + currentStats.quiz.completed + currentStats.project.completed;

                        const moduleCompletionPercent = totalLessonInModule > 0 ? Math.round((completedLessonInModule / totalLessonInModule) * 100) : 0;
                        currentStats.moduleCompletionPercent = moduleCompletionPercent;
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
        lessonType: 'video' | 'document' | 'quiz' | 'project'
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
                                    {moduleStats[module.id]?.moduleCompletionPercent === 100 && (
                                        <div className="flex items-center justify-center gap-2">
                                            <Check width={24} height={24} className="md:w-[32px] md:h-[32px] !rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-1 md:!p-2" />
                                            <p className="font-bold text-[var(--color-secondary)]">Đã hoàn thành</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-start gap-2 border-b border-gray-300 pb-[1.25rem] overflow-x-auto no-scrollbar">
                                <div className="text-sm md:text-[1rem] font-light text-[var(--color-primary] flex items-center gap-2 text-gray-700">
                                    {moduleStats[module.id]?.video?.total > 0 && (
                                        <>
                                            <Image src={VideoIcon} alt="Video Icon" width={20} height={20} />
                                            {moduleStats[module.id]?.video?.total > 0 && moduleStats[module.id].video?.total === moduleStats[module.id].video?.completed ? (
                                                <p>Đã hoàn thành</p>
                                            ) : (
                                                <p>{`Video: ${moduleStats[module.id]?.video.completed} / ${moduleStats[module.id]?.video.total}`}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] flex items-center gap-2 text-gray-700">

                                    {moduleStats[module.id]?.quiz?.total > 0 && (
                                        <>
                                            <Image src={QuizIcon} alt="Quiz Icon" width={20} height={20} />
                                            {moduleStats[module.id].quiz.completed === moduleStats[module.id].quiz.total ? (
                                                <p>Đã hoàn thành</p>
                                            ) : (
                                                <p>{`Quiz: ${moduleStats[module.id].quiz.completed} / ${moduleStats[module.id].quiz.total}`}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] flex items-center gap-2 text-gray-700">
                                    {moduleStats[module.id]?.document?.total > 0 && (
                                        <>
                                            <Image src={DocumentIcon} alt="Document Icon" width={20} height={20} />
                                            {moduleStats[module.id]?.document?.total > 0 && moduleStats[module.id].document?.total === moduleStats[module.id].document?.completed ? (
                                                <p>Đã hoàn thành</p>
                                            ) : (
                                                <p>{`Bài đọc: ${moduleStats[module.id]?.document.completed} / ${moduleStats[module.id]?.document.total}`}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] flex items-center gap-2 text-gray-700">
                                    {moduleStats[module.id]?.project?.total > 0 && (
                                        <>
                                            <Image src={DocumentIcon} alt="Document Icon" width={20} height={20} />
                                            {moduleStats[module.id]?.project?.total > 0 && moduleStats[module.id].project?.total === moduleStats[module.id].project?.completed ? (
                                                <p>Đã hoàn thành</p>
                                            ) : (
                                                <p>{`Project: ${moduleStats[module.id]?.project.completed} / ${moduleStats[module.id]?.project.total}`}</p>
                                            )}
                                        </>
                                    )}
                                </div>
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
                                                            handleUpdateLesson(lesson.id, module.id, lesson.type as 'video' | 'document' | 'quiz' | 'project');
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
                                                            {LessonTypeLabel[lesson.type as LessonType] ?? 'Không xác định'}
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
    );
}

export default LectureSection;