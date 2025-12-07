'use client';
import '@ant-design/v5-patch-for-react-19';
import Image from 'next/image';

import { FooterSection } from "@/components/guest/ui/guest";

import { CourseDisplaySection } from "@/components/student/course-display";
import { LearningPathSection } from "@/components/student/learning-path";
import { TagDisplaySession } from "@/components/student/tag-display";
import { QASection } from "@/components/student/qna";

import AbstractTop from "@/../public/student/AbstractTop.svg";
import AbstractNCurve from "@/../public/student/AbstractNCurve.svg";    


export default function StudentHomePage() {
    return(

        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            
            <TagDisplaySession/>

            <LearningPathSection />
            <CourseDisplaySection title = "Môn học phổ biến hiện nay"/>
            <CourseDisplaySection title = "Môn học dành riêng cho bạn"/>
            <CourseDisplaySection title = "Trải nghiệm các khóa học miễn phí"/>
            <QASection />

            <FooterSection hasRegisterBox = {false}/> 
            
        </main>
    )
}
 