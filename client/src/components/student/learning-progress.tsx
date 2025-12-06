"use client";

import { useRouter } from "next/navigation";
import { Button, Progress } from "antd";
import { useGetAllEnrollmentsQuery } from "@/store/api/[module]/enrollmentApi";
import { EnrolledCourse, EnrolledCourseResponse } from "@/type/enrollment.type";
import VideoIcon from "@/../public/student/VideoIcon.svg";
import MoreIcon from "@/../public/student/MoreIcon.svg";

import Image from "next/image";

const LearningProgressSection = () => {
    const router = useRouter();
    let inProgressEnrollments: EnrolledCourse[] = [];
    
    const { data: enrollmentsData, isLoading, error } = useGetAllEnrollmentsQuery();

    inProgressEnrollments = enrollmentsData?.data.filter(
        (course: EnrolledCourse) => course.completion_status === "in_progress"
    ) ?? [];

    if (isLoading) {
        // Beutiful loading 
        return (
            <section className="w-full h-[242px] mt-[20vh] mb-[5vh] flex flex-col items-center justify-between">
            </section>
        );
    }


    return (
        <section className="w-full h-[242px] mt-[20vh]  mb-[5vh] flex flex-col items-center justify-between">
            <div className="flex flex-col items-center justify-center w-[var(--global-width)] gap-[1.5rem] mb-[2rem]">
                {!inProgressEnrollments || inProgressEnrollments.length === 0 ? (
                    <h1 className="text-[2.5rem] font-bold w-full text-[var(--color-primary)]">
                        Bạn chưa đăng ký môn nào cả, hãy khám phá ngay!
                    </h1>
                ) : (
                    <>
                        <h1 className="text-[2.5rem] font-bold w-full text-[var(--color-primary)]">
                            Tiếp tục môn học
                        </h1>

                        {inProgressEnrollments.map((course) => (
                            <div
                                key={course.id}
                                className="flex items-center justify-center w-full h-[114px] rounded-[20px] border-[1px] border-solid border-[#DCDCDC]"
                            >
                                <div className="flex flex-col items-start justify-center w-full h-full mr-auto pl-[1.5rem]">
                                    
                                    {/* Course_title = course_code - course_name */}
                                    <p className="text-[1.125rem] font-bold text-[var(--color-primary)]">
                                        {course.course_code} - {course.course_name}
                                    </p>

                                    <p className="text-[0.875rem] font-light text-[var(--color-primary)]">
                                        Hoàn thành 75% · Dự kiến hoàn thành: 05/11/2025
                                    </p>

                                    <Progress
                                        percent={75}
                                        showInfo={false}
                                        style={{ width: "400px" }}
                                    />
                                </div>

                                <div className="flex items-center justify-end relative w-full h-full ml-auto pr-[1.5rem] gap-[1.5rem]">
                                    <div>
                                        <p className="text-[1.125rem] font-bold text-[var(--color-primary)]">
                                            Tên bài giảng
                                        </p>
                                        <div className="flex items-center justify-center gap-[0.5rem]">
                                            <Image src={VideoIcon} alt="Video Icon" width={20} height={20} />
                                            <p className="text-[0.75rem] font-light text-[var(--color-primary)]">
                                                Video 2 phút
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <Button
                                            type="primary"
                                            onClick={() => router.push(`/student/courses/${course.id}/content`)}
                                            className="!border-1 !border-solid !w-[9rem] !h-[3rem] !rounded-full !flex !items-center !justify-center !bg-[#1363DF] hover:!bg-white hover:!text-[#1363DF] hover:!border-[#1363DF]"
                                        >
                                            Tiếp tục
                                        </Button>
                                    </div>

                                    <div>
                                        <Image src={MoreIcon} alt="More Icon" width={24} height={24} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
};

export { LearningProgressSection };
