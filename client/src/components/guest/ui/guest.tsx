'use client';

import Link from "next/link";
import {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {Button, Menu, Row, Col, Card} from "antd";
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { ArrowRightOutlined, FacebookFilled, InstagramFilled, YoutubeFilled,MailOutlined, StarFilled } from "@ant-design/icons"

import Cate_1 from "@/../public/guest/Cate_1.svg";
import Cate_2 from "@/../public/guest/Cate_2.svg";
import Cate_3 from "@/../public/guest/Cate_3.svg";
import Cate_4 from "@/../public/guest/Cate_4.svg";
import Cate_5 from "@/../public/guest/Cate_5.svg";
import Cate_6 from "@/../public/guest/Cate_6.svg";
import Cate_7 from "@/../public/guest/Cate_7.svg";

const GreetingSection = () => {
    
    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-between h-[4.8125rem] px-24">
                <div className = "flex flex-1 items-center justify-start gap-2">
                    <div className = "text-2xl font-bold">
                        <p className = "!text-[var(--color-bg_white)]"><span className = "!text-[var(--color-bg_white)]">AT</span> AI.Tutor</p>
                    </div>
                </div>
                <div className = "flex flex-1 items-center justify-center gap-2 ">
                    <Menu 
                        mode = "horizontal"
                        defaultSelectedKeys={["home"]}
                        items = {[
                            { key: "intro", label: <span className = "!text-[var(--color-primary)] !text-[1rem]">Giới thiệu</span> },
                            { key: "courses", label: <span className = "!text-[var(--color-primary)] !text-[1rem]">Môn học</span> },
                            { key: "evaluate", label: <span className = "!text-[var(--color-primary)] !text-[1rem]">Đánh giá</span> },
                            { key: "contact", label: <span className = "!text-[var(--color-primary)] !text-[1rem]">Liên hệ</span> },
                        ]}
                        className = "!border-none !flex-1 !flex !items-center !justify-center"
                        style = {{
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>
                <div className = "flex flex-1 items-center justify-end gap-2">
                    <div className = "flex items-center justify-center gap-2">
                    <Button
                        type="primary"
                        className="!bg-transparent !text-white hover:!bg-blue-400 hover:!text-white 
                                !rounded-full !border !border-white !px-6 !py-[1.1rem] 
                                !flex !items-center !justify-between !w-[157px]"
                    >
                        {/* Spacer to push icon right */}
                        <span>Tham gia ngay</span>

                        {/* Icon */}
                        <span className="flex items-center justify-center bg-white rounded-full p-2">
                            <ArrowRightOutlined className="!rotate-315 !text-[var(--color-secondary)]" />
                        </span>
                    </Button>
                    </div>
                </div>
            </div>
            <div className = "mx-auto w-full h-full flex flex-col items-center justify-center w-[calc(100vh-40px)]">
                <div className = "flex items-center justify-center gap-4">
                    <div className = "text-[4rem] font-bold leading-tight">
                        <p className = "text-center !text-[var(--color-primary)]">Chào Mừng Đến Với GSAI</p>
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
            <div className = "flex flex-col items-center justify-center w-[calc(100%-24rem)]">
                <div className = "text-center">
                    <h1 className = "text-[3rem] font-bold">Môn học phổ biến hiện nay</h1>
                    <p className = "text-[1.25rem] font-light text-gray-600 text-center">Chọn môn học đúng hướng, nâng tầm hồ sơ tương lai!</p>
                </div>
            </div>
            <div className = "flex items-center justify-center w-[calc(100%-24rem)]">
                <Menu 
                    mode = "horizontal"
                    defaultSelectedKeys={["home"]}
                    items = {[
                        { key: "field-1", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                            <Image src = {Cate_1} alt = "Cate_1" width = {20} height = {20} className = "w-full h-full object-cover" />
                            <span>Phân loại</span>
                        </div> },
                        { key: "field-2", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                            <Image src = {Cate_2} alt = "Cate_2" width = {20} height = {20} className = "w-full h-full object-cover" />
                            <span>Phân loại</span>
                        </div> },
                        { key: "field-3", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                            <Image src = {Cate_3} alt = "Cate_3" width = {20} height = {20} className = "w-full h-full object-cover" />
                            <span>Phân loại</span>
                        </div> },
                        { key: "field-4", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                            <Image src = {Cate_4} alt = "Cate_4" width = {20} height = {20} className = "w-full h-full object-cover" />
                            <span>Phân loại</span>
                        </div> },
                        { key: "field-5", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                            <Image src = {Cate_5} alt = "Cate_5" width = {20} height = {20} className = "w-full h-full object-cover" />
                            <span>Phân loại</span>
                        </div> },
                        { key: "field-6", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                            <Image src = {Cate_6} alt = "Cate_6" width = {20} height = {20} className = "w-full h-full object-cover" />
                            <span>Phân loại</span>
                        </div> },
                        { key: "field-7", label: <div className = "!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center gap-2">
                            <Image src = {Cate_7} alt = "Cate_7" width = {20} height = {20} className = "w-full h-full object-cover" />
                            <span>Phân loại</span>
                        </div> },

                    ]}
                    className = "!w-full !flex !items-center !justify-center gap-4"
                    style = {{
                        backgroundColor: 'transparent'
                    }}
                />
            </div>
            <div className = "w-full h-full flex items-center justify-center">
                <Row gutter = {[16,16]} className = "w-[calc(100%-300px)] mx-auto p-4">
                    {
                        courseSampleData.map((c, idx) => {
                            return (
                                <Col span = {6} key = {idx} className = "!flex !items-center !justify-center !gap-2">
                                    <Card className = "w-[262px] h-[303px] hover:shadow-[5px_5px_20px_var(--color-neutral)] hover:scale-105 transition-all duration-300">
                                        <div className = "flex flex-col items-center justify-center">
                                            <Image src = {EmptyLayout} alt = {c.name} width = {0} height = {0} 
                                                className = "w-full h-full object-cover"                                                    
                                            />
                                            <h3 className = "text-[1.25rem] font-bold text-center text-truncate line-clamp-1">{c.name}</h3>
                                            <div className="flex items-center justify-center">
                                                <StarFilled className ="!text-yellow-400"/>
                                                <span className = "font-bold text-gray-600 text-center ml-[2px]">{c.rating}</span>
                                            </div>
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
                buttonClassName = "!bg-black !text-white hover:!bg-[var(--color-bg_white)] hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]"
                iconClassName = "!rotate-315 !text-[var(--color-bg_white)] !hover:!text-black"
            />
        </section>
    )
}


const FooterSection = () => {
    return (

        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className = "flex flex-col items-center justify-center gap-4 shadow-[5px_5px_10px_rgba(168,220,255,0.6)] rounded-md p-[2rem]  mt-[4rem] w-[calc(100%-24rem)]">
                <div className = "flex flex-col items-center justify-center text-center w-[calc(100%-300px)]">
                    <h1 className = "text-[2.5rem] text-[var(--color-primary)] w-[calc(100%-120px)]">Đăng ký học cùng gia sư AI và chuẩn bị hành trang cho tương lai của bạn ngay hôm nay</h1>
                    <p className = "text-[1rem] font-light text-[var(--color-primary)] text-center">
                        Bứt phá hiệu suất học tập với gia sư ảo và mở ra nhiều cơ hội mới.
                    </p>
                </div>
                
                <Button
                    className = "!bg-blue-500 !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]"
                >
                    Tham gia
                </Button>
            </div>
            <div className = "grid grid-cols-4 gap-4 justify-center items-start pt-10 py-12 w-[calc(100%-24rem)]">
                <div className = "flex flex-col justify-center items-center">
                    <div>
                        <div>
                            <h1 className = "text-[1rem] font-bold text-[var(--color-primary)]">AT AI.Tutor</h1>
                        </div>
                        <div>
                            <p className = "text-[var(--color-primary)]"><span className = "font-bold text-[var(--color-primary)]">Văn phòng</span>: 227 Nguyễn Văn Cừ, phường Chợ Quán, quận 5, TP.HCM</p> 
                            <p className = "text-[var(--color-primary)]"><span className = "font-bold text-[var(--color-primary)]">Số điện thoại</span>: +84 123 456 789</p>
                            <p className = "text-[var(--color-primary)]"><span className = "font-bold text-[var(--color-primary)]">Email</span>: info@email.com</p>
                        </div>
                    </div>
                </div>

                <div className = "flex flex-col justify-center items-center ">
                    <div>
                        <div>
                            <h1 className = "text-[1rem] font-bold text-[var(--color-primary)]">Liên kết nhanh</h1>
                        </div>
                        <div>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Chi phí</p>
                            <p className = "text-[var(--color-primary)]">Học sinh</p>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Giáo viên</p>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Môn học</p>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Liên hệ</p>
                        </div>
                    </div>
                </div>

                <div className = "flex flex-col justify-center items-center">
                    <div>
                        <div>
                            <h1 className = "text-[1rem] font-bold text-[var(--color-primary)]">Khác</h1>
                        </div>
                        <div>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Cách hoạt động</p>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Điều khoản & Điều lệ</p>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Chính sách bảo mật</p>
                        </div>
                    </div>
                </div>

                <div className = "flex flex-col justify-center items-center">
                    <div>
                        <div>
                            <h1 className = "text-[1rem] font-bold text-[var(--color-primary)]">Về GSAI</h1>
                        </div>
                        <div>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Giới thiệu</p>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Tầm nhìn</p>
                            <p className = "text-[1rem] text-[var(--color-primary)]">Ban điều hành</p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className = "h-[100px] flex items-center justify-between w-[calc(100%-24rem)]">
                <div>
                    <p>©2025 All rights reserved</p>
                </div>
                <div className = "flex items-center justify-center gap-2">
                    <FacebookFilled style={{ fontSize: '20px' }}/>
                    <InstagramFilled style={{ fontSize: '20px' }}/>
                    <YoutubeFilled style={{ fontSize: '20px' }}/>
                    <MailOutlined style={{ fontSize: '20px' }}/>
                </div>
            </footer>
        </section>
    )
}


export {GreetingSection, CourseDisplaySection, FooterSection}