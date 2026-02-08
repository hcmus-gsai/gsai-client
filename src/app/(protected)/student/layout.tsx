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

import { useAppDispatch, useAppSelector } from '@/store/hook';
import { selectNotifications, removeNotification, clearNotifications } from '@/store/slice/notifySlice';
import { useGetUserAvatarQuery } from '@/store/api/[module]/userApi';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { baseApi } from '@/store/api/baseApi';


const StudentNavbar = () => {

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Hook definition
    const router = useRouter();
    const pathname = usePathname();

    const [isMounted, setIsMounted] = useState(false);
    const selectedKey = pathname.startsWith("/student/home") ? "homepage" :
        pathname.startsWith("/student/courses") ? "courses" :
            pathname.startsWith("/student/about") ? "about" : "";

    const dispatch = useAppDispatch();
    const notifications = useAppSelector(selectNotifications);
    const { data: user } = useGetUserAvatarQuery();
    const avatar_url = user?.avatar_url;

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

        dispatch(baseApi.util.resetApiState());

        // 3. Chuyển trang (nếu cần thiết, hoặc để RTK tự xử lý)
        // router.push('/auth/signin');
        window.location.href = '/auth/signin';
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
                <span onClick={() => router.push("/student/learning-progress")}>Quá trình</span>
            )
        },
        {
            key: '3',
            label: (
                <span onClick={() => setShowLogoutModal(true)}>Đăng xuất</span>
            ),
        }
    ];

    const notificationItems: MenuProps['items'] = notifications.length > 0 ? [
        {
            key: 'header',
            label: (
                <div className="flex items-center justify-between px-2 py-1">
                    <span className="font-bold text-gray-800">Thông báo</span>
                    <span
                        className="text-blue-500 text-sm cursor-pointer hover:underline"
                        onClick={() => dispatch(clearNotifications())}
                    >
                        Xóa tất cả
                    </span>
                </div>
            ),
            disabled: true,
        },
        {
            type: 'divider' as const
        },
        ...notifications.map((noti) => ({
            key: noti.id,
            label: (
                <div className="flex items-start gap-2 py-1 min-w-[250px]">
                    <span className={`text-lg ${noti.type === 'success' ? 'text-green-500' :
                        noti.type === 'error' ? 'text-red-500' :
                            noti.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                        }`}>
                        {noti.type === 'success' ? <CheckCircleOutlined className="text-green-500" /> :
                            noti.type === 'error' ? <CloseCircleOutlined className="text-red-500" /> :
                                noti.type === 'warning' ? <ExclamationCircleOutlined className="text-yellow-500" /> :
                                    <InfoCircleOutlined className="text-blue-500" />}
                    </span>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{noti.message}</p>
                        {noti.description && (
                            <p className="text-gray-500 text-xs">{noti.description}</p>
                        )}
                    </div>
                    <span
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeNotification(noti.id));
                        }}
                    >
                        ✕
                    </span>
                </div>
            )
        }))
    ] : [
        {
            key: 'empty',
            label: (
                <div className="text-center text-gray-500 py-4 min-w-[200px]">
                    Không có thông báo nào
                </div>
            ),
            disabled: true,
        }
    ]

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
                                        itemPaddingInline: 10,
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
                                        label: <span>Trang chủ</span>
                                    },
                                    {
                                        key: "courses",
                                        label: <span>Môn học</span>
                                    },
                                    {
                                        key: "about",
                                        label: <span>Về Epis</span>
                                    }
                                ]}
                                className='!bg-transparent !border-none !w-full !flex !items-center !justify-start [&_.ant-menu-item]:!font-normal [&_.ant-menu-item]:!text-gray-700 [&_.ant-menu-item]:!relative [&_.ant-menu-item:hover]:!text-[var(--color-primary)] [&_.ant-menu-item-selected]:!text-[var(--color-primary)] [&_.ant-menu-item-selected]:!font-semibold [&_.ant-menu-item:hover]:[text-shadow:0_0_0.75px_var(--color-primary)] [&_.ant-menu-item::after]:!content-[""] [&_.ant-menu-item::after]:!absolute [&_.ant-menu-item::after]:!bottom-0 [&_.ant-menu-item::after]:!left-0 [&_.ant-menu-item::after]:!h-[2px] [&_.ant-menu-item::after]:!w-full [&_.ant-menu-item::after]:!bg-[var(--color-secondary)] [&_.ant-menu-item::after]:!origin-center [&_.ant-menu-item::after]:!scale-x-0 [&_.ant-menu-item::after]:!transition-transform [&_.ant-menu-item::after]:!duration-500 [&_.ant-menu-item::after]:!ease-in-out [&_.ant-menu-item::after]:!border-none [&_.ant-menu-item:hover::after]:!scale-x-[80%] [&_.ant-menu-item-selected::after]:!scale-x-[80%]'
                            />

                        </ConfigProvider>
                    </div>
                    <CourseSearch />
                </div>
                <div className="flex items-center justify-end w-full h-[3.5rem]">
                    <div className="flex items-center justify-center w-[3.5rem] h-full" style={{}}>
                        <Dropdown
                            menu={{ items: notificationItems }}
                            trigger={['click']}
                            placement="bottomRight"
                            overlayStyle={{ minWidth: "280px", maxHeight: "400px", overflow: "auto" }}
                        >
                            <Button className="!h-[3.5rem] !w-[3.5rem] !rounded-full !border-none !flex !items-center !justify-center !relative">
                                <Image src={NotificationIcon} alt="Notification Icon" width={24} height={24}
                                    className="object-cover !w-[1.5rem] !h-auto"
                                />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notifications.length > 5 ? '5+' : notifications.length}
                                    </span>
                                )}
                            </Button>
                        </Dropdown>
                    </div>

                    <div className="flex items-center justify-center w-[3.5rem] h-full" style={{}}>
                        <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft" overlayStyle={{ minWidth: "6rem" }}>
                            <Button
                                className="!h-[3.5rem] !w-[3.5rem] !rounded-full !border-none !flex !items-center !justify-center"
                            >
                                {avatar_url ? (
                                    <Image src={avatar_url} alt="User Icon" width={24} height={24}
                                        className="absolute w-[85%] h-[85%] object-cover rounded-full cursor-pointer"
                                    />
                                ) : (
                                    <Image src={UserIcon} alt="User Icon" width={24} height={24}
                                        className="!w-[1.5rem] !h-auto"
                                    />
                                )}
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>
            {showLogoutModal && (
                <ConfirmationModal
                    onCancel={() => setShowLogoutModal(false)}
                    onConfirm={handleLogout}
                />
            )}
        </nav>
    )

}

type Props = {
    onCancel: () => void;
    onConfirm: () => void;
};

function ConfirmationModal({ onCancel, onConfirm }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blur background */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Pop up */}
            <div className="relative flex flex-col items-center justify-center
                      bg-white rounded-xl shadow-xl
                      w-[480px] h-[200px] px-6 text-center">
                <h2 className="text-lg font-semibold mb-2">Đăng xuất</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Bạn có chắc muốn đăng xuất không?
                </p>

                <div className="flex justify-end gap-3">
                    <Button
                        className="!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-secondary)] !bg-[var(--color-bg-white)] !border-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-bg-white)] hover:!bg-[var(--color-secondary)]"
                        onClick={onCancel}
                    >
                        Hủy
                    </Button>

                    <Button
                        className="!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                        onClick={onConfirm}
                    >
                        Đăng xuất
                    </Button>
                </div>
            </div>
        </div>

    );
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
