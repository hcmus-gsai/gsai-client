'use client';
import '@ant-design/v5-patch-for-react-19';
import {Row, Col, Card, Carousel, Button} from "antd";

import { FooterSection } from "@/components/guest/ui/guest";
import { LearningPathSection } from "@/components/student/learning-path";
import { TagDisplaySession } from "@/components/student/tag-display";
import { CourseDisplaySection } from "@/components/student/course-display";

import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { useRouter } from "next/navigation";
import { RightOutlined, LeftOutlined, StarFilled } from "@ant-design/icons";

import {useMemo, useRef, useState} from 'react';
import { CarouselRef } from 'antd/es/carousel'; 
export const CategorySlider = () => {
    const router = useRouter();
    const carouselRef = useRef<CarouselRef>(null);
    const courseData = [
        {

            id: 1,
            name: 'Lập trình Web',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 2,
            name: 'Khoa học Dữ liệu',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 3,
            name: 'Trí tuệ Nhân tạo',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 4,
            name: 'Lập trình Mobile',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 5,
            name: 'Phân tích Hệ thống',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 6,
            name: 'Thiết kế UI/UX',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 7,
            name: 'An ninh Mạng',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 8,
            name: 'Điện toán Đám mây',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 9,
            name: 'Hệ thống phân tán',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 10,
            name: 'Công nghệ Blockchain',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 11,
            name: 'Hệ thống HPC',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 12,
            name: 'Hệ thống IoT',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 1,
            name: 'Lập trình Web',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 2,
            name: 'Khoa học Dữ liệu',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 3,
            name: 'Trí tuệ Nhân tạo',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 4,
            name: 'Lập trình Mobile',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 5,
            name: 'Phân tích Hệ thống',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 6,
            name: 'Thiết kế UI/UX',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 7,
            name: 'An ninh Mạng',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 8,
            name: 'Điện toán Đám mây',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 9,
            name: 'Hệ thống phân tán',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 10,
            name: 'Công nghệ Blockchain',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 11,
            name: 'Hệ thống HPC',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 12,
            name: 'Hệ thống IoT',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 13,
            name: 'Hệ thống IoT',
            image: '/images/learning-category-1.jpg'
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = useMemo(()=> {
        const size = 12;
        const chunks = [];

        for (let i = 0; i < courseData.length; i += size) {
            chunks.push(courseData.slice(i, i + size));
        }
        return chunks;
    }, [courseData]);
    
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));    
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));    
    }
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section className = "w-full flex flex-col items-center justify-center relative mt-20 mb-20">
            <div className = "w-[var(--global-width)] flex flex-col items-center justify-center">
                <h1 className = "text-[2.5rem] font-bold w-full text-[var(--color-primary)]">Môn học phổ biến hiện nay</h1>
                <div className="w-full overflow-x-hidden py-4">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out w-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {slides.map((chunk, slideIndex) => (
                            <div key={slideIndex} className="w-full flex-shrink-0 px-2">
                                <Row gutter={[16, 16]} className="w-full mx-auto">
                                    {chunk.map((c, index) => (
                                        <Col span={6} key={c.id} className="!flex !items-center !justify-center">
                                            <Card 
                                                className="w-full px-[1rem] py-[1.5rem] hover:shadow-[5px_5px_20px_var(--color-neutral)] hover:scale-105 transition-all duration-300 cursor-pointer !rounded-[24px]"
                                                onClick={() => router.push(`/student/courses/${c.id}`)}
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <Image src={EmptyLayout} alt="img" width={0} height={0} className="w-full h-[150px] object-cover mb-2 rounded-md" />
                                                    <h3 className="text-[1.125rem] font-semibold text-center line-clamp-1">{c.name}</h3>
                                                    <p className="text-[0.875rem] font-light text-gray-600">Thời lượng: 10 giờ</p>
                                                    <div className="flex items-center justify-center">
                                                        <StarFilled className="!text-yellow-400"/>
                                                        <span className="ml-1 font-bold text-gray-600">5</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))}
                    </div>
                </div>

                
                <div className="flex justify-center gap-2">
                    <Button icon={<LeftOutlined />} onClick={prevSlide} className="!border-none !bg-transparent"/>

                    {slides.map((_, index) => (
                        <Button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`!border-none h-2 rounded-full transition-all duration-300`}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button icon={<RightOutlined />} onClick={nextSlide} className="!border-none !bg-transparent"/>
                </div>
            </div>
        </section>
    )
}
export default function CategoriesPage() {
    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <CategorySlider/>
            {/* <CourseDisplaySection title = "Môn học phổ biến hiện nay"/> */}
            <LearningPathSection/>
            <FooterSection hasRegisterBox = {false}/>
        </main>

    )

}