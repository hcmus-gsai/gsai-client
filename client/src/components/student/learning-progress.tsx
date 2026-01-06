"use client";

import { useRouter } from "next/navigation";
import { Button, Progress } from "antd";
import VideoIcon from "@/../public/student/VideoIcon.svg";
import MoreIcon from "@/../public/student/MoreIcon.svg";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
//API call
import {useGetAllEnrollmentsQuery} from "@/store/api/[module]/enrollmentApi";
import {EnrolledCourse} from "@/type/enrollment.type";
import { useLazyGetLearningProgressByEnrollmentQuery} from "@/store/api/[module]/lessonProgressApi";
import {useLazyGetCourseModulesQuery} from "@/store/api/[module]/courseApi";
import {LessonProgress} from "@/type/lessonProgress.type";
import {useLazyGetModuleLessonsQuery} from "@/store/api/[module]/moduleApi";




const LearningProgressSection = () => {
    const router = useRouter();
    // let inProgressEnrollments: EnrolledCourse[] = [];
    
    const { data: enrollmentsData, isLoading: enrollmentsLoading } = useGetAllEnrollmentsQuery();
    const enrollments = useMemo(() => enrollmentsData?.data ?? [], [enrollmentsData?.data]);
    const [fetchProgress] = useLazyGetLearningProgressByEnrollmentQuery();
    const [fetchModules] = useLazyGetCourseModulesQuery();
    const [fetchModuleLessons] = useLazyGetModuleLessonsQuery();
    const [progressMap, setProgressMap] = useState<Record<string, LessonProgress[]>>({});
    const [totalLessonMap, setTotalLessonMap] = useState<Record<string, number>>({});

    const typeTranslate: Record<string, {label: string}> = {
        'video': {label: 'Video'},
        'document': {label: 'Tài liệu'},
        'quiz': {label: 'Quiz'},
        'project': {label: 'Bài tập lớn'},
    }

    const getCompletionPercent = useMemo(() => {
        return (courseId: string) => {
            const progress = progressMap[courseId];

            const totalLesson = totalLessonMap[courseId];
            
            if (!progress || !totalLesson || totalLesson === 0) return 0;

            const completedCount = progress.filter(p => p.is_completed).length;
            const completionPercent = Math.round((completedCount / totalLesson) * 100);
            
            return completionPercent;
        }
    }, [progressMap, totalLessonMap]);

    const getChosenLesson = useMemo(() => {
        return (courseId: string) => {
            const progress = progressMap[courseId];
            if (!progress || progress.length === 0) return null;
            const currentProgress = progress.find(p => !p.is_completed && p.lesson?.order_index === Math.min(...progress.filter(p => !p.is_completed).map(p => p.lesson?.order_index || 0)));
            return currentProgress?.lesson || null;
        }
    }, [progressMap]);

    const formatTime = useMemo(() => {
        return (time: string) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            if (hours > 0) return `${hours} giờ`;
            if (minutes > 0) return `${minutes} phút`;
            return `${seconds} giây`;
        }
    }, []);  

    useEffect(()=> {
        const loadProgressAndLesson = async () => {
            if (!enrollments.length) return;
            const progressResults: Record<string, LessonProgress[]> = {};
            const totalLessonResults: Record<string, number> = {};

            for (const enrolled_course of enrollments) {
                try {
                    const progressResponse = await fetchProgress(enrolled_course.id).unwrap();
                    progressResults[enrolled_course.id] = progressResponse.lessonProgress;

                    const modulesResponse = await fetchModules(enrolled_course.course_id).unwrap();
                    totalLessonResults[enrolled_course.id] = 0;
                    for (const module of modulesResponse.modules) {
                        const lessonsResponse = await fetchModuleLessons(module.id).unwrap();
                        totalLessonResults[enrolled_course.id] += lessonsResponse.lesson.length;
                    }
                }
                catch (error) {
                    console.error(`Error loading progress for course`, error);
                }
            }
            setProgressMap(progressResults);
            setTotalLessonMap(totalLessonResults);
        }
        loadProgressAndLesson();
    }, [enrollments, fetchProgress, fetchModules, fetchModuleLessons]);

    if (enrollmentsLoading) {
        return (
            <section className="w-full min-h-[200px] py-16 flex flex-col items-center">
                <div className="w-[var(--global-width)] flex items-center justify-center">
                    <div className="animate-pulse text-[var(--color-primary)]">Đang tải...</div>
                </div>
            </section>
        );
    }

    

    return (
        <section className="w-full py-16 flex flex-col items-center">
            <div className="flex flex-col w-[var(--global-width)] gap-6">
                {!enrollments || enrollments.length === 0 ? (
                    <h1 className="text-[2.5rem] font-bold text-[var(--color-primary)]">
                        Bạn chưa đăng ký môn nào cả, hãy khám phá ngay!
                    </h1>
                ) : (
                    <>
                        <h1 className="text-[2.5rem] font-bold text-[var(--color-primary)]">
                            Tiếp tục môn học
                        </h1>

                        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {enrollments.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center justify-between w-full p-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md hover:border-[#1363DF]/30 transition-all duration-200"
                                >
                                    <div className="mr-4">
                                        {getCompletionPercent(course.id) === 100 ? (
                                            <div className="w-8 h-8 rounded-full bg-[#1363DF] flex items-center justify-center">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full border-2 border-[#E5E7EB]"></div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1 min-w-0 pr-8">
                                        <p className="text-lg font-semibold text-[var(--color-primary)] truncate">
                                            {course.course_code} - {course.course_name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Hoàn thành {getCompletionPercent(course.id)}% · Dự kiến hoàn thành: {course.duration}
                                        </p>

                                        <Progress
                                            percent={getCompletionPercent(course.id)}
                                            showInfo={false}
                                            strokeColor="#1363DF"
                                            trailColor="#E5E7EB"
                                            className="max-w-[400px]"
                                        />
                                    </div>

                                    {/* Right side - Lesson info & actions */}
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="text-right">
                                            <p className="text-base font-semibold text-[var(--color-primary)]">
                                                {getChosenLesson(course.id)?.lesson_name || '-'}
                                            </p>
                                            <div className="flex items-center justify-end gap-2 mt-1">
                                                {/* <Image src={VideoIcon} alt="Video Icon" width={16} height={16} /> */}
                                                <p className="text-xs text-gray-500">
                                                    {getChosenLesson(course.id)?.estimated_completion_time || '-'} &#9679; {typeTranslate[getChosenLesson(course.id)?.type || '']?.label || '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="primary"
                                            onClick={() => router.push(`/student/courses/${course.course_id}/content`)}
                                            className="!w-32 !h-11 !rounded-full !bg-[#1363DF] hover:!bg-[#0d4eb8] !border-none !font-medium !shadow-sm"
                                        >
                                            Tiếp tục
                                        </Button>

                                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                            <Image src={MoreIcon} alt="More Icon" width={20} height={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </>
                )}
            </div>
        </section>
    );
};

export { LearningProgressSection };
