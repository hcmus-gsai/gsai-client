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
        
    ]

    var columns = 5;
    
    return (
        <section className = "w-full min-h-[242px] grow flex flex-col items-center justify-between my-[8rem]">   
            <div className = "h-full w-[var(--global-width)] flex flex-col items-center justify-between mb-[1rem]">
                <p className = "w-full text-left text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
            </div>
            <CourseCategoryComponent columns = {columns} categories = {learningCategory}/>
        </section>
    )
}

export {CourseCategorySection};
