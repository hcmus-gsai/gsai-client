'use client';
import {useState, useEffect} from 'react';

import { RedirectButton } from "@/components/shared/redirect-button";
import { CourseGrid } from "@/components/shared/course-grid";

import {Button, Progress} from "antd";
import {useRouter} from "next/navigation";

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
    const courseSampleData = [
        {
            id: 1,
            image : '/images/course-1.jpg',
            name: 'Toán ứng dụng & thống kê',
            teacher: ['Vũ Quốc Hoàng', 'Nguyễn Văn Quang Huy', 'Nguyễn Ngọc Toàn', 'Phan Thị Phương Uyên'],
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['toán học', 'thống kê', 'kinh tế']
        },
        {
            id: 2,
            image : '/images/course-2.jpg',
            name: 'Cấu trúc dữ liệu & giải thuật',
            teacher: ['Nguyễn Thanh Phương', 'Nguyễn Thị Ngọc Thảo'],
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['toán học', 'cấu trúc dữ liệu', 'giải thuật']
        },
        
        {
            id: 3,
            image : '/images/course-3.jpg',
            name: 'Nhập môn công nghệ phần mềm',
            teacher: ['Hồ Tuấn Thanh','Mai Anh Tuấn', 'Nguyễn Thị Minh Tuyền'],
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['công nghệ phần mềm', 'lập trình', 'thiết kế']
        },

        {
            id: 4,
            name: 'hệ thống thông tin',
            teacher: ['Nguyễn Văn A'],
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },
    ];
    const [isExpanded, setIsExpanded] = useState(false);
    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    }
    return (
        <section className = "w-full min-h-[70vh] flex flex-col items-center mt-[2.5rem]">
            {
                hasExtended && (
                    <div className = "flex flex-col items-center justify-center w-[calc(100%-12rem)] gap-[1.5rem] mb-[2rem]">
                        <h1 className = "text-[2.5rem] font-bold w-full text-[var(--color-primary)]">Tiếp tục môn học</h1>
                        <div className = "flex items-center justify-center w-full h-[114px] rounded-[20px] border-[1px] border-solid border-[#DCDCDC]">
                            <div className = "flex flex-col items-start justify-center w-full h-full mr-auto pl-[1.5rem]">
                                <p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">
                                    Tên môn học
                                </p>
                                
                                <p className = "text-[1rem] font-light text-[var(--color-primary)]">
                                    Hoàn thành 75% · Dự kiến hoàn thành: 05/11/2025
                                </p>

                                {/* <div className="bg-gray-200 w-full h-[10px] rounded-full overflow-hidden">
                                    <div
                                        className="bg-[var(--color-secondary)] h-full rounded-full"
                                        style={{ width: `${75}%` }}
                                    ></div>
                                </div> */}
                                <Progress percent={75} showInfo = {false}/>

                            </div>
                            <div className = "flex items-center justify-end relative w-full h-full ml-auto pr-[1.5rem] gap-[1.5rem]">
                                <div>
                                    <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Tên bài giảng</p>
                                    <p className = "text-[1rem] font-light text-[var(--color-primary)]">Video 2 phút</p>
                                </div>
                                <div>
                                    <Button
                                        type="primary"
                                        onClick = {() => router.push(`/student/home/course/${courseSampleData[0].name.toLowerCase().replace(/ /g, '-')}/chapter-1/video-1  `)}
                                        className = {`!border-1 !border-solid !w-[9rem] !h-[3rem] !rounded-full !flex !items-center !justify-center !bg-[#1363DF]`} 
                                    >
                                        <div className = "flex items-center justify-center relative w-[calc(100%-5rem)]">
                                            <span className = {`text-[1rem] !text-white`}>Tiếp tục</span>
                                        </div>
                                    </Button>
                                </div>
                                <div>
                                    Icon
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className = "flex flex-col items-center justify-center w-[calc(100%-12rem)] gap-[1.5rem]">
                <h1 className = "text-[2.5rem] font-bold w-full text-[var(--color-primary)]">{title}</h1>
                <div className = "flex items-center justify-center w-full">
                    <CourseGrid 
                        courseData = {courseSampleData} 
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