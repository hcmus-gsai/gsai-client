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
                                <Image src={Epis} alt="Epis" width={0} height={0}
                                    className="object-cover"
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
                                items={[
                                    {
                                        key: "homepage", label: <div className="!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center px-3">
                                            <span onClick={() => router.push("/student/home")} className="cursor-pointer text-[var(--color-primary)] font-bold">Trang chủ</span>
                                        </div>
                                    },
                                    {
                                        key: "courses", label: <div className="!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center">
                                            <span onClick={() => router.push("/student/courses")} className="cursor-pointer text-[var(--color-primary)] font-bold">Môn học</span>
                                        </div>
                                    },
                                    {
                                        key: "about", label: <div className="!text-[var(--color-primary)] !text-[1rem] flex items-center justify-center ">
                                            <span onClick={() => router.push("/student/about")} className="cursor-pointer text-[var(--color-primary)] font-bold">Về Epis</span>
                                        </div>
                                    }
                                ]}
                                className="!w-full !flex !items-center !justify-start !border-none"
                                style={{
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </ConfigProvider>
                    </div>
                    <div className="flex items-center justify-center w-[22.75rem] h-full">
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
                                <Image src={SearchIcon} alt="Search Icon" width={0} height={0}
                                    className="object-cover !w-[1.5rem] !h-[1.5rem]"
                                />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end w-full h-[3.5rem]">
                    <div className="flex items-center justify-center w-[3.5rem] h-full">
                        <Image src={NotificationIcon} alt="Notification Icon" width={0} height={0}
                            className="object-cover !w-[1.5rem] !h-[1.5rem]"
                        />
                    </div>

                    <div className="flex items-center justify-center w-[3.5rem] h-full" style={{}}>
                        <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft" overlayStyle={{ minWidth: "6rem" }}>
                            <Button
                                className="!h-[3.5rem] !w-[3.5rem] !rounded-full !border-none !flex !items-center !justify-center"
                            >
                                <Image src={UserIcon} alt="User Icon" width={0} height={0}
                                    className="!w-[1.5rem] !h-[1.5rem]"
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
