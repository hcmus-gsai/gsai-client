'use client';
import '@ant-design/v5-patch-for-react-19';

import Link from "next/link";
import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { Button, Menu, Row, Col, Card } from "antd";

import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { ArrowLeftOutlined, ArrowRightOutlined, FacebookFilled, InstagramFilled, YoutubeFilled, MailOutlined, StarFilled } from "@ant-design/icons"

import Cate_1 from "@/../public/guest/Cate_1.svg";
import { PublicNavbar } from "@/components/shared/PublicNavbar";
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
import WhiteEpisLogo from "../../../../public/student/WhiteEpisLogo.svg";
import { Sliders } from '@deemlol/next-icons';
import { Special_Gothic_Condensed_One } from 'next/font/google';
import { useLazySearchCoursesQuery, useLazyGetAllCategoriesQuery } from "@/store/api/[module]/courseApi";
import { Course } from "@/type/course.type";
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
        // <section className="flex-1 flex flex-col items-center justify-center w-full min-h-[100vh] px-4">
        //     <div className="flex flex-col items-center justify-center gap-8 max-w-[var(--global-width)] text-center">
        //         <div className="text-6xl md:text-7xl font-bold leading-tight">
        //             <p className="text-[var(--color-primary)]">
        //                 Chào Mừng Đến Với  
        //                 <span className="relative inline-block ml-2">
        //                     <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
        //                         EPIS
        //                     </span>
        //                 </span>
        //             </p>
        //         </div>

        //         <div className="space-y-3 text-lg md:text-xl text-gray-600">
        //             <p>Bạn đang gặp khó khăn trong quá trình học tập của mình?</p>
        //             <p>Bạn cần một gia sư đồng hành cùng mình?</p>
        //             <p>Đừng lo lắng.</p>
        //         </div>

        //         <Button
        //             type="default"
        //             className="!bg-[var(--color-secondary)] !text-white hover:!bg-white hover:!text-black !px-10 !py-6 !rounded-full !text-xl min-w-[240px]"
        //             onClick={() => router.push("/auth/signin")}
        //         >
        //             Khám phá ngay
        //         </Button>
        //     </div>
        // </section>
        <section className="flex-1 flex flex-col items-center justify-center w-full min-h-[100dvh] pt-[4.25rem] px-4">
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-[var(--global-width)] text-center py-12">
                <div className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
                    {/* <p className="text-[var(--color-primary)]">
                        Chào Mừng Đến Với
                        <span className="relative inline-block ml-2">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                EPIS
                            </span>
                        </span>
                    </p> */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-primary mb-8 leading-[1.1] tracking-tight opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]">
                        Chào mừng đến với <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                EPIS
                            </span>
                        </span>
                    </h1>
                </div>

                <div className="space-y-3 text-base sm:text-lg md:text-xl text-gray-600 max-w-[320px] sm:max-w-none opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]">
                    <p>Bạn đang gặp khó khăn trong quá trình học tập của mình?</p>
                    <p>Bạn cần một gia sư đồng hành cùng mình?</p>
                    <p>Đừng lo lắng.</p>
                </div>

                <Button
                    type="default"
                    className="!bg-[var(--color-secondary)] !text-white hover:!bg-white hover:!text-black !px-10 !py-6 !rounded-full !text-lg sm:!text-xl min-w-[200px] sm:min-w-[240px] opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]"
                    onClick={() => router.push("/auth/signin")}
                >
                    Khám phá ngay
                </Button>
            </div>
        </section>
    );
};

const StyledButton = (
    {
        name,
        buttonClassName,
        iconClassName,
        onClick,
    }: {
        name: string;
        buttonClassName?: string;
        iconClassName?: string;
        onClick?: () => void;
    }
) => {
    return (
        <Button className={buttonClassName} onClick={onClick}>
            {name}
            <ArrowRightOutlined className={iconClassName} />
        </Button>
    )
}

