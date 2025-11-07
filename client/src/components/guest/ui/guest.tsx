'use client';

import Link from "next/link";

import {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {Button, Menu, Row, Col, Card} from "antd";
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";



import { ArrowRightOutlined, FacebookFilled, InstagramFilled, YoutubeFilled,MailOutlined, StarFilled } from "@ant-design/icons"


const GreetingSection = () => {
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-between h-[40px] px-24">
                <div className = "flex flex-1 items-center justify-start gap-2">
                    <div className = "text-2xl font-bold">
                        <p className = "text-[#366ED8]"><span className = "font-style nabla">AT</span> AI.Tutor</p>
                    </div>
                    <Menu 
                        mode = "horizontal"
                        defaultSelectedKeys={["home"]}
                        items = {[
                            { key: "intro", label: "Giới thiệu" },
                            { key: "courses", label: "Môn học" },
                            { key: "evaluate", label: "Đánh giá" },
                            { key: "contact", label: "Liên hệ" },

                        ]}
                        className = "border-none flex-1 ml-10"
                        style = {{
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>
                <div className = "flex flex-1 items-center justify-end gap-2">
                    <div className = "flex items-center justify-center gap-2">
                        <Button
                            type = "primary"
                            className = "!bg-transparent !text-white hover:!bg-blue-400 hover:!text-white !rounded-full !border-blue-400"
                        >
                            Tham gia ngay
                            <div className = "flex items-center justify-center bg-white rounded-full p-2">
                                <ArrowRightOutlined className = "!rotate-315 !text-black "/>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            <div className = "mx-auto w-full h-full flex flex-col items-center justify-center w-[calc(100vh-40px)]">
                <div className = "flex items-center justify-center gap-4">
                    <div className = "text-[4rem] font-bold leading-tight">
                        <p className = "text-center">Chào Mừng Đến Với GSAI</p>
                    </div>
                </div>
                <div className = "flex flex-col justify-center items-center">
                    <div className = "text-[1rem] font-light text-gray-600 text-center">
                        <p>Bạn đang gặp khó khăn trong quá trình học tập của mình?</p>
                        <p>Bạn cần một gia sư đồng hành cùng mình?</p>
                        <p>Đừng lo lắng.</p>
                    </div>
                    <div className = "flex items-center justify-center mt-4">
                        <Button 
                            type = "default"
                            className = "!bg-black !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]">
                                Khám phá ngay
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const StyledButton = (
    {
        name,
        buttonClassName,
        iconClassName,
    }:{
        name: string;
        buttonClassName?: string;
        iconClassName?: string;
    }
) =>{
    return (
        <Button className = {buttonClassName}>
            {name}
            <ArrowRightOutlined className = {iconClassName} />
        </Button>
    )
}

const CourseDisplaySection = () => {

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
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className = "flex flex-col items-center justify-center">
                <div className = "text-center">
                    <h1 className = "text-[3rem] font-bold">Môn học phổ biến hiện nay</h1>
                    <p className = "text-[1.25rem] font-light text-gray-600 text-center">Chọn môn học đúng hướng, nâng tầm hồ sơ tương lai!</p>
                </div>
            </div>
            <div className = "w-full h-full flex items-center justify-center">
                <Row gutter = {[16,16]} className = "w-[calc(100%-500px)] mx-auto p-4">
                    {
                        courseSampleData.map((c, idx) => {
                            return (
                                <Col span = {6} key = {idx} className = "!flex !items-center !justify-center !gap-2">
                                    <Card className = "w-[262px] h-[303px] hover:shadow-lg hover:scale-105 transition-all duration-300">
                                        <div className = "flex flex-col items-center justify-center">
                                            <Image src = {EmptyLayout} alt = {c.name} width = {0} height = {0} 
                                                className = "w-full h-full object-cover"                                                    
                                            />
                                            <h3 className = "text-[1.25rem] font-bold text-center text-truncate line-clamp-1">{c.name}</h3>
                                            <p><StarFilled className ="!text-yellow-400"/><span className = "font-bold text-gray-600 text-center ml-[2px]">{c.rating}</span></p>
                                            <p className = "text-[1rem] font-light text-gray-600 text-center">{c.teacher}</p>
                                            <p className = "text-[1rem] font-light text-gray-600 text-center">Thời lượng: {c.estimated_time}</p>
                                            
                                            <div className = "flex items-start justify-start gap-2 mt-2">
                                                {
                                                    c.tags.map((t, idx) => {
                                                        return (
                                                            <p key = {idx} className = "text-[10px] font-light text-gray-600 text-center rounded-md px-1 py-1 w-fit bg-gray-100">{t}</p>
                                                        )
                                                    })
                                                }
                                            </div>
                                            
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>

            <StyledButton
                name = "Xem tất cả"
                buttonClassName = "!bg-black !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]"
                iconClassName = "!rotate-45 !text-black"
            />
        </section>
    )

}

const FooterSection = () => {
    return (

        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className = "flex flex-col items-center justify-center gap-4 w-[calc(100%-300px)] shadow-md rounded-md p-[2rem] bg-green-200 mt-[4rem]">
                <div className = "text-center w-[calc(100%-300px)]">
                    <h1 className = "text-[2rem] font-bold">Đăng ký học cùng gia sư AI và chuẩn bị hành trang cho tương lai của bạn ngay hôm nay</h1>
                    <p className = "text-[1.25rem] font-light text-gray-600 text-center">
                        Bứt phá hiệu suất học tập với gia sư ảo và mở ra nhiều cơ hội mới.
                    </p>
                </div>
                
                <Button
                    className = "!bg-blue-500 !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]"
                >
                    Tham gia
                </Button>
            </div>
            <div className = "grid grid-cols-4 gap-4 justify-center items-start w-full pt-10 px-24 py-12">
                <div className = "flex flex-col justify-center items-center">
                    <div>
                        <div>
                            <h1 className = "text-[0.75rem] font-bold text-blue-400">AT AI.Tutor</h1>
                        </div>
                        <div>
                            <p><span className = "font-bold">Văn phòng</span>: 227 Nguyễn Văn Cừ, phường Chợ Quán,
                            quận 5, TP.HCM</p>
                         
                            <p><span className = "font-bold">Số điện thoại</span>: +84 123 456 789</p>

                            <p><span className = "font-bold">Email</span>: info@email.com</p>

                        </div>
                    </div>
                    
                </div>

                <div className = "flex flex-col justify-center items-center ">
                    <div>
                        <div>
                            <p className = "text-[0.75rem] font-bold">Liên kết nhanh</p>
                        </div>
                        <div>
                            <p>Chi phí</p>
                            <p>Học sinh</p>
                            <p>Giáo viên</p>
                            <p>Môn học</p>
                            <p>Liên hệ</p>
                        </div>
                    </div>
                </div>

                <div className = "flex flex-col justify-center items-center">
                    <div>
                        <div>
                            <p className = "text-[0.75rem] font-bold">Khác</p>
                        </div>
                        <div>
                            <p>Cách hoạt động</p>
                            <p>Điều khoản & Điều lệ</p>
                            <p>Chính sách bảo mật</p>
                        </div>
                    </div>
                </div>

                <div className = "flex flex-col justify-center items-center">
                    <div>
                        <div>
                            <p className = "text-[0.75rem] font-bold">Về GSAI</p>
                        </div>
                        <div>
                            <p>Giới thiệu</p>
                            <p>Tầm nhìn</p>
                            <p>Ban điều hành</p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className = "w-full h-[100px] flex items-center justify-between px-24">
                <div>
                    <p>Copyright © 2025 AT AI.Tutor. All rights reserved.</p>
                </div>
                <div className = "flex items-center justify-center gap-2">
                    <p><FacebookFilled style={{ fontSize: '20px' }}/></p>
                    <p><InstagramFilled style={{ fontSize: '20px' }}/></p>
                    <p><YoutubeFilled style={{ fontSize: '20px' }}/></p>
                    <p><MailOutlined style={{ fontSize: '20px' }}/></p>
                </div>
            </footer>
        </section>
    )
}


export {GreetingSection, CourseDisplaySection, FooterSection}