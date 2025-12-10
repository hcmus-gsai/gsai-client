'use client';

import '@ant-design/v5-patch-for-react-19';
import { ChevronDown, ChevronUp, X, Check, Plus, ChevronRight, Send, Mic, Menu } from "@deemlol/next-icons";
import { Button, Card, Form, Input, Switch, Progress, Calendar } from "antd";   

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useGetCourseModulesQuery, useGetCoursesByLessonIdQuery } from "@/store/api/[module]/courseApi";
import { useLazyGetModuleLessonsQuery } from "@/store/api/[module]/moduleApi";

interface IChapterState {
    id: string;
    isExtended: boolean;
}


const ContentSection = () => {

    //===========Extendable Navbar============//
        const [extendableNavbar, setExtendableNavbar] = useState(true);
        const toggleExtendableNavbar = () => {
            setExtendableNavbar(!extendableNavbar);
        }
    
        const router = useRouter();
        const params = useParams();
        const lessonId = params.lessionId as string;
    
        const { data: courseRes } = useGetCoursesByLessonIdQuery(lessonId);
        const course = courseRes?.data;
        const { data: modulesRes } = useGetCourseModulesQuery(course ? course.id : '');
        const modules = modulesRes?.modules ?? [];
        const [triggerGetLessons] = useLazyGetModuleLessonsQuery();
        const [lessonsMap, setLessonsMap] = useState<Record<string, any[]>>({});
        const [chapterState, setChapterState] = useState<IChapterState[]>([]);
    
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
        <>
            {/* Toggle Button - shows when navbar is collapsed */}
            {
                !extendableNavbar && (
                    <Button
                        onClick={toggleExtendableNavbar}
                        className={`!w-[32px] !h-[32px] !p-0 !flex !items-center !justify-center !bg-[var(--color-secondary)] !border !border-gray-200 !rounded-full transition-all duration-300 ${extendableNavbar ? '!opacity-0 !scale-0 !w-0 !min-w-0 !p-0 !m-0' : '!opacity-100 !scale-100'
                            }`}
                        icon={<Menu className="!w-[16px] !h-[16px] !text-[var(--color-bg-white)]" />}
                    />
                )
            }


            {/* Extendable Navbar with smooth transition */}
            <nav className={`h-full p-[1.5rem] border border-gray-200 rounded-[20px] overflow-hidden relative transition-all duration-300 ease-in-out ${extendableNavbar
                ? 'w-[24%] opacity-100'
                : 'w-0 opacity-0 !p-0 !border-0'
                }`}>

                <div className={`transition-all duration-300 ${extendableNavbar ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-full flex items-center justify-start border-b border-gray-200 pb-[1rem] mb-[1rem]">
                        <p className="text-[1rem] font-bold text-[var(--color-secondary)] break-words whitespace-nowrap">{course?.course_name}</p>
                    </div>
                    <Button
                        onClick={toggleExtendableNavbar}
                        className="!absolute !top-4 !right-4 !w-[32px] !h-[32px] !flex !items-center !justify-center !border-none !bg-transparent hover:!bg-gray-100 !rounded-full !transition-colors"
                        icon={<X className="!w-[16px] !h-[16px] !text-[var(--color-primary)]" />}
                    />

                    <div className="overflow-y-auto max-h-[60vh]">
                        {modules.map((module:any) => (
                            <div key={module.id} className="w-full border-b border-gray-200 pb-[1rem] mb-[1rem]">
                                <div className="flex items-center flex-col justify-center gap-2">
                                    <div className="w-full flex flex-col items-center justify-center gap-2">
                                        <div className="w-full flex items-center justify-center gap-2">
                                            <div className="w-full flex items-start justify-start gap-2">
                                                <div className="text-[0.875rem] font-bold text-[var(--color-primary)] break-words whitespace-normal">
                                                    {module.module_name}
                                                </div>
                                                <div className="ml-auto shrink-0">
                                                    <Button onClick={() => handleToggleChapter(module.id)} className="!border-none !p-0 !m-0">
                                                        {chapterState.find((cs) => cs.id === module.id)?.isExtended ? 
                                                            <ChevronDown width={32} height={32} className="!text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300" /> : 
                                                            <ChevronRight width={32} height={32} className="!text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Chapter content with smooth transition */}
                                    <div className={`w-full grid transition-[grid-template-rows] duration-300 ease-out ${chapterState.find((cs) => cs.id === module.id)?.isExtended ? "grid-rows-[1fr] mt-[0.5rem]" : "grid-rows-[0fr] mt-0"}`}>
                                        <div className="overflow-hidden">
                                            <div className="flex flex-col gap-[0.5rem]">
                                                {(lessonsMap[module.id] ?? []).map((lesson, index) => (
                                                    console.log("Lesson Data:", lesson),
                                                    <Card 
                                                        key={lesson.id}
                                                        className="!w-full !min-h-[2.5625rem] !h-auto !flex !items-center !justify-start !rounded-none !border-none hover:!bg-gray-100 !transition-colors !duration-200 !cursor-pointer"
                                                        onClick={() => { router.push(`/student/lesson/${lesson.id}/${lesson.type}`); }}
                                                    >
                                                        <div className="w-full flex flex-col items-start justify-start">
                                                            <p className="text-[0.75rem] font-bold text-[var(--color-primary)] break-words whitespace-normal">{lesson.lesson_name}</p>
                                                            <div className="w-full flex items-center justify-start gap-2">
                                                                <p className="text-[0.75rem] font-light text-[var(--color-primary)]">
                                                                    {lesson.type === 'video'
                                                                        ? 'Video'
                                                                        : lesson.type === 'quiz'
                                                                            ? 'Quiz'    
                                                                            : 'Bài đọc'
                                                                    }
                                                                </p>
                                                                <p className="text-[0.75rem] font-light text-[var(--color-primary)]">{lesson.estimated_completion_time}</p>
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
        </>
    );
};
export default ContentSection;