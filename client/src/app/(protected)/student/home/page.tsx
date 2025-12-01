'use client';
import '@ant-design/v5-patch-for-react-19';

import { FooterSection } from "@/components/guest/ui/guest";

import { StudentGreetingSection } from "@/components/student/greeting";
import { LearningProgressSection } from "@/components/student/learning-progress";


export default function StudentHomePage() {
    return(
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <StudentGreetingSection
                title = "Công việc hôm nay"
                description = "Hãy kiểm tra thời gian biểu của bạn để hoàn thành công việc đúng hạn nhé!"
                buttonText = "Thời gian biểu"
            />
            <LearningProgressSection />
            <FooterSection hasRegisterBox = {false}/> 
        </main>
    )
}
 