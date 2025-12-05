'use client';

import Image from "next/image";
import { Button } from "antd";
import AbstractTop from "@/../public/student/AbstractTop.svg";
import AbstractMiddle from "@/../public/student/AbstractMiddle.svg";
import AbstractNCurve from "@/../public/student/AbstractNCurve.svg";
// import AbstractNCurve from "@/../public/student/testAbstract.svg";

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

    return (
        <section className = "w-full flex flex-col relative">
            {hasTopGradient && (
                <Image 
                    src = {AbstractTop} alt = "Curve Space Top" width = {0} height = {0}
                    className = "absolute top-0 left-0 w-full h-auto"
                />
            )}

            <div className="w-full  absolute top-20 left-0 z-[-1]">
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
                        <div className = "w-full flex items-center justify-start mb-[1rem]">
                            <Button className = "!w-[38%] !h[54px] !bg-[var(--color-secondary)] !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-full !text-[1rem]">Thời gian biểu</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export {StudentGreetingSection};




