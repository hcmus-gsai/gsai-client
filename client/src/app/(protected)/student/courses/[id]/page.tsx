'use client';
import '@ant-design/v5-patch-for-react-19';
import { StudentGreetingSection } from "@/components/student/greeting";
import {useRouter} from "next/navigation";
import Image from "next/image";
import { CourseDisplaySection } from "@/components/student/course-display";

import {Card, Button} from "antd";
import { QASection } from "@/components/student/qna";
import {FooterSection} from "@/components/guest/ui/guest";
import { useParams, notFound } from "next/navigation";
import {useGetAllEnrollmentsQuery } from "@/store/api/[module]/enrollmentApi";
import {useGetCourseByIdQuery} from "@/store/api/[module]/courseApi";
// import {useGetProfileQuery} from "@/store/api/[module]/userApi";

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
    //Duc code here
    // const { category } = await params;

    // if (!VALID_CATEGORIES.includes(params.category)) {
    //     notFound(); // Hàm này sẽ lập tức trả về trang 404
    // }

    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className = "w-[var(--global-width)] h-full flex items-center justify-center flex flex-col gap-[3rem]">
                <div className = "w-full">
                    <div><p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">Bạn sẽ học được</p></div>
                    <div className = "w-full grid grid-cols-2 grid-rows-2 gap-2">
                        {achievableKnowledge.slice(0,4).map((knowledge) => (
                            <Card key = {knowledge.title} className = "!pr-[1.5rem] !border-gray-200 hover:shadow-[10px_10px_10px_var(--color-neutral)] transition-all duration-300 !rounded-[20px]">
                                <p className = "text-[1.25rem] font-bold text-[var(--color-primary)]">{knowledge.title}</p>
                                <p className = "text-[1rem] font-light text-[var(--color-primary)]">{knowledge.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className = "w-full">
                    <div><p className = "text-[1.5rem] font-bold text-[var(--color-primary)] mb-[1rem]">Kỹ năng bạn sẽ học được</p></div>
                      
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


export default function StudentCoursePage() {



    const {id} = useParams();
    const {data: courseInfo, isLoading, error} = useGetCourseByIdQuery(id as string);
    const courseData = courseInfo?.data;

    // console.log('This is course data: ', courseData);
    // const {data: enrollmentsCourse, isLoading, error} = useGetAllEnrollmentsQuery();
    
    // Tìm course từ enrollments dựa trên course id từ URL
    // const course = enrollmentsCourse?.data?.find((c) => c.id === id);
    //Get teacher name from teacher id




    
    return(
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <StudentGreetingSection
                title = {courseData?.course_name || ""}
                titleSize = "text-[2.5rem]"
                description = {courseData?.course_description || ""}
                buttonText = "Tham gia ngay"
                isCourse = {true}
                hasTopGradient = {false}
                hasCurveSpace = {false}
            />
            <CourseSyllabusSection />

            <CourseDisplaySection 
                title = "Môn học tương tự"
            />
            <QASection />
            <FooterSection hasRegisterBox = {false}/>
        </main>
    )

}