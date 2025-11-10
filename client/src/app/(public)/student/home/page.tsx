'use client';

import { useState } from "react";
import Image from "next/image";
import { GreetingSection, FooterSection } from "@/components/guest/ui/guest";
import Link from "next/link";
import GradientTopLeft from "@/../public/guest/gradient_top_left.svg";
import GradientTopRight from "@/../public/guest/gradient_top_right.svg";
import GradientBottomLeft from "@/../public/guest/gradient_bottom_left.svg";
import GradientBottomRight from "@/../public/guest/gradient_bottom_right.svg";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import Epis from "@/../public/shared/EPIS.svg";
import SearchIcon from "@/../public/shared/SearchIcon.svg";
import UserIcon from "@/../public/shared/User.svg";
import NotificationIcon from "@/../public/shared/Notification.svg";
import CurveSpace from "@/../public/student/CurveSpace.svg";
import AbstractTop from "@/../public/student/AbstractTop.svg";
import AbstractMiddle from "@/../public/student/AsbtractMiddle.svg";

import { Button, Card, Menu, Input} from "antd";

const StudentGreetinSection = () => {

    const learningCategory = [
        {
            id: 1,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 2,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 3,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 4,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 5,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 6,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 7,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 8,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
    ]

    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">

            <nav
                className = "fixed top-0 left-0 right-0 w-full h-[5rem] flex items-center justify-center border-b border-gray-200 bg-white z-20"
            >
                <div className = "w-[calc(100%-24rem)] flex items-center justify-between">
                    <div className = "flex items-center justify-start w-full h-[3.5rem]">
                        <div className = "flex items-center justify-start w-[26rem] h-full">
                            <div className = "flex items-center justify-start w-[121px]">
                                <div className = "h-[full] w-[121px]">
                                    <Image src = {Epis} alt = "Epis" width = {0} height = {0}
                                        className = "object-cover"
                                    />
                                </div>
                            </div>
                            <Menu 
                                mode = "horizontal"
                                defaultSelectedKeys={["homepage"]}
                                items = {[
                                    { key: "homepage", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                                        <span className = "cursor-pointer text-[var(--color-primary)] font-bold">Trang chủ</span>
                                    </div> },   
                                    { key: "courses", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                                        <span className = "cursor-pointer text-[var(--color-primary)] font-bold">Môn học</span>
                                    </div> },
                                    { key: "about", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                                        <span className = "cursor-pointer text-[var(--color-primary)] font-bold">Về Epis</span>
                                    </div> }
                                ]}
                                className = "!w-full !flex !items-center !justify-start !border-none"
                                style = {{
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </div>
                        <div className = "flex items-center justify-center w-[22.75rem] h-full">
                            <div className = "flex items-center justify-start w-[18.75rem] h-full">
                                <Input
                                    placeholder = "Tìm kiếm môn học ở đây..."
                                    className = "!h-full !w-full !bg-white !rounded-full !font-bold !text-[1rem]"
                                />
                            </div>
                            <div className = "flex items-center justify-center w-[calc(100%-18.75rem)] h-full">
                                <Button
                                    className = "!h-[3.5rem] !w-[3.5rem] !bg-[var(--color-secondary)] !rounded-full !border-none !flex !items-center !justify-center"
                                >
                                    <Image src = {SearchIcon} alt = "Search Icon" width = {0} height = {0}
                                        className = "object-cover !w-[1.5rem] !h-[1.5rem]"
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className = "flex items-center justify-end w-full h-[3.5rem]">
                        <div className = "flex items-center justify-center w-[3.5rem] h-full">
                            <Image src = {UserIcon} alt = "User Icon" width = {0} height = {0}
                                className = "object-cover !w-[1.5rem] !h-[1.5rem]"
                            />
                        </div>
                        <div className = "flex items-center justify-center w-[3.5rem] h-full">
                            <Image src = {NotificationIcon} alt = "Notification Icon" width = {0} height = {0}
                                className = "object-cover !w-[1.5rem] !h-[1.5rem]"
                            />
                        </div>
                    </div>
                </div>
            </nav>
            <Image 
                src = {AbstractTop} alt = "Curve Space" width = {0} height = {0}
                className = "absolute top-0 left-0 w-full h-auto z-0"
            />

            <Image 
                src = {AbstractMiddle} alt = "Curve Space" width = {0} height = {0}
                className = "absolute top-0 left-0 w-full h-auto z-0"
            />


            <div className = "w-full h-[100vh] flex flex-col items-center justify-center z-10">
                <div className = "w-[calc(100%-24rem)] h-[242px] flex items-center justify-between">
                    <div className = "h-full w-[546px] flex flex-col items-start justify-between">
                        <div className = "flex flex-col items-start justify-between w-full">                    
                            <p className = "text-[3.5rem] font-bold text-[var(--color-primary)]">Công việc hôm nay</p>
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Hãy kiểm tra thời gian biểu của bạn để hoàn thành công việc đúng hạn nhé!</p>
                        </div>
                        <div>
                            <Button className = "!bg-black !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]">Thời gian biểu</Button>
                        </div>
                    </div>
                </div>
                <div className = "w-[calc(100%-24rem)] h-[242px] flex flex-col items-center justify-between">
                    
                    <div className = "h-full w-full flex flex-col items-center justify-between z-10">
                        <p className = "text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
                    </div>
                    <div className = "flex items-center justify-center w-full h-full z-10">
                        <div className = "grid grid-rows-2 grid-cols-4 gap-2 w-full">
                            {learningCategory.map((item) => (
                                <div key = {item.id} className = "flex items-center justify-center w-full h-[100px]">
                                    <Button className = "!w-[16.875rem] !h-[3.5rem] !rounded-full !flex !items-center !justify-center">
                                        <Image src = {item.image} alt = {item.name} width = {0} height = {0} className = "object-cover"/>
                                        <p className = "text-[1rem] font-bold text-[var(--color-primary)]">{item.name}</p>
                                    </Button>
                                    
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div>
            </div>
            <Image src = {CurveSpace} alt = "Curve Space" width = {0} height = {0} 
                className = "absolute bottom-0 left-0 w-full h-auto z-0"
            />


        </section>
    )
}



const CourseDisplaySection = ({
    title,
    queryType = "",
}:{
    title:string;
    queryType?:string;
}) => {

    const courseSampleData = [
        {
            id: 1,
            image : '/images/course-1.jpg',
            name: 'Nhập môn cấu trúc dữ liệu và giải thuật',
            teacher: 'Nguyễn Văn A',
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },
        {
            id: 2,
            name: 'hệ thống thông tin',
            teacher: 'Nguyễn Văn A',
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },
        
        {
            id: 3,
            name: 'hệ thống thông tin',
            teacher: 'Nguyễn Văn A',
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },

        {
            id: 4,
            name: 'hệ thống thông tin',
            teacher: 'Nguyễn Văn A',
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },
        {
            id: 5,
            name: 'hệ thống thông tin',
            teacher: 'Nguyễn Văn A',
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },
        
        {
            id: 6,
            name: 'hệ thống thông tin',
            teacher: 'Nguyễn Văn A',
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },
        {
            id: 7,
            name: 'hệ thống thông tin',
            teacher: 'Nguyễn Văn A',
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },
        {
            id: 8,
            name: 'hệ thống thông tin',
            teacher: 'Nguyễn Văn A',
            estimated_time : '1 tháng',
            rating: 5.0,
            tags : ['hệ thống thông tin', 'hệ thống thông tin', 'hệ thống thông tin']
        },
    ];
    return (
        <section className = "w-full h-[41.375rem] flex flex-col items-center justify-center bg-green-200">
            <div className = "flex flex-col items-center justify-center w-[calc(100%-24rem)]">
                <h1 className = "text-[2.5rem] font-bold w-full text-[var(--color-primary)]">{title}</h1>
                <div className = "flex items-center justify-center w-full h-[18.9375rem] bg-red-200">
                    <p className = "text-[4.25rem] font-light text-gray-600 text-center">Đây là container chứa môn học</p>
                </div>
            </div>
            <div className = "flex items-center justify-center bg-green-400 w-[calc(100%-24rem)] py-[2rem]">
                <Button
                    type = "primary"
                    className = "!bg-black !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]"
                >
                    Xem tất cả
                </Button>
            </div>
        </section>
    )
}

const LearningPathSection = () => {

    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center bg-red-200">
            <div className = "flex items-center justify-between w-[calc(100%-24rem)] gap-[1.25rem]">
                <div
                    className = "w-[34.5625rem] h-[22.875rem] bg-green-200 rounded-[20px] flex items-center justify-center px-[1.875rem] py-[2.5rem]"
                >
                    <div className = "flex flex-col items-center justify-start h-full w-full">
                        <div className = "flex flex-col items-center justify-start h-full w-full">
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] w-full">Học cùng với</p>
                            <p className = "text-[1.5rem] font-bold text-[var(--color-secondary)] w-full">CHUYÊN GIA</p>
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] w-full">Nếu bạn đã xác định rõ môn mình muốn học</p>
                        </div>
                        <div>
                            <Button>Xem tất cả</Button>
                        </div>
                    </div>
                    <div className = "flex flex-col items-center justify-start w-full h-full">
                        <Image src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0}
                            className = "w-full h-full object-cover rounded-[20px]"
                        />
                    </div>
                </div>

                <div
                    className = "w-[34.5625rem] h-[22.875rem] bg-green-200 rounded-[20px] flex items-center justify-center px-[1.875rem] py-[2.5rem]"
                >
                    <div className = "flex flex-col items-center justify-start h-full w-full">
                        <div className = "flex flex-col items-center justify-start h-full w-full">
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] w-full">Khám phá kĩ năng</p>
                            <p className = "text-[1.5rem] font-bold text-[var(--color-secondary)] w-full">DÀNH CHO NHÓM</p>
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] w-full">Nếu bạn đã xác định rõ môn mình muốn học</p>
                        </div>
                        <div>
                            <Button>Xem tất cả</Button>
                        </div>
                    </div>
                    <div className = "flex flex-col items-center justify-start w-full h-full">
                        <Image src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0}
                            className = "w-full h-full object-cover rounded-[20px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}




export default function StudentHomePage() {

    return(
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            {/* <CourseDisplaySection title = "Môn học đã xem gần đây" />
            <CourseDisplaySection title = "Môn học phổ biến hiện nay" />
            <CourseDisplaySection title = "Môn học dành riêng cho bạn" />
            <CourseDisplaySection title = "Trải nghiệm các khóa học miễn phí"/>
            <FooterSection/> */}
            <StudentGreetinSection/>
        </main>
    )
}
 