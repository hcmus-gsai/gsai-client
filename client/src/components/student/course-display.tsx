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

    const {data: enrollmentsDataResponse} = useGetAllEnrollmentsQuery();
    const courseData = enrollmentsDataResponse?.data || [];
    const [coursesInfo, setCoursesInfo] = useState<Course[]>([]);
    
    const [getCourseById] = useLazyGetCourseByIdQuery();

    useEffect(() => {
        const fetchCoursesInfo = async () => {
            if (courseData.length === 0) return;
            
            const coursePromises = courseData.map((course) => 
                getCourseById(course.id).unwrap()
            );
            
            try {
                const results = await Promise.all(coursePromises);
                const courses = results.map((res) => res.data);
                
                setCoursesInfo(courses);
            } catch (error) {
                console.error('Error fetching courses info:', error);
            }
        };

        fetchCoursesInfo();
    }, [courseData, getCourseById]);


    const [isExpanded, setIsExpanded] = useState(false);
    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    }
    return (
        <section className = "w-full min-h-[70vh] flex flex-col items-center mt-[2.5rem]">
            <div className = "flex flex-col items-center justify-center w-[var(--global-width)] gap-[1.5rem]">
                <h1 className = "text-[2.5rem] font-bold w-full text-[var(--color-primary)]">{title}</h1>
                <div className = "flex items-center justify-center w-full">
                    <CourseGrid 
                        courseData = {coursesInfo} 
                        colWidth = {6} 
                        maxItems = {isExpanded ? 12 : 4} 
                    />
                </div>
            </div>
            <div className = "flex items-center justify-center w-[var(--global-width)] py-[2rem]">
                
                <RedirectButton 
                    onClick = {handleExpand}
                    text = {isExpanded ? "Thu gọn" : "Xem tất cả"} 
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