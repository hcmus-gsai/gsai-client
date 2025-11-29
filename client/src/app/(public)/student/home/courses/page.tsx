'use client';

import { CourseDisplaySection } from "@/components/student/course-display";
import { LearningPathSection } from "@/components/student/learning-path";
import { CourseCategorySection } from "@/components/student/course-category";
import { FooterSection } from "@/components/guest/ui/guest";
import { QASection } from "@/components/student/qna";

export default function StudentCourseListPage() {

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <CourseCategorySection/>
            <LearningPathSection />
            <CourseDisplaySection title = "Môn học phổ biến hiện nay"/>
            <CourseDisplaySection title = "Môn học dành riêng cho bạn"/>
            <CourseDisplaySection title = "Trải nghiệm các khóa học miễn phí"/>
            <QASection />
            <FooterSection hasRegisterBox = {false}/> 
        </main>
    )
}
