'use client';
import '@ant-design/v5-patch-for-react-19';

import { useParams, useRouter } from "next/navigation";
import { Button, Card } from "antd";
import { ChevronDown, ChevronUp, Check, Circle } from "@deemlol/next-icons"
import { useState, useEffect } from 'react';

import { useGetCourseModulesQuery } from "@/store/api/[module]/courseApi";
import { useLazyGetModuleLessonsQuery } from "@/store/api/[module]/moduleApi";


import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setModuleId } from "@/store/slice/lessonSlice";
import { selectAllModuleStats } from "@/store/slice/lessonProgressSlice";

import Image from "next/image";
import QuizIcon from "@/../public/student/QuizIcon.svg";
import DocumentIcon from "@/../public/student/DocumentIcon.svg";
import VideoIcon from "@/../public/student/VideoIcon.svg";

import LessonPreviewModal from "./lessonModal"

interface IChapterState {
    id: string;
    isExtended: boolean;
};

const LectureSection = () => {
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

    const moduleStats = useAppSelector(selectAllModuleStats);

    const LessonTypeLabel = {
        video: 'Video',
        document: 'Bài đọc',
        quiz: 'Quiz',
        project: 'Project',
    } as const;

    type LessonType = keyof typeof LessonTypeLabel;

    const [lessonPreviewId, setLessonPreviewId] = useState<string | null>(null);
    const [lessonPrevideType, setLessonPrevideType] = useState<string | null>(null);

    const handleClosePreview = () => {
        setLessonPreviewId(null);
        setLessonPrevideType(null);
    };

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
                                            onClick={() => { setLessonPreviewId(lesson.id as string), setLessonPrevideType(lesson.type as LessonType) }}
                                            styles={{ body: { width: '100%', padding: '16px' } }}
                                        >
                                            <div className="flex items-stretch gap-4 p-2">
                                                {/* Có thể cho thêm icon maybe idk */}
                                                <div className="flex items-center justify-start gap-2"> 
                                                    {/* <Check width={24} height={24} className="md:w-[32px] md:h-[32px] !rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-1 md:!p-2" /> */}
                                                    {/* <Button
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
                                                    /> */}
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

            <LessonPreviewModal
                open={Boolean(lessonPreviewId)}
                lessonId={lessonPreviewId}
                lessonType={lessonPrevideType}
                onClose={handleClosePreview}
            />
        </div>
    );
}

export default LectureSection;