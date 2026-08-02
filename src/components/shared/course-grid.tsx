'use client';

import { Row, Col, Card } from "antd";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { StarFilled } from "@ant-design/icons";
import { string } from "better-auth";
import { useRouter, usePathname } from "next/navigation";

import { EnrolledCourse } from '@/type/enrollment.type';
import { Course } from '@/type/course.type';
import { useAppDispatch } from "@/store/hook";
import { setTitle } from "@/store/slice/courseDisplaySlice";
import { useLazyGetCourseByIdQuery, useGetCourseByIdQuery } from "@/store/api/[module]/courseApi";


export const CourseGrid = (
    {
        courseData,
        colWidth,
        maxItems,
        routeInactiveTeacherCoursesToCreateClass = false,
        className = ""
    }: {
        courseData: Course[];
        colWidth: number;
        maxItems: number;
        routeInactiveTeacherCoursesToCreateClass?: boolean;
        className?: string;
    }
) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    if (!courseData) return null;

    const pathname = usePathname();
    const role = pathname.split('/')[1];

    const sliced = courseData.slice(0, maxItems);

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);



    const horizontalScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const divContainer = e.currentTarget; //current div
        const totalScrollLeftPixel = divContainer.scrollLeft; //Total accumatelate pixel when scroll left

        const singleItemWidthInPixel = divContainer.offsetWidth; //pixel width of an item

        const currentIdx = Math.round(totalScrollLeftPixel / singleItemWidthInPixel)

        setActiveIndex(currentIdx);

    }

    const scrollToItem = (index: number) => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            scrollRef.current.scrollTo({
                left: index * width,
                behavior: "smooth"
            });
        }
    }


    const handleCardClick = (c: Course) => {
        const shouldResumeDraft =
            routeInactiveTeacherCoursesToCreateClass &&
            role === "teacher" &&
            c.is_active === false;

        if (shouldResumeDraft) {
            router.push(`/teacher/create-class?courseId=${c.id}`);
            return;
        }
        router.push(`/${role}/courses/${c.id}`);
    }

    const CourseCard = ({ c }: { c: Course }) => (
        <Card
            styles={{ body: { padding: 0 } }}
            className=" w-[360px] md:w-full md:h-full cursor-pointer !rounded-[24px] !overflow-hidden transition-all duration-500 ease-in-out bg-white !border !border-[#EBEBEB] shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-[var(--color-neutral)]/20"
            onClick={() => handleCardClick(c)}
        >
            <div className="w-full aspect-[16/9]">
                <Image
                    src={c.thumbnail_url || EmptyLayout}
                    alt={c.course_name || "Empty Layout"}
                    className="w-full h-full object-cover px-2 py-2 rounded-[24px]"
                />
            </div>
            <div className="flex flex-col">
                <h3 className="text-[1.125rem] font-semibold text-center line-clamp-1">
                    {c.course_name}
                </h3>
                <p className="text-[0.875rem] font-light text-gray-600 text-center line-clamp-1">
                    GV. {c?.teacher_name}
                </p>
                <div className="flex items-center justify-center">
                    <StarFilled className="!text-yellow-400" />
                    <span className="font-bold text-gray-600 text-center ml-[2px]">5</span>
                </div>
                <p className="text-[0.875rem] font-light text-gray-600 text-center">
                    Thời lượng: {c.duration} tháng
                </p>
                <div className="pt-3 flex flex-wrap items-center justify-center  w-full min-h-[64px] content-start overflow-hidden">
                    {c.category
                        .toString()
                        .split(",")
                        .map((category, idx) => (
                            <div key={idx} className="flex items-center">
                                <div
                                    className="cursor-pointer hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(setTitle(category));
                                        router.push(`/${role}/category/${category.toLowerCase().trim().replace(/ /g, "-")}`);
                                    }}
                                >
                                    <p className="text-[0.875rem] font-light text-gray-600 line-clamp-1 truncate">
                                        {category}
                                    </p>
                                </div>

                                {idx !== c.category.toString().split(",").length - 1 && (
                                    <span className="mx-2 text-gray-400 flex items-center justify-center text-[10px] select-none">
                                        •
                                    </span>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </Card>
    )

    return (
        <>
            <div className="flex flex-col items-center justify-center md:hidden gap-4">
                <div className="flex md:hidden w-full overflow-x-auto gap-x-[1rem] pb-[0.75rem] snap-x snap-mandatory snap-always"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        touchAction: "pan-x",
                        overscrollBehaviorX: "contain",
                        willChange: "transform",
                        height: "400px",
                    }}
                    ref={scrollRef}
                    onScroll={horizontalScroll}
                >
                    {sliced.map((c, index) => (
                        <div
                            key={index}
                            className="snap-center shrink-0 w-full flex items-center justify-center"
                        >
                            <CourseCard c={c} />
                        </div>
                    ))}
                </div>

                <div className="flex md:hidden justify-center items-center gap-2">
                    {sliced.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToItem(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2 transition-all duration-300 rounded-full ${activeIndex === index
                                ? "w-6 bg-blue-600 cursor-pointer"
                                : "w-2 bg-gray-300 hover:bg-gray-400 cursor-pointer"
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div
                className={`hidden md:grid  w-full gap-6 ${className}`}
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(280px, 1fr))`,
                }}
            >
                {sliced.map((c, index) => (
                    <CourseCard key={index} c={c} />
                ))}
            </div>
        </>
    )

}
