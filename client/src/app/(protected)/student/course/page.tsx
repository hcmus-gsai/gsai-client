'use client';
import '@ant-design/v5-patch-for-react-19';
import Image from 'next/image';

import { FooterSection } from "@/components/guest/ui/guest";

import { CourseDisplaySection } from "@/components/student/course-display";
import { LearningPathSection } from "@/components/student/learning-path";
import { TagDisplaySession } from "@/components/student/tag-display";
import AbstractTop from "@/../public/student/AbstractTop.svg";
import AbstractNCurve from "@/../public/student/AbstractNCurve.svg";    


export default function StudentHomePage() {
    return(

        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <section className = "w-full flex flex-col">
                <Image src = {AbstractTop} alt = "Curve Space Top" width = {0} height = {0}
                    className = " top-0 left-0 w-full h-auto z-[0]"
                />
                
                <div className="w-full absolute top-0 left-0 z-[-1]">
                    <Image 
                        src = {AbstractNCurve} alt = "Curve Space Middle" width = {0} height = {0}
                        className = "w-full h-auto"
                    />
                    <TagDisplaySession/>
                
                </div>
                
            </section>
            
            <CourseDisplaySection title = "Môn học đã xem gần đây" hasExtended = {true}/>
            <CourseDisplaySection title = "Môn học phổ biến hiện nay"/>
            <CourseDisplaySection title = "Môn học dành riêng cho bạn"/>
            <LearningPathSection />
            <CourseDisplaySection title = "Trải nghiệm các khóa học miễn phí"/>
            <FooterSection hasRegisterBox = {false}/> 
            
        </main>
    )
}
 