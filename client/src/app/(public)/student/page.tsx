// src/app/(public)/student/page.tsx

"use client";
import '@ant-design/v5-patch-for-react-19';

import { useState, useEffect } from "react";
import Image from "next/image";
import { GreetingSection, FunctionSection, WorkFlowSection, CourseDisplaySection, FooterSection } from "@/components/guest/ui/guest";
import Link from "next/link";
import GradientTopLeft from "@/../public/guest/gradient_top_left.svg";
import GradientTopRight from "@/../public/guest/gradient_top_right.svg";
import GradientBottomLeft from "@/../public/guest/gradient_bottom_left.svg";
import GradientBottomRight from "@/../public/guest/gradient_bottom_right.svg";

export default function StudentLandingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <nav className="flex flex-col items-center bg-primary h-10 text-white">
                <div className="w-[78%] flex h-full items-center justify-between">
                    <div>
                        <Link href="/student" className="mr-15 text-white">
                            Học sinh
                        </Link>
                        <Link href="/teacher" className="text-white">
                            Giáo viên
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="relative">
                <div className="absolute top-0 left-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientTopLeft}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        priority
                    />
                </div>
                <div className="absolute top-0 right-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientTopRight}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        priority
                    />
                </div>
            </div>

            <GreetingSection />
            <FunctionSection
                title="Khám phá các chức năng dành cho học sinh"
                firstBlock={{
                    title: "Học tập thông minh",
                    subtext: "Sử dụng AI để hỗ trợ việc học tập và nghiên cứu của bạn.",
                    button: "Tìm hiểu thêm",
                }}
                secondBlock={{
                    title: "Học tập thông minh",
                    subtext: "Sử dụng AI để hỗ trợ việc học tập và nghiên cứu của bạn.",
                    button: "Tìm hiểu thêm",
                }}
                thirdBlock={{
                    title: "Học tập thông minh",
                    subtext: "Sử dụng AI để hỗ trợ việc học tập và nghiên cứu của bạn.",
                    button: "Tìm hiểu thêm",
                }}
                fourthBlock={{
                    title: "Học tập thông minh",
                    subtext: "Sử dụng AI để hỗ trợ việc học tập và nghiên cứu của bạn.",
                    button: "Tìm hiểu thêm",
                }}
            />
            <WorkFlowSection />
            <CourseDisplaySection />
            <FooterSection />

            <div className="relative">
                <div className="absolute bottom-0 left-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientBottomLeft}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        priority
                    />
                </div>

                <div className="absolute bottom-0 right-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientBottomRight}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        priority
                    />
                </div>
            </div>
        </main>
    );
}
