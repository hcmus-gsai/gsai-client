'use client';

import Link from "next/link";
import {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {Button, Menu, Row, Col, Card} from "antd";

import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { ArrowLeftOutlined, ArrowRightOutlined, FacebookFilled, InstagramFilled, YoutubeFilled,MailOutlined, StarFilled } from "@ant-design/icons"

import Cate_1 from "@/../public/guest/Cate_1.svg";
import Cate_2 from "@/../public/guest/Cate_2.svg";
import Cate_3 from "@/../public/guest/Cate_3.svg";
import Cate_4 from "@/../public/guest/Cate_4.svg";
import Cate_5 from "@/../public/guest/Cate_5.svg";
import Cate_6 from "@/../public/guest/Cate_6.svg";
import Cate_7 from "@/../public/guest/Cate_7.svg";

import circleBG from "../../../../public/guest/circle_bg.svg";
import walletIcon from "../../../../public/guest/wallet.svg";
import globalIcon from "../../../../public/guest/global.svg";
import monitorIcon from "../../../../public/guest/monitor.svg";
import userTickIcon from "../../../../public/guest/user_tick.svg";
import arrow1Icon from "../../../../public/guest/Arrow1.svg";
import arrow2Icon from "../../../../public/guest/Arrow2.svg";

import createAccIcon from "../../../../public/guest/createAccIcon.svg";
import pickClassIcon from "../../../../public/guest/pickClassIcon.svg";
import AITutorIcon from "../../../../public/guest/AITutorIcon.svg";
import Epis from "../../../../public/shared/EPIS.svg";
import workFlowPic from "../../../../public/guest/workflowPic.svg";

import testimonialPic from "../../../../public/guest/testimonialPic.svg";

import { RedirectButton } from '@/components/shared/redirect-button'

type FunctionBlock = {
    title: string;
    subtext: string;
    button: string;
};

type FunctionProps = {
    title: string;
    subtext?: string;
    firstBlock: FunctionBlock;
    secondBlock: FunctionBlock;
    thirdBlock: FunctionBlock;
    fourthBlock: FunctionBlock;
};

const GreetingSection = () => {
    const router = useRouter();
    
    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className="flex w-[78%] items-center justify-between h-[4.8125rem]">
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
                        <RedirectButton
                            onClick = {() => router.push("/auth/signin")}
                            text = "Tham gia ngay"
                            buttonText = "var(--color-bg_white)"
                            buttonBorder = "white"
                            iconBg = "var(--color-bg-white)"
                            iconText = "var(--color-secondary)"
                        />
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
            <div className = "flex flex-col items-center justify-center w-[78%]">
                <div className = "text-center">
                    <h1 className = "text-[3rem] font-bold">Môn học phổ biến hiện nay</h1>
                    <p className = "text-[1.25rem] font-light text-gray-600 text-center">Chọn môn học đúng hướng, nâng tầm hồ sơ tương lai!</p>
                </div>
            </div>
            <div className = "flex items-center justify-center w-[78%]">
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

            <div className = "w-[78%] h-full flex items-center justify-center">
                <Row gutter = {[16,16]} className = "mx-auto">
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

const FooterSection = ({
    hasRegisterBox = true,
}: {
    hasRegisterBox?: boolean;
}) => {
    return (
        <section className="w-full flex flex-col items-center justify-center border-t border-gray-200 bg-white">
            {hasRegisterBox && (
                <div className="flex flex-col items-center justify-center gap-6 shadow-[5px_5px_10px_rgba(168,220,255,0.6)] rounded-2xl p-6 md:p-[2rem] mt-10 md:mt-[4rem] w-[90%] md:w-[78%] border border-blue-50">
                    <div className="flex flex-col items-center justify-center text-center w-full">
                        {/* Title Responsive: Nhỏ trên mobile, lớn trên desktop */}
                        <h1 className="text-2xl md:text-[2.5rem] font-bold text-[var(--color-primary)] w-full md:w-[80%] leading-tight mb-2">
                            Đăng ký học cùng gia sư AI và chuẩn bị hành trang cho tương lai ngay hôm nay
                        </h1>
                        <p className="text-sm md:text-[1rem] font-light text-[var(--color-primary)] text-center px-2">
                            Bứt phá hiệu suất học tập với gia sư ảo và mở ra nhiều cơ hội mới.
                        </p>
                    </div>

                    <Button
                        type="primary"
                        className="!bg-blue-500 !text-white hover:!bg-white hover:!text-black !px-8 !py-5 md:!py-6 !rounded-[50px] !text-base md:!text-[20px] !h-auto"
                    >
                        Tham gia
                    </Button>
                </div>
            )}

            {/* MAIN GRID: Mobile: 1 cột, Tablet: 2 cột, Desktop: 4 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 justify-center items-start pt-10 py-12 w-full px-6 md:px-0 md:w-[calc(100%-12rem)]">
                
                {/* Column 1: Logo & Info */}
                <div className="flex flex-col justify-start items-center md:items-start text-center md:text-left">
                    <div className="w-[80px] mb-4">
                         <Image src = {Epis} alt = "Epis Logo" width={0} height={0} className="w-full h-auto object-contain" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-[var(--color-primary)] text-sm md:text-base">
                            <span className="font-bold">Văn phòng</span>: 227 Nguyễn Văn Cừ, Quận 5, TP.HCM
                        </p>
                        <p className="text-[var(--color-primary)] text-sm md:text-base">
                            <span className="font-bold">Số điện thoại</span>: +84 123 456 789
                        </p>
                        <p className="text-[var(--color-primary)] text-sm md:text-base">
                            <span className="font-bold">Email</span>: info@email.com
                        </p>
                    </div>
                </div>

                {/* Column 2: Liên kết nhanh */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-lg font-bold text-[var(--color-primary)] mb-4">
                        Liên kết nhanh
                    </h1>
                    <div className="flex flex-col gap-2">
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Chi phí</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Học sinh</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Giáo viên</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Môn học</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Liên hệ</p>
                    </div>
                </div>

                {/* Column 3: Khác */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-lg font-bold text-[var(--color-primary)] mb-4">
                        Khác
                    </h1>
                    <div className="flex flex-col gap-2">
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Cách hoạt động</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Điều khoản & Điều lệ</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Chính sách bảo mật</p>
                    </div>
                </div>

                {/* Column 4: Về GSAI */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-lg font-bold text-[var(--color-primary)] mb-4">
                        Về GSAI
                    </h1>
                    <div className="flex flex-col gap-2">
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Giới thiệu</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Tầm nhìn</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Ban điều hành</p>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <footer className="py-6 md:h-[100px] flex flex-col-reverse md:flex-row items-center justify-between w-full px-6 md:px-0 md:w-[calc(100%-12rem)] border-t border-gray-100 md:border-none gap-4 md:gap-0">
                <div className="text-sm md:text-base text-gray-500">
                    <p>©2025 All rights reserved</p>
                </div>
                <div className="flex items-center justify-center gap-4 text-[var(--color-primary)]">
                    <FacebookFilled className="text-2xl cursor-pointer hover:text-blue-600 transition-colors" />
                    <InstagramFilled className="text-2xl cursor-pointer hover:text-pink-600 transition-colors" />
                    <YoutubeFilled className="text-2xl cursor-pointer hover:text-red-600 transition-colors" />
                    <MailOutlined className="text-2xl cursor-pointer hover:text-gray-600 transition-colors" />
                </div>
            </footer>
        </section>
    );
};

const FunctionSection = (
    {
        title,
        subtext,
        firstBlock,
        secondBlock,
        thirdBlock, 
        fourthBlock
    } : FunctionProps) => {
    
    return (
        <section
            className="w-full min-h-[120vh]"
            style={{ backgroundColor: "#FAFAFA" }}
        >
            <div className="relative w-full h-full flex flex-col justify-center items-center py-19 px-38 gap-4">
                <p className="text-[3.8vw] font-semibold">Vì sao chọn GSAI?</p>
                <p className="text-[1vw]">Bứt phá hiệu suất học tập với gia sư ảo và mở ra nhiều cơ hội mới.</p>
                <br />

                <div className="relative w-full h-[48%] flex flex-col justify-center items-center">
                    <Image
                        src={circleBG}
                        alt="Circle"
                        width={0} height={0}
                        className="w-[48%] h-full z-0"
                    />

                    <div className="absolute z-10 top-[21%] right-[67%]">
                        <Card 
                            style={{ width: "17vw", borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex flex-col justify-center items-center max-h-[22vh] overflow-auto">
                                <Image
                                    src={walletIcon}
                                    alt="Wallet Icon"
                                    className="w-[25%] h-[25%]"
                                />

                                <p className="text-[1.2vw] font-semibold">Tiết kiệm chi phí</p>
                                <p className="text-[0.8vw]">Tiết kiệm chi phí hiệu quả như gia sư riêng nhưng giá thấp hơn nhiều.</p> 

                                <Button className="mt-4" type="primary" style={{borderRadius: "20px", fontSize: "0.8vw"}}>Tham gia ngay</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="absolute z-10 top-[60%] right-[67%]">
                        <Card 
                            style={{ width: "23vw", borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex max-h-[10vh] overflow-auto">
                                <span className="w-[18%] justify-center items-center">
                                    <Image
                                        src={globalIcon}
                                        alt="Wallet Icon"
                                        className="w-full h-full"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.2vw] font-semibold">Học mọi lúc, mọi nơi</p>
                                    <p className="text-justify text-[0.8vw]">Không bị giới hạn thời gian hay địa điểm.</p> 
                                </span>
                            </div>
                        </Card>
                    </div>
                    
                    <div className="absolute z-10 top-[11%] left-[67%]">
                        <Card 
                            style={{ width: "25vw", borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex max-h-[10vh] overflow-auto">
                                <span className="w-[15%] justify-center items-center">
                                    <Image
                                        src={monitorIcon}
                                        alt="Wallet Icon"
                                        className="w-full h-full"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.2vw] font-semibold">Không áp lực, không ngại hỏi</p>
                                    <p className="text-justify text-[0.8vw]">Học thoải mái, tự nhiên hơn.</p> 
                                </span>
                            </div>
                        </Card>
                    </div>

                    <div className="absolute z-10 top-[30%] left-[67%]">
                        <Card 
                            style={{ width: "17vw", borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex flex-col justify-center items-center max-h-[20vh] overflow-auto">
                                <Image
                                    src={userTickIcon}
                                    alt="Wallet Icon"
                                    className="w-[25%] h-[25%]"
                                />

                                <p className="text-[1.2vw] font-semibold">Cá nhân hóa lộ trình</p>
                                <p className="text-center text-[0.8vw]">Ai hiểu trình độ của bạn và điều chỉnh nội dung phù hợp.</p> 

                                <Button className="mt-2" type="primary" style={{borderRadius: "20px", fontSize: "0.8vw"}}>Bắt đầu ngay</Button>
                            </div>
                        </Card>
                    </div>

                    <p className="absolute z-20 top-[91%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[1.5vw] text-white">
                        Video resume
                    </p>

                    <div className="absolute z-10 top-[-3%] left-[67%]">
                        <Image
                            src={arrow1Icon}
                            alt="Wallet Icon"
                            className=" w-[5.7vw] h-[5.7vw]"
                        />
                    </div>
                    
                    <div className="absolute z-10 top-[89%] right-[66%]">
                        <Image
                            src={arrow2Icon}
                            alt="Wallet Icon"
                            className=" w-[5vw] h-[5vw]"
                        />
                    </div>
                    
                    <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[94%]">
                        <video
                            src="/guest/expVid.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const WorkFlowSection = () => {
    
    return (
        <section
            className="w-full min-h-[50vh] flex flex-col items-center justify-center bg-white"
        >
            <div className="w-[78%] h-full py-19 grid grid-cols-12">
                <div className="col-span-7 flex flex-col">
                    <p className="text-[3.8vw] font-semibold mb-7">Cách hoạt động</p>

                    <div className="w-full h-full flex items-stretch mb-5">
                        <div className="flex items-center justify-center mr-6">
                            <p className="text-[4.7vw] leading-none py-0">01</p>
                        </div>

                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
                            <div className="flex">
                                <span>
                                    <Image
                                        src={createAccIcon}
                                        alt="create account icon"
                                        width={0} height={0}
                                        className="w-[4vw] h-[4vw]"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.3vw] font-semibold">Tạo tài khoản</p>
                                    <p className="text-[0.9vw]">Hoàn thiện thông tin và khẳng định kỹ năng của bạn.</p>
                                </span>
                            </div>
                        </Card>
                    </div>

                    <div className="w-full h-full flex items-stretch mb-5">
                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
                            <div className="flex">
                                <span>
                                    <Image
                                        src={pickClassIcon}
                                        alt="create account icon"
                                        width={0} height={0}
                                        className="w-[4vw] h-[4vw]"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.3vw] font-semibold">Đăng tải môn học</p>
                                    <p className="text-[0.9vw]">Xây dựng môn học dẫn đầu xu thế.</p>
                                </span>
                            </div>
                        </Card>

                        <div className="flex items-center justify-center ml-6">
                            <p className="text-[5vw]">02</p>
                        </div>
                    </div>

                    <div className="w-full h-full flex items-stretch mb-5">
                        <div className="flex items-center justify-center mr-6">
                            <p className="text-[4.7vw] leading-none py-0">03</p>
                        </div>

                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
                            <div className="flex">
                                <span>
                                    <Image
                                        src={AITutorIcon}
                                        alt="create account icon"
                                        width={0} height={0}
                                        className="w-[4vw] h-[4vw]"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.3vw] font-semibold">Phân tích thông tin môn học</p>
                                    <p className="text-[0.9vw]">Nắm bắt thông tin môn học qua bảng điều khiển trực quan.</p>
                                </span>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="col-span-4 col-start-9">
                    <Image
                        src={workFlowPic}
                        alt="workflow pic"
                        width={0} height={0}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
            
        </section>
    );
};

const TestimonialSection = () => {
    
    return (
        <section
            className="w-full h-[90vh]"
            style={{ backgroundColor: "#FAFAFA" }}
        >
            <div className="w-full h-full py-19 px-38 flex flex-col">
                <p className="text-[3.8vw] font-semibold mb-8">Giáo viên nói gì về GSAI</p>

                <div className="flex h-full">
                    <div className="grow">
                        <Card 
                            className="w-full h-full" 
                            style={{ borderRadius: "20px", backgroundColor: "#06283D", color:"white", padding: "2vw" }}
                            styles={{
                                body: {
                                height: "100%",
                                },
                            }}
                        >
                            <div className="h-full flex flex-col justify-between items-center">
                                <div className="flex text-[2vw] orde-first">
                                    <p>Tên giáo viên</p>
                                    <p>.</p>
                                    <p>Môn học</p>
                                </div>

                                <p className="text-center text-[2vw]">“Epis giúp việc học của tôi tiện lợi hơn nhờ khả năng hỏi và trò chuyện trực tiếp với AI.”</p>

                                <div className="flex order-last">
                                    <Button 
                                        className="mr-3" 
                                        style={{ width: "3.5vw", height: "3.5vw", borderRadius: "calc(infinity * 1px)" }} type="primary">
                                        <ArrowLeftOutlined />
                                    </Button>

                                    <Button 
                                        className="mr-3" 
                                        style={{ width: "3.5vw", height: "3.5vw", borderRadius: "calc(infinity * 1px)" }} type="primary">
                                        <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="ml-5 w-[70%] h-full">
                        <Image
                            src={testimonialPic}
                            alt="workflow pic"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const QASection = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleCardClick = (id: number) => {
        setSelectedId(selectedId === id ? null : id);
    }

    return (
        <section
            className="w-full h-[90vh] bg-white"
        >
            <div className="w-full h-full py-19 px-38 flex flex-col">
                <p className="text-[3.8vw] font-semibold mb-8">Câu hỏi thường gặp</p>

                <div className="grid grid-cols-2 gap-4">
                    <Card
                        onClick={() => handleCardClick(1) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 1 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 1 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 1 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">01</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Cách để đăng ký tài khoản giáo viên</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Hoàn thiện thông tin tin và khẳng định kỹ năng của bạn.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        onClick={() => handleCardClick(4) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 4 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 4 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 4 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">04</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Có xóa môn học đã tạo được không?</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Môn học đã tạo không thể xóa được mà chỉ có thể chuyển sang tình trạng không thể đăng kí học nữa.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        onClick={() => handleCardClick(2) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 2 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 2 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 2 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">02</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Giấy tờ nào được chấp nhận để chứng minh danh tính</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Hoàn thiện thông tin tin và khẳng định kỹ năng của bạn.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        onClick={() => handleCardClick(5) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 5 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 5 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 5 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">05</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Đăng tải môn học có tốn phí hay không?</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Hoàn thiện thông tin tin và khẳng định kỹ năng của bạn.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        onClick={() => handleCardClick(3) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 3 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 3 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 3 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">03</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Bao lâu thì danh tính được xác nhận</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Hoàn thiện thông tin tin và khẳng định kỹ năng của bạn.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export {GreetingSection, CourseDisplaySection, FooterSection, FunctionSection, WorkFlowSection, TestimonialSection, QASection};