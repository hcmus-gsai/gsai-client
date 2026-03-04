'use client';
import '@ant-design/v5-patch-for-react-19';

import { StudentGreetingSection } from "@/components/student/greeting";
import { LearningProgressSection } from "@/components/student/learning-progress";
import { CourseDisplaySection } from "@/components/student/course-display";
import { QASection } from "@/components/student/qna";
import {LearningPathSection} from "@/components/student/learning-path";

import { useState, useEffect } from 'react';

export default function TeacherHomePage() {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])
    return(
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <StudentGreetingSection
                title = "Xin chào A"
                isCourse = {false}
                description = "Hãy kiểm tra thời gian biểu của bạn để hoàn thành công việc đúng hạn nhé!"
                buttonText = "Quá trình học"
            />
            <LearningProgressSection />
            {/* <FooterSection hasRegisterBox = {false}/>  */}
        </main>
    )
}
 