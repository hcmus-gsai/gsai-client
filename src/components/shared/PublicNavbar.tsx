'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import WhiteEpisLogo from "../../../public/student/WhiteEpisLogo.svg";

export const PublicNavbar = () => {
    const router = useRouter();
    const path = usePathname();

    return (
        <div className="w-full h-[4.25rem] bg-primary/70 flex justify-center items-center fixed top-0 z-50 backdrop-blur-sm">
            <div className="flex w-[var(--global-width)] items-center justify-between h-[4.8125rem] ">
                <div className="flex items-center justify-start gap-15">
                    <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>
                        <Image src={WhiteEpisLogo} alt="Epis Logo" width={0} height={0} className="w-full h-full object-cover" />
                    </div>

                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={[path === "/student" ? "student" : path === "/teacher" ? "teacher" : path === "/about" ? "about-us" : ""]}
                        selectedKeys={[path === "/student" ? "student" : path === "/teacher" ? "teacher" : path === "/about" ? "about-us" : ""]}
                        items={[
                            {
                                key: "student",
                                label:
                                    <Link
                                        href="/student"
                                        className={`!text-white !text-[1rem]`}
                                    >
                                        Học sinh
                                    </Link>
                            },
                            {
                                key: "teacher",
                                label:
                                    <Link
                                        href="/teacher"
                                        className={`!text-white !text-[1rem]`}
                                    >
                                        Giáo viên
                                    </Link>
                            },
                            {
                                key: "about-us",
                                label:
                                    <Link
                                        href="/about"
                                        className={`!text-white !text-[1rem]`}
                                    >
                                        Về Epis
                                    </Link>
                            }
                        ]}
                        className="
                            bg-transparent border-b-0 w-[400px]
                            [&_.ant-menu-item]:!text-white !gap-2
                            [&_.ant-menu-item::after]:!border-b-0
                            [&_.ant-menu-item-selected::after]:!border-b-0
                            [&_.ant-menu-item-selected]:font-bold
                            [&_.ant-menu-item:hover]:!border-b-[2px]
                        "
                        style={{
                            backgroundColor: 'transparent',
                            borderBottom: 'none'
                        }}
                    />
                </div>
                <div className="flex flex-1 items-center justify-end gap-2">
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            type="primary"
                            className={`!w-[10.5rem] !h-[3rem] !rounded-full !flex !items-center !justify-center !bg-transparent`}
                            style={{ border: `1px solid white` }}
                            onClick={() => router.push("/auth/signin")}
                        >
                            <div className="mr-auto flex items-center justify-center relative w-[calc(100%-3rem)] left-[0.5rem]">
                                <span className={`text-[1rem] !text-white`}>Tham gia ngay</span>
                            </div>

                            <div className={`ml-auto flex items-center justify-center w-[2.5rem] h-[2.5rem]  rounded-full relative right-[-0.75rem]`} style={{ backgroundColor: `white` }}>
                                <span className="flex items-center justify-center rounded-full p-2 w-full h-full">
                                    <ArrowRightOutlined className={`!-rotate-45 !text-[var(--color-secondary)]`} />
                                </span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
