"use client";

import { useRouter } from "next/navigation";
import { Button, Progress } from "antd";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import MoreIcon from "@/../public/student/MoreIcon.svg";

import { useGetAllEnrollmentsQuery } from "@/store/api/[module]/enrollmentApi";
import { useLazyGetLearningProgressByEnrollmentQuery } from "@/store/api/[module]/lessonProgressApi";
import { useLazyGetCourseModulesQuery } from "@/store/api/[module]/courseApi";
import { useLazyGetModuleLessonsQuery } from "@/store/api/[module]/moduleApi";

import { EnrolledCourse } from "@/type/enrollment.type";
import { LessonProgress } from "@/type/lessonProgress.type";

const LearningProgressSection = () => {
    const router = useRouter();

    const { data: enrollmentsData, isLoading: enrollmentsLoading } =
        useGetAllEnrollmentsQuery();

    const enrollments = useMemo(
        () => enrollmentsData?.data ?? [],
        [enrollmentsData?.data]
    );

    const [fetchProgress] = useLazyGetLearningProgressByEnrollmentQuery();
    const [fetchModules] = useLazyGetCourseModulesQuery();
    const [fetchModuleLessons] = useLazyGetModuleLessonsQuery();

    const [progressMap, setProgressMap] = useState<Record<string, LessonProgress[]>>({});
    const [totalLessonMap, setTotalLessonMap] = useState<Record<string, number>>({});
    const [inProgressEnrollments, setInProgressEnrollments] = useState<EnrolledCourse[]>([]);
    const [calculating, setCalculating] = useState(true);

    const typeTranslate: Record<string, string> = {
        video: "Video",
        document: "Tài liệu",
        quiz: "Quiz",
        project: "Bài tập lớn",
    };

    const getCompletionPercent = useMemo(
        () => (id: string) => {
            const progress = progressMap[id];
            const total = totalLessonMap[id];
            if (!progress || !total) return 0;
            const done = progress.filter(p => p.is_completed).length;
            return Math.round((done / total) * 100);
        },
        [progressMap, totalLessonMap]
    );

    const getChosenLesson = useMemo(
        () => (id: string) => {
            const progress = progressMap[id];
            if (!progress?.length) return null;

            return (
                progress
                    .filter(p => !p.is_completed)
                    .sort(
                        (a, b) =>
                            (a.lesson?.order_index ?? 0) -
                            (b.lesson?.order_index ?? 0)
                    )[0]?.lesson || null
            );
        },
        [progressMap]
    );

    useEffect(() => {
        if (!enrollments.length) {
            setCalculating(false);
            return;
        }

        const run = async () => {
            setCalculating(true);

            const progressResult: Record<string, LessonProgress[]> = {};
            const totalLessonResult: Record<string, number> = {};
            const inProgress: EnrolledCourse[] = [];

            for (const enroll of enrollments) {
                const progressRes = await fetchProgress(enroll.id).unwrap();
                progressResult[enroll.id] = progressRes.lessonProgress;

                const modulesRes = await fetchModules(enroll.course_id).unwrap();
                let totalLesson = 0;

                for (const m of modulesRes.modules) {
                    const lessonRes = await fetchModuleLessons(m.id).unwrap();
                    totalLesson += lessonRes.lesson.length;
                }

                totalLessonResult[enroll.id] = totalLesson;

                const done = progressRes.lessonProgress.filter(p => p.is_completed).length;
                if (totalLesson === 0 || done < totalLesson) {
                    inProgress.push(enroll);
                }
            }

            setProgressMap(progressResult);
            setTotalLessonMap(totalLessonResult);
            setInProgressEnrollments(inProgress);
            setCalculating(false);
        };

        run();
    }, [enrollments]);

    if (enrollmentsLoading || calculating) {
        return (
            <section className="w-full py-10 sm:py-16 flex justify-center px-4">
                <div className="animate-pulse text-[var(--color-primary)]">
                    Đang tải tiến độ học tập...
                </div>
            </section>
        );
    }

    return (
        <section className="w-full py-10 sm:py-16 flex justify-center">
            <div className="w-full max-w-[var(--global-width)] px-4 sm:px-8 xl:px-0 flex flex-col gap-6">
                {!enrollments.length ? (
                    <h1 className="text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] font-bold text-[var(--color-primary)]">
                        Bạn chưa đăng ký môn nào cả, hãy khám phá ngay!
                    </h1>
                ) : !inProgressEnrollments.length ? (
                    <h1 className="text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] font-bold text-[var(--color-primary)]">
                        Bạn đã hoàn thành tất cả các môn học đã đăng ký!
                    </h1>
                ) : (
                    <>
                        <h1 className="text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] font-bold text-[var(--color-primary)]">
                            Tiếp tục môn học
                        </h1>

                        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-1 sm:pr-2 pb-6">
                            {inProgressEnrollments.map(course => {
                                const percent = getCompletionPercent(course.id);
                                const lesson = getChosenLesson(course.id);

                                return (
                                    <div
                                        key={course.id}
                                        className="
                                            flex flex-col md:flex-row 
                                            justify-between 
                                            items-start md:items-center 
                                            gap-4 md:gap-6 
                                            p-4 sm:p-5 
                                            border-2 border-[#E7F1F7] rounded-2xl bg-white
                                            shadow-sm
                                            hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                                            transition-all duration-300 ease-out
                                            cursor-pointer
                                        "
                                    >
                                        <div className="w-full flex-1 flex flex-col gap-1.5 md:mr-4">
                                            <p className="font-semibold text-base sm:text-lg line-clamp-2 md:line-clamp-1">
                                                {course.course_code} - {course.course_name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Hoàn thành {percent}% · Dự kiến hoàn thành trong {course.duration}
                                            </p>

                                            <Progress
                                                percent={percent}
                                                showInfo={false}
                                                strokeColor="#1363DF"
                                                className="!m-0"
                                            />
                                        </div>

                                        <div className="w-[30%]">
                                        </div>

                                        <div className="
                                            flex flex-col sm:flex-row 
                                            items-start sm:items-center 
                                            w-full
                                            md:w-[300px] 
                                            md:justify-between
                                            gap-4 sm:gap-6 
                                            shrink-0
                                        ">
                                            <div className="text-left md:text-right w-full sm:w-auto">
                                                <p className="font-semibold text-sm sm:text-base line-clamp-1">
                                                    {lesson?.lesson_name ?? "-"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {lesson?.estimated_completion_time ?? "-"} ·{" "}
                                                    {typeTranslate[lesson?.type ?? ""] ?? "-"}
                                                </p>
                                            </div>

                                            <Button
                                                type="primary"
                                                className="
                                                    w-full sm:w-auto !shrink-0 !h-[2.75rem] sm:!h-12 !px-8 
                                                    !border !border-secondary !rounded-full !bg-[var(--color-secondary)] !text-white 
                                                    hover:!bg-white hover:!text-[var(--color-secondary)]
                                                    transition-all duration-300 ease-in-out
                                                "
                                                onClick={() =>
                                                    router.push(
                                                        `/student/courses/${course.course_id}/content`
                                                    )
                                                }
                                            >
                                                Tiếp tục
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export { LearningProgressSection };
