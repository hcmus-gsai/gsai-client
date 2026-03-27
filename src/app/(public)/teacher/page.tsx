"use client";
import '@ant-design/v5-patch-for-react-19';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GreetingSection, FunctionSection, WorkFlowSection, TestimonialSection, QASection, FooterSection } from "@/components/guest/ui/guest";

import GradientTopLeft from "@/../public/guest/gradient_top_left.svg";
import GradientTopRight from "@/../public/guest/gradient_top_right.svg";
import GradientBottomLeft from "@/../public/guest/gradient_bottom_left.svg";
import GradientBottomRight from "@/../public/guest/gradient_bottom_right.svg";
import { DynamicNavbar, PublicNavbar } from '@/components/shared/PublicNavbar';

export default function TeacherLandingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isClient, setIsClient] = useState(false)
    const path = usePathname();
    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            {/* <PublicNavbar /> */}
            <DynamicNavbar/>
            <div className="relative">
                <div className="absolute top-0 left-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientTopLeft}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
                <div className="absolute top-0 right-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientTopRight}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            </div>

            <GreetingSection />
            {/* <FunctionSection
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
            /> */}
            <WorkFlowSection role="teacher" />
            {/* <TestimonialSection /> */}
            {/* <QASection /> */}
            <FooterSection />

            <div className="relative">
                <div className="absolute bottom-0 left-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientBottomLeft}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>

                <div className="absolute bottom-0 right-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientBottomRight}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            </div>
        </main>
    );
}