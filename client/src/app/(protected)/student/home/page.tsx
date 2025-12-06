'use client';
import '@ant-design/v5-patch-for-react-19';

import { FooterSection } from "@/components/guest/ui/guest";

import { StudentGreetingSection } from "@/components/student/greeting";
import { LearningProgressSection } from "@/components/student/learning-progress";
import { CourseDisplaySection } from "@/components/student/course-display";
import { QASection } from "@/components/student/qna";
import {LearningPathSection} from "@/components/student/learning-path";

export default function StudentHomePage() {
    return(
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <StudentGreetingSection
                title = "Công việc hôm nay"
                isCourse = {false}
                description = "Hãy kiểm tra thời gian biểu của bạn để hoàn thành công việc đúng hạn nhé!"
                buttonText = "Thời gian biểu"
            />
            <LearningProgressSection />
            <FooterSection hasRegisterBox = {false}/> 
        </main>
    )
}
 