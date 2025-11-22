'use client';

import Image from "next/image";
import { Button } from "antd";
import AbstractTop from "@/../public/student/AbstractTop.svg";
import AbstractMiddle from "@/../public/student/AsbtractMiddle.svg";
import CurveSpace from "@/../public/student/CurveSpace.svg";
import { string } from "better-auth";

const StudentGreetingSection = (
{
    title,  
    description,
    isCourse = true,
    buttonText,
    hasTopGradient = true,
    hasMiddleGradient = true,
    hasCurveSpace = true,
}:{
    title: string,
    description: string
    isCourse?: boolean
    buttonText: string
    hasTopGradient?: boolean
    hasMiddleGradient?: boolean
    hasCurveSpace?: boolean
}) => {


    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            {hasTopGradient && (
                <Image 
                    src = {AbstractTop} alt = "Curve Space" width = {0} height = {0}
                    className = "absolute top-0 left-0 w-full h-auto z-0"
                />
            )}
            {hasMiddleGradient && (
                <Image 
                    src = {AbstractMiddle} alt = "Curve Space" width = {0} height = {0}
                    className = "absolute top-0 left-0 w-full h-auto z-0"
                />
            )}
           
            <div className = "w-full h-[100vh] flex flex-col items-center justify-center z-10">
                <div className = "w-[calc(100%-24rem)] h-[242px] flex items-center justify-between">
                    <div className = "h-full w-[546px] flex flex-col items-start justify-between">
                        <div className = "flex flex-col items-start justify-between w-full">                    
                            <p className = "text-[3.5rem] font-bold text-[var(--color-primary)]">{title}</p>
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)]">{description}</p>
                        </div>
                        <div>
                            <Button className = "!bg-black !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]">Thời gian biểu</Button>
                        </div>
                    </div>
                </div>
                <div className = "w-[calc(100%-24rem)] h-[242px] flex flex-col items-center justify-between">
                    
                    <div className = "h-full w-full flex flex-col items-center justify-between z-10">
                        <p className = "text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
                    </div>
                    <div className = "flex items-center justify-center w-full h-full z-10">
                        <div className = "grid grid-rows-2 grid-cols-4 gap-2 w-full">
                           Chỗ này là mấy cái nút chứa category của các môn học
                        </div>
                    </div>
                </div>
            </div>
            {hasCurveSpace && (
                <Image src = {CurveSpace} alt = "Curve Space" width = {0} height = {0} 
                    className = "absolute bottom-0 left-0 w-full h-auto z-0"
                />
            )}
        </section>
    )
}

export {StudentGreetingSection};




