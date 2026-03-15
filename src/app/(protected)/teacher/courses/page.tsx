'use client';

import '@ant-design/v5-patch-for-react-19';
import { FooterSection } from "@/components/guest/ui/guest";
import { CourseDisplaySection } from "@/components/teacher/course-display";
import { useState, useEffect } from 'react';
import { Button } from 'antd';

export default function TeacherCoursesPage() {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <section className="w-full flex flex-col items-center justify-center mt-[5rem] mb-[10rem]">
            <div className="flex items-center justify-between w-[var(--global-width)] px-4 mt-[2.5rem]">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-[var(--color-primary)]">Môn học đã tạo</h1>

                <Button
                    className="!w-[178px] !h-[54px] !bg-[var(--color-neutral)] !rounded-full !border-none !text-[var(--color-secondary)] !p-2 !text-md !font-medium hover:!bg-[var(--color-secondary)] hover:!text-white transition-colors duration-300"
                    href="/teacher/create-class?fresh=1"
                >
                    Tạo môn học
                </Button>
            </div>
            <CourseDisplaySection title="" isActive={true} sectionClassName="w-full min-h-0 flex flex-col items-center mt-[1.25rem]" />

            <div className="flex items-center w-[var(--global-width)] px-4 mt-[3rem]">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-[var(--color-primary)]">Môn học đang tạo</h1>
            </div>
            <CourseDisplaySection title="" isActive={false} sectionClassName="w-full min-h-0 flex flex-col items-center mt-[1.25rem]" />
            
        </section>
    )
}
