'use client';

import Image from "next/image";
import { Button } from "antd";
import AbstractTop from "@/../public/student/AbstractTop.svg";
import AbstractMiddle from "@/../public/student/AbstractMiddle.svg";
import AbstractNCurve from "@/../public/student/AbstractNCurve.svg";

import { CourseCategoryComponent, CourseHighLightComponent } from '@/components/student/course-category-props';
import EmptyLayout from "@/../public/EmptyLayout.svg";

const StudentGreetingSection = (
{
    title,  
    titleSize = "text-[3.5rem]",
    description,
    isCourse = true,
    buttonText,
    hasTopGradient = true,
    hasCurveSpace = true,
}:{
    title: string,
    titleSize?: string,
    description: string
    isCourse?: boolean
    buttonText: string
    hasTopGradient?: boolean
    hasCurveSpace?: boolean
}) => {
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
        // {
        //     id: 9,
        //     name: 'Lập trình',
        //     image: '/images/learning-category-1.jpg'
        // },
        // {
        //     id: 10,
        //     name: 'Lập trình',
        //     image: '/images/learning-category-1.jpg'
        // },
    ];

    var columns = 4;
    var paticipants = 10;

    return (
        <section className = "w-full h-[100vh] flex flex-col">
            {hasTopGradient && (
                <Image 
                    src = {AbstractTop} alt = "Curve Space Top" width = {0} height = {0}
                    className = "absolute top-0 left-0 w-full h-auto z-10"
                />
            )}

            <div className="w-full h-[70%] absolute top-0 left-0 z-[-1]">
                {hasCurveSpace ? (
                    <Image 
                        src = {AbstractNCurve} alt = "Curve Space Middle" width = {0} height = {0}
                        className = "w-full h-auto"
                    />
                ) : (
                    <Image 
                        src = {AbstractMiddle} alt = "Curve Space Middle" width = {0} height = {0}
                        className = "w-full h-auto"
                    />
                )}
            </div>
            
            <div className = "w-full h-full flex flex-col items-center z-10">
                <div className = "w-[calc(100%-12rem)] h-[242px] mt-[15vh] flex items-center justify-between">
                    <div className = "h-full w-[546px] flex flex-col items-start justify-between">
                        <div className = {`flex flex-col items-start justify-between w-full ${isCourse ? '' : 'mb-[5.0625rem]'}`}>                    
                            <p className = {`${titleSize} font-bold text-[var(--color-primary)]`}>{title}</p>
                            <p className = "text-[1rem]  text-[var(--color-primary)]">{description}</p>
                        </div>
                        {
                            isCourse && (
                                <div className = "w-full flex items-center justify-start  gap-[2.5rem] my-[1.25rem]">
                                    <Image src = {EmptyLayout} alt = "Teacher Profile" width = {0} height = {0} className = "w-[50px] h-[50px] object-cover rounded-full"/>
                                    <p className = "text-[1rem] font-bold text-[var(--color-primary)]">Ths. Nguyễn Văn B</p>
                                </div>
                            )
                        }
                        <div className = "w-full flex items-center justify-start mb-[1rem]">
                            <Button className = "!w-[38%] !h[54px] !bg-[var(--color-secondary)] !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-full !text-[1rem]">Thời gian biểu</Button>
                        </div>

                        <p className = "text-[1rem] font-bold text-[var(--color-primary)]">{paticipants} người tham gia</p>
                    </div>
                </div>
                {
                    !isCourse ? (
                        <div className = "w-full h-[242px] mt-[10vh] flex flex-col items-center justify-between">
                            <div className = "h-full w-full flex flex-col items-center justify-between z-10">
                                <p className = "text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
                            </div>
                            <CourseCategoryComponent columns = {columns} categories = {learningCategory}/>
                        </div>
                    ) : (
                        <CourseHighLightComponent />
                    )
                }
                
            </div>
        </section>
    )
}

export {StudentGreetingSection};




