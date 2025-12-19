'use client';

import '@ant-design/v5-patch-for-react-19';
import React from "react";
import Image from "next/image";
import Epis from "@/../public/shared/EPIS.svg";
import SearchIcon from "@/../public/shared/SearchIcon.svg";
import UserIcon from "@/../public/shared/User.svg";
import NotificationIcon from "@/../public/shared/Notification.svg";
import type { MenuProps } from 'antd';
import { Menu, Input, Button, ConfigProvider, Dropdown } from "antd";
import { useRouter, usePathname } from "next/navigation";

import { useState, useEffect } from 'react';

import { useSignOutMutation } from '@/store/api/[module]/authApi';
import CourseSearch from '@/components/course/course-search';

const StudentNavbar = () => {
    // Hook definition
    const router = useRouter();
    const pathname = usePathname();

    const [isMounted, setIsMounted] = useState(false);
    const selectedKey = pathname.startsWith("/student/home") ? "homepage" :
    pathname.startsWith("/student/courses") ? "courses" :
    pathname.startsWith("/student/about") ? "about" :
    "";
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [signOut] = useSignOutMutation();

    if (!isMounted) {
        return null;
    }

    // Hook execution and API call
    const handleLogout = async () => {
        // 1. Lấy refresh token từ storage
        const refreshToken = localStorage.getItem('refreshToken');

        // 2. Gọi hàm signOut và truyền token vào
        // Dù refreshToken là null thì vẫn gọi để chạy logic onQueryStarted xóa dọn dẹp
        await signOut();

        // 3. Chuyển trang (nếu cần thiết, hoặc để RTK tự xử lý)
        router.push('/auth/signin');
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span onClick={() => router.push("/student/profile")}>Trang cá nhân</span>
            ),
        },
        {
            key: '2',
            label: (
                <span onClick={handleLogout}>Đăng xuất</span>
            ),
        },
        {
            key : '3',
            label : (
                <span onClick = {() => router.push("/student/learning-progress")}>Quá trình</span>
            )
        }
    ];

    return (
        <nav
            className="fixed top-0 left-0 right-0 w-full h-[5rem] flex items-center justify-center border-b border-gray-200 bg-white z-20"
        >
            <div className="w-[var(--global-width)] flex items-center justify-between">
                <div className="flex items-center justify-start w-full h-[3.5rem]">
                    <div className="flex items-center justify-start w-[32vw] h-full">
                        <div className="flex items-center justify-start w-[121px]">
                            <div className="h-[full] w-[121px]">
                                <Image src={Epis} alt="Epis" width={121} height={40}
                                    className="w-auto h-auto object-cover"
                                />
                            </div>
                        </div>

                        <ConfigProvider
                            theme={{
                                components: {
                                    Menu: {
                                        itemPaddingInline: 10,   // optional left/right padding
                                    },
                                },
                            }}
                        >
                            <Menu
                                mode="horizontal"
                                selectedKeys={[selectedKey]}
                                onClick={({ key }) => {
                                    if (key === "homepage") router.push("/student/home");
                                    else if (key === "courses") router.push("/student/courses");
                                    else if (key === "about") router.push("/student/about");
                                }}
                                items={[
                                    {
                                        key: "homepage", 
                                        label: <span className="text-[var(--color-primary)] font-bold">Trang chủ</span>
                                    },
                                    {
                                        key: "courses", 
                                        label: <span className="text-[var(--color-primary)] font-bold">Môn học</span>
                                    },
                                    {
                                        key: "about", 
                                        label: <span className="text-[var(--color-primary)] font-bold">Về Epis</span>
                                    }
                                ]}
                                className="!w-full !flex !items-center !justify-start !border-none"
                                style={{
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </ConfigProvider>
                    </div>
                    {/* <div className="flex items-center justify-center w-[22.75rem] h-full">
                        <div className="flex items-center justify-start w-[18.75rem] h-full">
                            <Input
                                placeholder="Tìm kiếm môn học ở đây..."
                                className="!h-full !w-full !bg-white !rounded-full !font-bold !text-[1rem]"
                            />
                        </div>
                        <div className="flex items-center justify-center w-[calc(100%-18.75rem)] h-full">
                            <Button
                                className="!h-[3.5rem] !w-[3.5rem] !bg-[var(--color-secondary)] !rounded-full !border-none !flex !items-center !justify-center"
                            >
                                <Image src={SearchIcon} alt="Search Icon" width={24} height={24}
                                    className="object-cover !w-[1.5rem] !h-auto"
                                />
                            </Button>
                        </div>
                    </div> */}
                    <CourseSearch />
                </div>
                <div className="flex items-center justify-end w-full h-[3.5rem]">
                    <div className="flex items-center justify-center w-[3.5rem] h-full">
                        <Image src={NotificationIcon} alt="Notification Icon" width={24} height={24}
                            className="object-cover !w-[1.5rem] !h-auto"
                        />
                    </div>

                    <div className="flex items-center justify-center w-[3.5rem] h-full" style={{}}>
                        <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft" overlayStyle={{ minWidth: "6rem" }}>
                            <Button
                                className="!h-[3.5rem] !w-[3.5rem] !rounded-full !border-none !flex !items-center !justify-center"
                            >
                                <Image src={UserIcon} alt="User Icon" width={24} height={24}
                                    className="!w-[1.5rem] !h-auto"
                                />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </nav>
    )

}
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        <div className="min-h-screen flex flex-col">
            <StudentNavbar />
            <main className="flex-1">{children}</main>
        </div>
    )
}
