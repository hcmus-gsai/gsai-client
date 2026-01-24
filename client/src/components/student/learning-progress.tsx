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
            <section className="w-full py-16 flex justify-center">
                <div className="animate-pulse text-[var(--color-primary)]">
                    Đang tải tiến độ học tập...
                </div>
            </section>
        );
    }

    return (
        <section className="w-full py-16 flex justify-center">
            <div className="w-[var(--global-width)] flex flex-col gap-6">
                {!enrollments.length ? (
                    <h1 className="text-[2.5rem] font-bold text-[var(--color-primary)]">
                        Bạn chưa đăng ký môn nào cả, hãy khám phá ngay!
                    </h1>
                ) : !inProgressEnrollments.length ? (
                    <h1 className="text-[2.5rem] font-bold text-[var(--color-primary)]">
                        Bạn đã hoàn thành tất cả các môn học đã đăng ký!
                    </h1>
                ) : (
                    <>
                        <h1 className="text-[2.5rem] font-bold text-[var(--color-primary)]">
                            Tiếp tục môn học
                        </h1>

                        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                            {inProgressEnrollments.map(course => {
                                const percent = getCompletionPercent(course.id);
                                const lesson = getChosenLesson(course.id);

                                return (
                                    <div
                                        key={course.id}
                                        className="flex justify-between items-center p-6 border rounded-2xl bg-white"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg">
                                                {course.course_code} - {course.course_name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Hoàn thành {percent}% · {course.duration}
                                            </p>

                                            <Progress
                                                percent={percent}
                                                showInfo={false}
                                                strokeColor="#1363DF"
                                            />
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {lesson?.lesson_name ?? "-"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {lesson?.estimated_completion_time ?? "-"} ·{" "}
                                                    {typeTranslate[lesson?.type ?? ""] ?? "-"}
                                                </p>
                                            </div>

                                            <Button
                                                type="primary"
                                                onClick={() =>
                                                    router.push(
                                                        `/student/courses/${course.course_id}/content`
                                                    )
                                                }
                                            >
                                                Tiếp tục
                                            </Button>

                                            <button className="p-2">
                                                <Image src={MoreIcon} alt="more" width={20} />
                                            </button>
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
