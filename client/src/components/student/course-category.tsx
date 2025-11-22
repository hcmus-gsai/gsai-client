import {Button} from "antd";
import Image from "next/image";
/*

import {StudentGreetingSection} from "@/components/student/greeting";

export default function StudentCourseCategoryPage() {

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <StudentGreetingSection
                title = "Toán ứng dụng & thống kê"
                description = "Lĩnh vực kết nối giữa toán học và thế giới thực, giúp phân tích dữ liệu, mô hình hóa hiện tượng và đưa ra quyết định chính xác. Ngành này đóng vai trò quan trọng trong khoa học, kinh tế, công nghệ và trí tuệ nhân tạo, nơi mọi con số đều có ý nghĩa và giá trị ứng dụng cao."
                isCourse = {true}
                buttonText = "Tham gia ngay"
                hasTopGradient = {false}
                hasMiddleGradient = {true}
                hasCurveSpace = {false}
            />
        </main>
    )
}


*/
const CourseCategorySection = () => {
    const learningCategory = [
        {
            id: 1,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 2,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 3,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 4,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 5,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 6,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 7,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 8,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 9,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 10,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
    ]

    
    return (
        <section className = "w-full h-[242px] flex flex-col items-center justify-between mt-[8rem]">   
            <div className = "h-full w-full flex flex-col items-center justify-between z-10 ml-[8rem]">
                <p className = "w-full text-left text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
            </div>
            <div className = "flex items-center justify-center w-full h-full z-10">
                <div className = "grid grid-rows-2 grid-cols-5 w-full">
                    {learningCategory.slice(0, 10).map((item) => (
                        <div key = {item.id} className = "flex items-center justify-center w-full h-[100px]">
                            <Button className = "!w-[16.875rem] !h-[3.5rem] !rounded-full !flex !items-center !justify-center">
                                <Image src = {item.image} alt = {item.name} width = {0} height = {0} className = "object-cover"/>
                                <p className = "text-[1rem] font-bold text-[var(--color-primary)]">{item.name}</p>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export {CourseCategorySection};
