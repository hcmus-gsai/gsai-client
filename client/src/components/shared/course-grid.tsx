'use client';

import {Row, Col, Card} from "antd";
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { StarFilled } from "@ant-design/icons";
import { string } from "better-auth";

interface ICourse {
    name: string;
    teacher:string;
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
    return (
        <Row gutter = {[16,16]} className = {`w-[100%] mx-auto ${className}`}>
            {
                courseData.slice(0, maxItems).map((c,index) => {
                    return (
                        <Col span = {colWidth} key = {index} className = "!flex !items-center !justify-center">
                            <Card className = "w-[100%] h-[303px] hover:shadow-[5px_5px_20px_var(--color-neutral)] hover:scale-105 transition-all duration-300">
                                <div className = "flex flex-col items-center justify-center">
                                    <Image src = {EmptyLayout} alt = {c.name} width = {0} height = {0} 
                                        className = "w-full h-full object-cover"                                                    
                                    />
                                    <h3 className = "text-[1.25rem] font-bold text-center text-truncate line-clamp-1">{c.name}</h3>
                                    <div className="flex items-center justify-center">
                                        <StarFilled className ="!text-yellow-400"/>
                                        <span className = "font-bold text-gray-600 text-center ml-[2px]">{c.rating}</span>
                                    </div>
                                    <p className = "text-[1rem] font-light text-gray-600 text-center">{c.teacher}</p>
                                    <p className = "text-[1rem] font-light text-gray-600 text-center">Thời lượng: {c.estimated_time}</p>
                                    
                                    <div className = "flex items-start justify-start gap-2 mt-2">
                                        {
                                            c.tags.map((t, idx) => {
                                                return (
                                                    <p key = {idx} className = "text-[10px] font-light text-gray-600 text-center rounded-md px-1 py-1 w-fit bg-gray-100">{t}</p>
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
