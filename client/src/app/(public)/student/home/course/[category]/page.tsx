'use client';
import '@ant-design/v5-patch-for-react-19';
import { StudentGreetingSection } from "@/components/student/greeting";
import {useRouter} from "next/navigation";
import Image from "next/image";
import { CourseDisplaySection } from "@/components/student/course-display";

import {Card, Button} from "antd";
import { QASection } from "@/components/student/qna";
import {FooterSection} from "@/components/guest/ui/guest";
const CourseSyllabusSection = () => {
    const achievableKnowledge = [
        {
            title:'Mô hình hóa toán học',
            description: 'Xây dựng mô hình giúp mô phỏng và dự đoán các hiện tượng trong đời sống, kinh tế và kỹ thuật.'
        },
        {
            title:'Ứng dụng công nghệ trong phân tích dữ liệu',
            description: 'Sử dụng phần mềm PowerBI và ngôn ngữ lập trình Python để trực quan hóa và phân tích số liệu hiệu quả.'
        },
        {
            title:'Xác suất và thống kê suy luận',
            description: 'Nắm vững công cụ để đưa ra kết luận, dự báo và ra quyết định dựa trên dữ liệu.'
        },
        {
            title:'Phân tích và xử lý dữ liệu',
            description: 'Hiểu cách thu thập, sắp xếp, làm sạch và diễn giải dữ liệu thực tế.'
        }
    ]

    const achievableSkills = [
        'Python',
        'Trực quan hóa',
        'PowerBI',
        'Excel',
        'Toán ứng dụng',
        'Scikit-learn',
        'Thống kê'
    ]

    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className = "w-[calc(100%-24rem)] h-full flex items-center justify-center flex flex-col gap-[3rem]">
                <div className = "w-full">
                    <div><p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">Bạn sẽ học được</p></div>
                    
                    <div className = "w-full grid grid-cols-2 grid-rows-2 gap-2">
                        {achievableKnowledge.slice(0,4).map((knowledge) => (
                            <Card key = {knowledge.title} className = "border-gray-600 shadow-[5px_5px_20px_var(--color-neutral)] hover:shadow-[5px_5px_20px_var(--color-secondary)] transition-all duration-300 !rounded-[20px]">
                                <p className = "text-[1.25rem] font-bold text-[var(--color-primary)]">{knowledge.title}</p>
                                <p className = "text-[1rem] font-light text-[var(--color-primary)]">{knowledge.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className = "w-full">
                    <div><p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">Bạn sẽ học được</p></div>
                      
                    <div className = "w-full flex items-center justify-start gap-2">
                        {achievableSkills.map((skill) => (
                            <div key = {skill} className = "w-[145px] h-[32px] bg-blue-200 flex items-center justify-center rounded-full">
                                <p className = "text-[1rem] text-[var(--color-secondary)]">{skill}</p>
                            </div>
                        ))}
                    </div>
                </div>  
            </div>
        </section>
    )
}

const CourseHighLight = () => {
    
    return (
        <div className = "absolute top-[30rem] right-[12rem] w-[calc(100%-24rem)] h-[10.625rem] bg-white shadow-[5px_5px_20px_var(--color-neutral)] rounded-[20px]  border-2 border-gray-200 flex items-center justify-center gap-2 pl-[1.5rem]">
           
            <div className = "flex flex-col items-start justify-start w-[21%] h-[54%] mr-auto">
                <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Khóa học miễn phí</p>
                <p className = "text-[1rem] font-light text-[var(--color-primary)]">Mở rộng kỹ năng của bạn hoàn toàn miễn phí</p>
            </div>

            <div className = "flex flex-col items-start justify-start  w-[21%] h-[54%]">
                <p className = "text-[1rem] font-bold text-[var(--color-primary)]">5 đánh giá</p>
                <p className = "text-[1rem] font-light text-[var(--color-primary)]">5 đánh giá</p>
            </div>
            
            <div className = "flex flex-col items-start justify-start w-[21%] h-[54%]">
                <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Trình độ đề xuất</p>
                <p className = "text-[1rem] font-light text-[var(--color-primary)]">Trình độ đề xuất</p>
            </div>
            
            <div className = "flex flex-col items-start justify-start w-[21%] h-[54%] ml-auto">
                <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Lịch trình linh hoạt</p>
                <p className = "text-[1rem] font-light text-[var(--color-primary)]">Hoản thành 5 giờ học mỗi tuần</p>
            </div>
        </div>
    )
}
export default function StudentCoursePage() {

    return(
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <StudentGreetingSection
                title = "Toán ứng dụng & thống kê"
                description = "Lĩnh vực kết nối giữa toán học và thế giới thực, giúp phân tích dữ liệu, mô hình hóa hiện tượng và đưa ra quyết định chính xác. Ngành này đóng vai trò quan trọng trong khoa học, kinh tế, công nghệ và trí tuệ nhân tạo, nơi mọi con số đều có ý nghĩa và giá trị ứng dụng cao."
                buttonText = "Tham gia ngay"
                isCourse = {true}
                hasTopGradient = {false}
                hasCurveSpace = {false}
            />
            <CourseSyllabusSection />
            <CourseHighLight />

            <CourseDisplaySection 
                title = "Môn học tương tự"
            />
            <QASection />
            <FooterSection hasRegisterBox = {false}/>
        </main>
    )

}