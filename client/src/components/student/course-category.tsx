import {Button} from "antd";
import { CourseCategoryComponent } from "./course-category-props"
import Image from "next/image";

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
        {
            id: 11,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 12,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 13,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 14,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 15,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 16,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 17,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 18,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 19,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 20,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
    ]

    var columns = 6;
    
    return (
        <section className = "w-full min-h-[242px] grow flex flex-col items-center justify-between my-[8rem]">   
            <div className = "h-full w-[calc(100%-12rem)] flex flex-col items-center justify-between mb-[1rem]">
                <p className = "w-full text-left text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
            </div>
            <CourseCategoryComponent columns = {columns} categories = {learningCategory}/>
        </section>
    )
}

export {CourseCategorySection};
