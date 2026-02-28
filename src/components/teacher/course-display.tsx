'use client';

import { RedirectButton } from "@/components/shared/redirect-button";
import { CourseGrid } from "@/components/shared/course-grid";
import { useGetCoursesByTeacherQuery } from "@/store/api/[module]/courseApi";
import { useGetUserProfileQuery } from "@/store/api/[module]/userApi";
import React from "react";

const CourseDisplaySection = ({
    title,
}: {
    title: string;
}) => {

    const { data: courses } = useGetCoursesByTeacherQuery({
        limit: 4,
        sortBy: 'created_at',
        sortOrder: 'ASC'
    })

    const { data: profile } = useGetUserProfileQuery();

    const coursesWithTeacherName = React.useMemo(() => {
        if (!courses?.data) return [];

        return courses.data.map(course => ({
            ...course,
            teacher_name: profile?.full_name || '',
        }));
    }, [courses?.data, profile?.full_name]);

    return (
        <section className="w-full min-h-[70vh] flex flex-col items-center mt-[2.5rem]">
            <div className="flex flex-col items-center justify-center w-[var(--global-width)] gap-[1.5rem] px-4">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold w-full text-[var(--color-primary)] text-center md:text-left">{title}</h1>
                <div className="flex items-center justify-center w-full">
                    <CourseGrid
                        courseData={coursesWithTeacherName}
                        colWidth={6}
                        maxItems={4}
                    />
                </div>
            </div>
            {courses?.data.length && courses.data.length > 4 ?
                (<div className="flex items-center justify-center w-[var(--global-width)] py-[2rem]">
                    <RedirectButton
                        title={title}
                        text="Xem tất cả"
                        buttonBg="white"
                        buttonText="var(--color-secondary)"
                        buttonBorder="#1363DF"
                        iconBg="var(--color-secondary)"
                        iconText="var(--color-bg_white)"
                    />
                </div>) : null}
        </section>
    )
}

export { CourseDisplaySection };