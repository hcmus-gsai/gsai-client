'use client';
import '@ant-design/v5-patch-for-react-19';

import { FooterSection } from "@/components/guest/ui/guest";
import { TeacherGreetingSection } from "@/components/teacher/greeting";
import { CourseDisplaySection } from "@/components/teacher/course-display";
import { StatisticBoxSection } from "@/components/teacher/statistic-box";

import { useState, useEffect } from 'react';
import { SubmissionHistorySection } from '@/components/teacher/submission-history';
import { useGetUserProfileQuery } from '@/store/api/[module]/userApi';

export default function TeacherHomePage() {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    const { data: profile } = useGetUserProfileQuery();

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <TeacherGreetingSection
                title={`Xin chào, ${profile?.full_name}!`}
                isCourse={false}
                description="Chào mừng bạn đến với EPIS. Tại đây, bạn có thể quản lý các khóa học, theo dõi tiến trình học tập của học sinh và tạo ra những trải nghiệm học tập tuyệt vời."
                buttonText="Tạo khóa học mới"
            />
            <StatisticBoxSection />
            <SubmissionHistorySection title="Lịch sử nộp bài" type="submission" />
            <SubmissionHistorySection title="Lịch sử tác vụ AI" type="ai_task" />
            <CourseDisplaySection title="Môn học đã tạo" isActive={true} />
        </main>
    )
}