const CourseDisplaySection = () => {

    const router = useRouter();

    const [loadSearchCourses] = useLazySearchCoursesQuery();
    const [loadCategories] = useLazyGetAllCategoriesQuery();
    const [courses, setCourses] = useState<Course[]>([]);


    const [categories, setCategories] = useState<string[]>();
    const [categoryName, setCategoryName] = useState<string>("Cơ sở ngành");
    const [showAll, setShowAll] = useState<boolean>(false);
    const [displayCategoryName, setDisplayCategoryName] = useState<string>("Cơ sở ngành");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    useEffect(() => {
        const fetchCoursesAndCategories = async () => {
            try {
                const courseResponse = await loadSearchCourses(
                    {
                        sortBy: 'created_at',
                        sortOrder: 'ASC'
                    }
                );
                if (courseResponse.data) {
                    setCourses(courseResponse.data.data);
                }

                const categoriesResponse = await loadCategories()
                if (categoriesResponse.data) {
                    setCategories(categoriesResponse.data.data)

                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchCoursesAndCategories();
    }, []);

    useEffect(() => {
        setShowAll(false);
    }, [categoryName]);


    const menuItems = categories?.map((item) => ({
        label: (
            <span
                className="text-[1rem] font-semibold  cursor-pointer"

            >

                {item}
            </span>
        ),
        key: item,
    }));

    const filteredCourses = useMemo(() => {
        if (!courses) return [];
        return courses.filter(
            c =>
                c.category?.toString().split(',').map(s => s.trim()).includes(displayCategoryName)
        )
    }, [courses, displayCategoryName])
    const displayCourses = useMemo(() => {
        return showAll ? filteredCourses : filteredCourses.slice(0, 8)

    }, [showAll, filteredCourses]);


    return (
        <section className="w-full  flex flex-col items-center justify-center py-[2rem]">
            <div className="flex flex-col items-center justify-center w-[var(--global-width)]">
                <div className="text-center mb-[1.5rem]">
                    <h1 className="text-[3rem] font-bold">Môn học phổ biến hiện nay</h1>
                    <p className="text-[1.25rem] font-light text-gray-600 text-center">Chọn môn học đúng hướng, nâng tầm hồ sơ tương lai!</p>
                </div>
            </div>
            <div className="flex items-center justify-center w-[var(--global-width)] mb-[1.5rem]">
                <div
                    className="w-full flex items-center justify-center border-none"
                >
                    <Menu
                        mode="horizontal"
                        selectedKeys={[categoryName]}
                        items={menuItems}

                        onClick={(e) => {
                            const item = e.key;
                            if (item !== categoryName) {
                                setIsAnimating(true);
                                setCategoryName(item);
                                setTimeout(() => {
                                    setDisplayCategoryName(item);
                                    setTimeout(() => {
                                        setIsAnimating(false);
                                    }, 100);
                                }, 400);
                            }
                        }}

                        className='!bg-transparent !border-none !w-full !flex !items-center !justify-start [&_.ant-menu-item]:!font-normal [&_.ant-menu-item]:!text-gray-700 [&_.ant-menu-item]:!relative [&_.ant-menu-item:hover]:!text-[var(--color-secondary)] [&_.ant-menu-item-selected]:!text-[var(--color-secondary)] [&_.ant-menu-item-selected]:!font-semibold [&_.ant-menu-item:hover]:[text-shadow:0_0_0.75px_var(--color-primary)] [&_.ant-menu-item::after]:!content-[""] [&_.ant-menu-item::after]:!absolute [&_.ant-menu-item::after]:!bottom-0 [&_.ant-menu-item::after]:!left-0 [&_.ant-menu-item::after]:!h-[2px] [&_.ant-menu-item::after]:!w-full [&_.ant-menu-item::after]:!bg-[var(--color-secondary)] [&_.ant-menu-item::after]:!shadow-[0_-5px_25px_2px_rgba(59,130,246,0.6)] [&_.ant-menu-item::after]:!origin-center [&_.ant-menu-item::after]:!scale-x-0 [&_.ant-menu-item::after]:!transition-transform [&_.ant-menu-item::after]:!duration-500 [&_.ant-menu-item::after]:!ease-in-out [&_.ant-menu-item::after]:!border-none [&_.ant-menu-item:hover::after]:!scale-x-[80%] [&_.ant-menu-item.ant-menu-item-selected::after]:!scale-x-[80%] [&_.ant-menu-item.ant-menu-item-selected::after]:!opacity-100 [&_.ant-menu-item.ant-menu-item-selected::after]:!shadow-[0_-10px_20px_2px_rgba(59,130,246,0.6)]'
                    />

                </div>

            </div>

            <div className="w-[var(--global-width)] h-full flex items-center justify-center mb-[2rem]">
                <Row
                    gutter={[16, 16]}
                    className={`w-[100%] min-h-[370px] mx-auto !flex !items-start !justify-center `}
                    key={displayCategoryName}
                >
                    {
                        displayCourses.map((c, index) => (
                            <Col
                                span={6}
                                key={c.id}
                                className={`!flex !items-center !justify-center transition-all duration-300 ease-out ${isAnimating
                                    ? 'opacity-0'
                                    : 'opacity-100'
                                    }`}
                            // style={{
                            //     animationDelay: `${index < 8 ? index * 50 : (index - 8) * 50}ms`,
                            //     animationFillMode: 'both'
                            // }}
                            >
                                <Card
                                    className="w-[100%] px-[1rem] py-[1.5rem] hover:shadow-[5px_5px_20px_var(--color-neutral)] hover:scale-105 transition-all duration-300 cursor-pointer !rounded-[24px]"
                                // onClick = {()=>router.push(`/student/courses/${c.id}`)}
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <Image
                                            width={300} height={200}
                                            src={c.thumbnail_url || EmptyLayout}
                                            alt={c.course_name || "Empty Layout"}

                                            className="w-full object-cover rounded-lg mb-[1rem]"

                                        />
                                        <h3 className="text-[1.125rem] font-semibold text-center text-truncate line-clamp-1">{c.course_name}</h3>

                                        <p className="text-[0.875rem] font-light text-gray-600 text-center line-clamp-1">
                                            bởi {c.teacher_name}
                                        </p>

                                        <div className="flex items-center justify-center">
                                            <StarFilled className="!text-yellow-400" />
                                            <span className="font-bold text-gray-600 text-center ml-[2px]">5</span>
                                        </div>

                                        <p className="text-[0.875rem] font-light text-gray-600 text-center">Thời lượng: {c.duration}</p>

                                        <div className="flex items-center justify-center w-full gap-x-[0.5rem]">
                                            {
                                                c.category.toString().split(',').map((category, idx) => {
                                                    return (
                                                        <div key={idx} className="flex items-center justify-center bg-[var(--color-bg_white)] border border-solid border-gray-200 rounded-full  h-[27px] px-[1rem] py-[0.5rem]"

                                                            onClick={
                                                                (e) => {
                                                                    e.stopPropagation();
                                                                    // dispatch(setTitle(category));
                                                                    // router.push(`/student/category/${category.toLowerCase().replace(/ /g, '-')}`);
                                                                }
                                                            }
                                                        >
                                                            <p className="text-[0.875rem] font-light text-gray-600 text-center line-clamp-1">{category}</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div>


            <Button
                type="primary"
                className={`
                    group !w-[10.5rem] !h-[3rem] !rounded-full !flex !items-center !justify-center !bg-white !border
                    hover:!bg-[var(--color-secondary)]
                    hover:!border-white
                    `}
                style={{ border: `1px solid var(--color-secondary)` }}
                onClick={() => setShowAll(!showAll)}
            >
                <div className="mr-auto flex items-center justify-center relative w-[calc(100%-3rem)] left-[0.5rem]">
                    <span className={`text-[1rem] text-[var(--color-secondary)] group-hover:text-white font-bold`}>{showAll ? "Thu gọn" : "Xem tất cả"}</span>
                </div>

                <div className={`ml-auto flex items-center justify-center w-[2.5rem] h-[2.5rem]  rounded-full relative right-[-0.75rem] bg-[var(--color-secondary)] group-hover:bg-[var(--color-white)]`}>
                    <span
                        className="flex items-center justify-center rounded-full p-2 w-full h-full">
                        <ArrowRightOutlined className={`
                            !-rotate-45 
                            !text-[var(--color-bg-white)]
                            group-hover:!text-[var(--color-secondary)]
                        `} />
                    </span>
                </div>
            </Button>
        </section>
    )
}

const FooterSection = ({
    hasRegisterBox = true,
}: {
    hasRegisterBox?: boolean;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const isPageA = pathname === '/student' || pathname === '/teacher';

    return (
        <section className={`w-full flex flex-col items-center justify-center bg-neural ${isPageA ? "" : "border-t border-gray-200"}`}>

            {/* MAIN GRID: Mobile: 1 cột, Tablet: 2 cột, Desktop: 4 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 justify-center items-start pt-10 py-12 w-full px-6 md:px-0 md:w-[var(--global-width)]">

                {/* Column 1: Logo & Info */}
                <div className="flex flex-col justify-start items-center md:items-start text-center md:text-left">
                    <div className="w-[80px] mb-4">
                        <Image src={Epis} alt="Epis Logo" width={0} height={0} className="w-full h-auto object-contain" />
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
                        Về Epis
                    </h1>
                    <div className="flex flex-col gap-2">
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Giới thiệu</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Tầm nhìn</p>
                        <p className="text-[var(--color-primary)] cursor-pointer hover:underline">Ban điều hành</p>
                    </div>
                </div>
            </div>

            <footer className="py-6 md:h-[100px] flex flex-col-reverse md:flex-row items-center justify-between w-full px-6 md:px-0 md:w-[var(--global-width)] border-t border-gray-100 md:border-none gap-4 md:gap-0">
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
    }: FunctionProps) => {

    return (
        <section
            className="w-full min-h-[120vh]"
            style={{ backgroundColor: "#FAFAFA" }}
        >
            <div className="relative w-full h-full flex flex-col justify-center items-center py-19 px-38 gap-4">
                <p className="text-[3.8vw] font-semibold">Vì sao chọn EPIS?</p>
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
                            style={{ width: "17vw", borderRadius: "20px", boxShadow: " 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex flex-col justify-center items-center overflow-auto">
                                <Image
                                    src={walletIcon}
                                    alt="Wallet Icon"
                                    className="w-[25%] h-[25%]"
                                />

                                <p className="text-[1.2vw] font-semibold">Tiết kiệm chi phí</p>
                                <p className="text-[0.8vw]">Tiết kiệm chi phí hiệu quả như gia sư riêng nhưng giá thấp hơn nhiều.</p>

                                <Button className="mt-4" type="primary" style={{ borderRadius: "20px", fontSize: "0.8vw" }}>Tham gia ngay</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="absolute z-10 top-[60%] right-[67%]">
                        <Card
                            style={{ width: "23vw", borderRadius: "20px", boxShadow: " 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
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
                            style={{ width: "25vw", borderRadius: "20px", boxShadow: " 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
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
                            style={{ width: "17vw", borderRadius: "20px", boxShadow: " 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex flex-col justify-center items-center overflow-auto">
                                <Image
                                    src={userTickIcon}
                                    alt="Wallet Icon"
                                    className="w-[25%] h-[25%]"
                                />

                                <p className="text-[1.2vw] font-semibold">Cá nhân hóa lộ trình</p>
                                <p className="text-center text-[0.8vw]">Ai hiểu trình độ của bạn và điều chỉnh nội dung phù hợp.</p>

                                <Button className="mt-2" type="primary" style={{ borderRadius: "20px", fontSize: "0.8vw" }}>Bắt đầu ngay</Button>
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
            <div className="w-[var(--global-width)] h-full py-19 grid grid-cols-12">
                <div className="col-span-7 flex flex-col">
                    <p className="text-[3.8vw] font-semibold mb-7">Cách hoạt động</p>

                    <div className="w-full h-full flex items-stretch mb-5">
                        <div className="flex items-center justify-center mr-6">
                            <p className="text-[4.7vw] leading-none py-0">01</p>
                        </div>

                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow: " 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
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
                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow: " 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
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

                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow: " 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
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

    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = useMemo(() => {
        return [
            {
                name: 'TS.Lê Ngọc Thành',
                subject: 'Khai thác dữ liệu đồ thị',
                description: 'Epis giúp việc học của tôi tiện lợi hơn nhờ khả năng hỏi và trò chuyện trực tiếp với AI.',
            },
            {
                name: 'TS.Lê Ngọc Thành',
                subject: 'Cấu trúc dữ liệu và giải thuật',
                description: 'Epis giúp việc học của tôi tiếp cận cấu trúc dữ liệu và giải thuật một cách dễ dàng hơn.',
            },
            {
                name: 'TS.Lê Ngọc Thành',
                subject: 'Nhập môn hệ thống thông tin',
                description: 'Epis là công cụ hỗ trợ học tập hiệu quả cho sinh viên.',
            },
        ]

    }, [currentSlide])

    const nextSlide = () => {
        setCurrentSlide(
            (prev) => (prev === slides.length - 1 ? 0 : prev + 1)
        )
    }

    const prevSlide = () => {
        setCurrentSlide(
            (prev) => (prev === 0 ? slides.length - 1 : prev - 1)
        )
    }

    return (
        <section
            className="w-full min-h-[90vh] flex items-center justify-center py-16 md:py-24"
            style={{ backgroundColor: "#FAFAFA" }}
        >
            <div className="w-[var(--global-width)] flex flex-col">
                <p className="text-[3.8vw] font-semibold mb-8">Giáo viên nói gì về EPIS</p>

                <div className="flex h-[50vh]">
                    <div className="grow w-full">
                        <Card
                            className="w-full h-full"
                            style={{ borderRadius: "20px", backgroundColor: "#06283D", color: "white", padding: "2vw" }}
                            styles={{
                                body: {
                                    height: "100%",
                                },
                            }}
                        >
                            <div className="w-full h-full flex flex-col justify-between items-center">
                                <div
                                    key={currentSlide}
                                    className="flex text-[1.5vw] order-first gap-2 items-center justify-center w-full"
                                    style={{ animation: "fadeSlideIn 0.4s ease-out" }}
                                >
                                    <p>{slides[currentSlide].name}</p>
                                    <p className="">•</p>
                                    <p className="text-gray-500">{slides[currentSlide].subject}</p>
                                </div>

                                <p
                                    key={`desc-${currentSlide}`}
                                    className="text-center text-[2vw]"
                                    style={{ animation: "fadeSlideIn 0.4s ease-out 0.1s both" }}
                                >
                                    "{slides[currentSlide].description}"
                                </p>

                                <div className="flex order-last">
                                    <Button
                                        onClick={prevSlide}
                                        className="mr-3 transition-transform duration-200 hover:scale-110 active:scale-95"
                                        style={{ width: "3.5vw", height: "3.5vw", borderRadius: "50%" }}
                                        type="primary"
                                        icon={<ArrowLeftOutlined />}
                                    />

                                    <Button
                                        onClick={nextSlide}
                                        className="mr-3 transition-transform duration-200 hover:scale-110 active:scale-95"
                                        style={{ width: "3.5vw", height: "3.5vw", borderRadius: "50%" }}
                                        type="primary"
                                        icon={<ArrowRightOutlined />}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="ml-5 w-[70%] rounded-[20px] h-full overflow-hidden">
                        <Image
                            src={testimonialPic}
                            alt="workflow pic"
                            className="w-full h-full object-cover"
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
                        onClick={() => handleCardClick(1)}
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
                        onClick={() => handleCardClick(4)}
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
                        onClick={() => handleCardClick(2)}
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
                        onClick={() => handleCardClick(5)}
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
                        onClick={() => handleCardClick(3)}
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

export { GreetingSection, CourseDisplaySection, FooterSection, FunctionSection, WorkFlowSection, TestimonialSection, QASection };