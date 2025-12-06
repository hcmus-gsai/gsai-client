'use client';
import {useState, useEffect} from 'react';

import { RedirectButton } from "@/components/shared/redirect-button";
import { CourseGrid } from "@/components/shared/course-grid";

import {Button, Progress} from "antd";
import {useRouter} from "next/navigation";

//===
import {useGetAllEnrollmentsQuery} from "@/store/api/[module]/enrollmentApi";
import { EnrolledCourse } from '@/type/enrollment.type';
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

    const router = useRouter();
    // const courseSampleData = [
    //     {
    //         id: 1,
    //         image : '/images/course-1.jpg',
    //         name: 'Toán ứng dụng & thống kê',
    //         teacher: ['Vũ Quốc Hoàng', 'Nguyễn Văn Quang Huy', 'Nguyễn Ngọc Toàn', 'Phan Thị Phương Uyên'],
    //         estimated_time : '1 tháng',
    //         rating: 5.0,
    //         tags : ['toán học', 'thống kê', 'kinh tế']
    //     },
    //     {
    //         id: 2,
    //         image : '/images/course-2.jpg',
    //         name: 'Cấu trúc dữ liệu & giải thuật',
    //         teacher: ['Nguyễn Thanh Phương', 'Nguyễn Thị Ngọc Thảo'],
    //         estimated_time : '1 tháng',
    //         rating: 5.0,
    //         tags : ['toán học', 'cấu trúc dữ liệu', 'giải thuật']
    //     },
        
    //     {
    //         id: 3,
    //         image : '/images/course-3.jpg',
    //         name: 'Nhập môn công nghệ phần mềm',
    //         teacher: ['Hồ Tuấn Thanh','Mai Anh Tuấn', 'Nguyễn Thị Minh Tuyền'],
    //         estimated_time : '1 tháng',
    //         rating: 5.0,
    //         tags : ['công nghệ phần mềm', 'lập trình', 'thiết kế']
    //     },

    //     {
    //         id: 4,
    //         name: 'hệ thống thông tin',
    //         teacher: ['Nguyễn Văn A'],
    //         estimated_time : '1 tháng',
    //         rating: 5.0,
    //         tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
    //     },
    // ];


    const {data: enrollmentsCourse, isLoading, error} = useGetAllEnrollmentsQuery();
    
    // const progressCourses = enrollmentsCourse?.data?.filter(
    //     (enrollment: EnrolledCourse) => enrollment.completion_status === "in-progress"
    // ) ?? [];
    const data = enrollmentsCourse?.data ?? [];
    console.log(data);


    const [isExpanded, setIsExpanded] = useState(false);
    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    }
    return (
        <section className = "w-full min-h-[70vh] flex flex-col items-center mt-[2.5rem]">
            <div className = "flex flex-col items-center justify-center w-[calc(100%-12rem)] gap-[1.5rem]">
                <h1 className = "text-[2.5rem] font-bold w-full text-[var(--color-primary)]">{title}</h1>
                <div className = "flex items-center justify-center w-full">
                    <CourseGrid 
                        courseData = {data} 
                        colWidth = {6} 
                        maxItems = {isExpanded ? 12 : 4} 
                    />
                </div>
            </div>
            <div className = "flex items-center justify-center w-[calc(100%-12rem)] py-[2rem]">
                
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