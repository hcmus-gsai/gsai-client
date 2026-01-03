'use client';
import {useState, useEffect} from 'react';

import { RedirectButton } from "@/components/shared/redirect-button";
import { CourseGrid } from "@/components/shared/course-grid";

import {Button, Progress} from "antd";
import {useRouter} from "next/navigation";

//===
import {useGetAllEnrollmentsQuery} from "@/store/api/[module]/enrollmentApi";
import {Course} from "@/type/course.type";
import {useLazyGetCourseByIdQuery} from "@/store/api/[module]/courseApi";
// import { setTitle } from '@/store/slice/courseDisplaySlice';
// import { useAppDispatch } from '@/store/hook';
import {useSearchCoursesQuery, useLazySearchCoursesQuery} from "@/store/api/[module]/courseApi";
//===
const CourseDisplaySection = ({
    title,
    queryType = "",
    hasExtended = false,
}:{
    title:string;
    queryType?:string;
    hasExtended?:boolean;
}) => {
    
    const {data: searchCoursesData} = useSearchCoursesQuery({
        limit: 4,
        sortBy: 'created_at',
        sortOrder: 'ASC'
    })

    

    const [coursesInfo, setCoursesInfo] = useState<Course[]>([]);
    useEffect(()=> {
        if (searchCoursesData) {
            console.log('This is searchCoursesData: ', searchCoursesData);
            if (title.toLowerCase().includes("miễn phí")) {
                setCoursesInfo(searchCoursesData.data.filter((course) => Number(course.tuition_fee) === 0));
            } else {
                setCoursesInfo(searchCoursesData.data);
            }
        }
    }, [searchCoursesData]);

    return (
        <section className = "w-full min-h-[70vh] flex flex-col items-center mt-[2.5rem]">
            <div className = "flex flex-col items-center justify-center w-[var(--global-width)] gap-[1.5rem]">
                <h1 className = "text-[2.5rem] font-bold w-full text-[var(--color-primary)]">{title}</h1>
                <div className = "flex items-center justify-center w-full">
                    <CourseGrid 
                        courseData = {coursesInfo} 
                        colWidth = {6} 
                        maxItems = {4} 
                    />
                </div>
            </div>
            <div className = "flex items-center justify-center w-[var(--global-width)] py-[2rem]">
                
                <RedirectButton
                    title = {title}
                    text = "Xem tất cả"
                    buttonBg = "white" 
                    buttonText = "var(--color-secondary)"
                    buttonBorder = "#1363DF"
                    iconBg = "var(--color-secondary)"
                    iconText = "var(--color-bg_white)"
                />
            </div>
        </section>
    )
}

export {CourseDisplaySection};