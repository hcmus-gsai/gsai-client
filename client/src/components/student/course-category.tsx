import {Button} from "antd";
import { CourseCategoryComponent } from "./course-category-props"
import Image from "next/image";

const CourseCategorySection = () => {
    const learningCategory = [
        {
            id: 1,
            name: 'Lập trình',
            image: '/guest/Cate_1.svg'
        },
        {
            id: 2,
            name: 'Lập trình',
            image: '/guest/Cate_2.svg'
        },
        {
            id: 3,
            name: 'Lập trình',
            image: '/guest/Cate_3.svg'
        },
        {
            id: 4,
            name: 'Lập trình',
            image: '/guest/Cate_4.svg'
        },
        {
            id: 5,
            name: 'Lập trình',
            image: '/guest/Cate_5.svg'
        },
        {
            id: 6,
            name: 'Lập trình',
            image: '/guest/Cate_6.svg'
        },
        {
            id: 7,
            name: 'Lập trình',
            image: '/guest/Cate_7.svg'
        },
        {
            id: 8,
            name: 'Lập trình',
            image: '/guest/Cate_8.svg'
        },
        {
            id: 9,
            name: 'Lập trình',
            image: '/guest/Cate_9.svg'
        },
        {
            id: 10,
            name: 'Lập trình',
            image: '/guest/Cate_10.svg'
        },
        {
            id: 11,
            name: 'Lập trình',
            image: '/guest/Cate_11.svg'
        },
        {
            id: 12,
            name: 'Lập trình',
            image: '/guest/Cate_12.svg'
        },
        {
            id: 13,
            name: 'Lập trình',
            image: '/guest/Cate_13.svg'
        },
        {
            id: 14,
            name: 'Lập trình',
            image: '/guest/Cate_14.svg'
        },
        {
            id: 15,
            name: 'Lập trình',
            image: '/guest/Cate_15.svg'
        },
        {
            id: 16,
            name: 'Lập trình',
            image: '/guest/Cate_16.svg'
        },
        {
            id: 17,
            name: 'Lập trình',
            image: '/guest/Cate_17.svg'
        },
        {
            id: 18,
            name: 'Lập trình',
            image: '/guest/Cate_18.svg'
        },
        {
            id: 19,
            name: 'Lập trình',
            image: '/guest/Cate_19.svg'
        },
        {
            id: 20,
            name: 'Lập trình',
            image: '/guest/Cate_20.svg'
        },
    ]

    var columns = 5;
    
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
