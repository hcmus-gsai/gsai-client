'use client';

import {Row, Col, Card} from "antd";
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { StarFilled } from "@ant-design/icons";
import { string } from "better-auth";
import { useRouter } from "next/navigation";

import { EnrolledCourse } from '@/type/enrollment.type';
import {Course} from '@/type/course.type';

export const CourseGrid = (
    {
        courseData,
        colWidth   ,
        maxItems,
        className = ""    
    }:{
        courseData: Course[];
        colWidth: number;
        maxItems: number;
        className ?: string;
    }
) => {
    const router = useRouter();
    
    if (!courseData) return null;
    
    return (
        <Row gutter = {[16,16]} className = {`w-[100%] mx-auto ${className}`}>
            {
                courseData.slice(0, maxItems).map((c,index) => {
                    return (
                        <Col span = {colWidth} key = {index} className = "!flex !items-center !justify-center">
                            <Card 
                                className = "w-[100%] px-[1rem] py-[1.5rem] hover:shadow-[5px_5px_20px_var(--color-neutral)] hover:scale-105 transition-all duration-300 cursor-pointer !rounded-[24px]"
                                onClick = {()=>router.push(`/student/courses/${c.course_id}`)}
                            >
                                <div className = "flex flex-col items-center justify-center">
                                    {/* <Image 
                                        src = {c.thumbnail_url || EmptyLayout} 
                                        alt = {c.course_name || "Empty Layout"} 
                                        width = {300} 
                                        height = {200} 
                                    /> */}
                                    <Image 
                                        width={300} height={200}
                                        src = {c.thumbnail_url || EmptyLayout} 
                                        alt = {c.course_name || "Empty Layout"} 

                                        className = "w-full object-cover rounded-lg mb-[1rem]"                                                    

                                    />
                                    <h3 className = "text-[1.125rem] font-semibold text-center text-truncate line-clamp-1">{c.course_name}</h3>
                                    
                                    <p className = "text-[0.875rem] font-light text-gray-600 text-center line-clamp-1">
                                        bởi {c.teacher_name}
                                    </p>

                                    <div className="flex items-center justify-center">
                                        <StarFilled className ="!text-yellow-400"/>
                                        <span className = "font-bold text-gray-600 text-center ml-[2px]">5</span>
                                    </div>

                                    <p className = "text-[0.875rem] font-light text-gray-600 text-center">Thời lượng: {c.duration}</p>
                                    
                                    <div className = "flex items-center justify-center w-full gap-x-[0.5rem]">
                                        {
                                            c.category.toString().split(',').map((category, idx) => {
                                                return (
                                                    <div key = {idx} className = "flex items-center justify-center bg-[var(--color-bg_white)] border border-solid border-gray-200 rounded-full  h-[27px] px-[1rem] py-[0.5rem]">
                                                        <p className = "text-[0.875rem] font-light text-gray-600 text-center line-clamp-1">{category}</p>
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
