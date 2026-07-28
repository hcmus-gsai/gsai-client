'use client';
import '@ant-design/v5-patch-for-react-19';

import { useParams, redirect } from "next/navigation";
import { FooterSection } from "@/components/guest/ui/guest";
import { Button, Card, Progress } from "antd";
import { useState, useEffect } from 'react';

import { useGetCourseByIdQuery } from "@/store/api/[module]/courseApi";
import { useLazyGetModuleLessonsQuery } from "@/store/api/[module]/moduleApi";
// import { useGetLearningProgressByCourseQuery } from "@/store/api/[module]/lessonProgressApi";
import { useLazyGetCourseModulesQuery } from "@/store/api/[module]/courseApi";

import { useAppDispatch } from "@/store/hook";
import {
    setLessonProgressData,
    setModuleStats,
    setTotalLessons
} from "@/store/slice/lessonProgressSlice";

import LectureSection from '../components/lectureSection';

const CourseModules = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();

    const { data: courseRes } = useGetCourseByIdQuery(id as string, {
        skip: !id,
    });
    const course = courseRes?.data;

    // const { data: progressData } = useGetLearningProgressByCourseQuery(id as string, {
    //     skip: !id,
    // });

    const [fetchCourseModules] = useLazyGetCourseModulesQuery();
    const [fetchModuleLessons] = useLazyGetModuleLessonsQuery();

    const baseBtn = "!w-[7rem] !h-[2.25rem] !rounded-full !border-white";
    const activeBtn = "!text-[var(--color-secondary)] !bg-[var(--color-neutral)]";

    return (
        <section className="w-full md:flex-1 flex flex-col items-center justify-start">
            <div className="w-full mb-[1.5rem]">
                <p className="text-3xl md:text-6xl font-semibold mb-4 text-[var(--color-primary)]">
                    {course?.course_name}
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                    <Button
                        className={`${baseBtn} ${activeBtn}`}
                        style={{ cursor: 'default' }}
                    >
                        Bài giảng
                    </Button>
                </div>
            </div>

            <LectureSection />
        </section>
    );
}

export default function TeacherCourseDetailPage() {
    const { id } = useParams();

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-hidden bg-white">
            <div className="w-full h-[3rem] mt-[5rem]">
                <div className="w-[var(--global-width)] h-full flex items-center justify-end">
                    <Button
                        type="primary"
                        onClick={() => redirect(`/teacher/create-class?courseId=${id}`)}
                        className="!text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                    >
                        Chỉnh sửa môn học
                    </Button>
                </div>
            </div>

            <div className="w-full px-4 md:px-0 md:w-[var(--global-width)] mx-auto h-full flex flex-col-reverse md:flex-row items-start justify-center mt-[2rem] md:mt-[2rem] gap-[2rem]">
                <CourseModules />
            </div>
            {/* <FooterSection hasRegisterBox={false} /> */}
        </main>
    )
}