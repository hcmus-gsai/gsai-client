'use client';
import '@ant-design/v5-patch-for-react-19';
import { Button } from "antd";

import { FooterSection } from "@/components/guest/ui/guest";
import { LearningPathSection } from "@/components/student/learning-path";
import { CourseGrid } from "@/components/shared/course-grid";

import { RightOutlined, LeftOutlined } from "@ant-design/icons";

import { useMemo, useState } from 'react';

import { useAppSelector } from "@/store/hook";
import { useSearchCoursesQuery } from "@/store/api/[module]/courseApi";

export const CategorySlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const title = useAppSelector(state => state.courseDisplay.title);

    //Load all the courses and filter by category
    const { data: searchCoursesData } = useSearchCoursesQuery({
        limit: 100,
        sortBy: 'created_at',
        sortOrder: 'ASC'
    })
    const courseData = searchCoursesData?.data || [];
    const courseDataWithCategory = useMemo(() => {
        if (!title) return courseData;

        const hasCategory = courseData.some((course) => course.category === title);

        return hasCategory ? courseData.filter((course) => course.category === title) : courseData;
    }, [courseData, title]);

    const slides = useMemo(() => {
        const size = 12;
        const chunks = [];

        for (let i = 0; i < courseDataWithCategory.length; i += size) {
            chunks.push(courseDataWithCategory.slice(i, i + size));
        }
        return chunks;
    }, [courseDataWithCategory]);

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
        <section className="w-full flex flex-col items-center justify-center relative mt-20 mb-20">
            <div className="w-[var(--global-width)] flex flex-col items-center justify-center">
                <h1 className="text-[2rem] md:text-[2.5rem] text-center md:text-left font-bold w-full text-[var(--color-primary)]">{title}</h1>
                <div className="w-full overflow-x-hidden py-4">
                    <div
                        className="flex transition-transform duration-500 ease-in-out w-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {slides.map((chunk, slideIndex) => (
                            <div key={slideIndex} className="w-full flex-shrink-0 px-2">
                                <CourseGrid
                                    courseData={chunk}
                                    colWidth={6}
                                    maxItems={12}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex justify-center gap-2">
                    <Button icon={<LeftOutlined />} onClick={prevSlide} className="!border-none !bg-transparent" />
                    {slides.map((_, index) => (
                        <Button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`!border-none h-2 rounded-full transition-all duration-300 ${currentSlide === index ? '!bg-[var(--color-primary)] !text-white' : ''}`}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button icon={<RightOutlined />} onClick={nextSlide} className="!border-none !bg-transparent" />
                </div>

            </div>
        </section>
    )
}
export default function CategoriesPage() {
    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <CategorySlider />
            {/* <CourseDisplaySection title = "Môn học phổ biến hiện nay"/> */}
            {/* <LearningPathSection /> */}
            <FooterSection hasRegisterBox={false} />
        </main>

    )

}