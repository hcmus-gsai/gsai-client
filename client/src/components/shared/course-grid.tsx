'use client';

import {Row, Col, Card} from "antd";
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { StarFilled } from "@ant-design/icons";
import { string } from "better-auth";
import { useRouter } from "next/navigation";

interface ICourse {
    name: string;
    teacher:string[];
    estimated_time: string;
    rating: number;
    tags: string[];
}

export const CourseGrid = (
    {
        courseData,
        colWidth   ,
        maxItems,
        className = ""    
    }:{
        courseData: ICourse[];
        colWidth: number;
        maxItems: number;
        className ?: string;
    }
) => {
    const router = useRouter();
    return (
        <Row gutter = {[16,16]} className = {`w-[100%] mx-auto ${className}`}>
            {
                courseData.slice(0, maxItems).map((c,index) => {
                    return (
                        <Col span = {colWidth} key = {index} className = "!flex !items-center !justify-center">
                            <Card 
                                className = "w-[100%] px-[1rem] py-[1.5rem] hover:shadow-[5px_5px_20px_var(--color-neutral)] hover:scale-105 transition-all duration-300 cursor-pointer !rounded-[24px]"
                                onClick = {()=>router.push(`/student/home/course/${c.name.toLowerCase().replace(/ /g, '-')}`)}
                            >
                                <div className = "flex flex-col items-center justify-center">
                                    <Image src = {EmptyLayout} alt = {c.name} width = {0} height = {0} 
                                        className = "w-full h-full object-cover"                                                    
                                    />
                                    <h3 className = "text-[1.125rem] font-semibold text-center text-truncate line-clamp-1">{c.name}</h3>
                                    
                                    <p className = "text-[0.875rem] font-light text-gray-600 text-center line-clamp-1">
                                        {c.teacher.join(', ')}
                                    </p>

                                    <div className="flex items-center justify-center">
                                        <StarFilled className ="!text-yellow-400"/>
                                        <span className = "font-bold text-gray-600 text-center ml-[2px]">{c.rating}</span>
                                    </div>

                                    <p className = "text-[0.875rem] font-light text-gray-600 text-center">Thời lượng: {c.estimated_time}</p>
                                    
                                    <div className = "flex items-center justify-center w-full gap-x-[0.5rem]">
                                        {
                                            c.tags.map((t, idx) => {
                                                return (
                                                    <div key = {idx} className = "flex items-center justify-center bg-[var(--color-bg_white)] border border-solid border-gray-200 rounded-full w-[40%] h-[27px] px-[1rem] py-[0.5rem]">
                                                        <p className = "text-[0.875rem] font-light text-gray-600 text-center line-clamp-1">{t}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    )
                })
            }
        </Row>
    )

}
