'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, Button } from "antd";
import { ArrowRightOutlined, MenuOutlined,CloseOutlined   } from "@ant-design/icons";
import WhiteEpisLogo from "../../../public/student/WhiteEpisLogo.svg";
import {useState} from 'react';

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


export const DynamicNavbar = () => {
    
    const nav_items = [
        {key: "student",href:"/student" , label: "Học sinh"},
        {key: "teacher" , href: "/teacher", label: "Giáo viên"},
        {key: "about-us", href :"/about", label: "Về Epis"}
    ]

    const router = useRouter();
    const path = usePathname();

    const [open, setOpen] = useState(false);

    const activeKey = path === "/student" ? "student" : path === "/teacher" ? "teacher" : path === "/about" ? "about-us": ""
    return (
        <>
        <header className="w-full h-[4.25rem] bg-primary flex justify-center items-center fixed top-0 z-50 backdrop-blur-sm">
            <div className = "flex w-full max-w-[var(--global-width)] px-4 sm:px-6 items-center justify-between h-full">
                <div className = "flex items-center gap-8">
                    <div
                        className = "cursor-pointer flex-shrink-0"
                        onClick = {() => router.push("/")}
                    >
                        <Image src={WhiteEpisLogo} alt="Epis Logo" width={0} height={0} className="w-auto h-8 object-contain"/>
                    </div>

                    <nav className = "hidden md:flex items-center gap-1">
                        {
                            nav_items.map(({key, href, label}) => (
                                <Link
                                    key={key}
                                    href={href}
                                    className={`
                                        text-white text-[1rem] px-3 py-1.5 rounded-md
                                        transition-colors hover:bg-white/15
                                        ${activeKey === key ? "font-bold bg-white/10" : ""}
                                    `}
                                >
                                    {label}
                                </Link>
                        ))}
                    </nav>
                </div>

                <div className = "flex items-center gap-3">
                    <button
                        className="hidden md:flex items-center w-46 h-[3rem] rounded-full border border-white bg-transparent hover:bg-white/10 transition-colors pr-1 pl-4"
                        onClick = {()=>router.push("/auth/signin")}
                    >
                        <span className="flex-1 text-white text-[1rem] text-left">Tham gia ngay</span>
                        <span className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-white flex-shrink-0">
                            <ArrowRightOutlined className="!-rotate-45 !text-[var(--color-secondary)]" />
                        </span>
                    </button>

                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-white hover:bg-white/15 transition-colors"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                        >
                        {open ? <CloseOutlined className="text-[18px]" /> : <MenuOutlined className="text-[18px]" />}
                    </button>
                </div>
            </div>
        </header>
        <div
            className={`
            fixed top-[4.25rem] left-0 right-0 z-40 md:hidden
            bg-primary/95 backdrop-blur-md
            flex flex-col px-4 pb-5 gap-1
            transition-all duration-250 ease-out
            ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
            `}
        >
            {nav_items.map(({ key, href, label }) => (
            <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                text-white text-[1rem] px-4 py-3 rounded-lg
                transition-colors hover:bg-white/12
                ${activeKey === key ? "font-bold bg-white/8" : ""}
                `}
            >
                {label}
            </Link>
            ))}

            <div className="h-px bg-white/20 my-2" />

            <button
                className="flex items-center rounded-full border border-white bg-transparent hover:bg-white/10 transition-colors py-2 pl-5 pr-2 gap-3"
                onClick={() => { router.push("/auth/signin"); setOpen(false); }}
            >
                <span className="flex-1 text-white text-[1rem] text-left">Tham gia ngay</span>
                <span className="ml-auto flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-white flex-shrink-0">
                    <ArrowRightOutlined className="!-rotate-45 !text-[var(--color-secondary)]" />
                </span>
            </button>
        </div>

        {open && (
            <div
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setOpen(false)}
            />
        )}
        </>
    )
}
