'use client';
import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CourseDisplaySection } from "@/components/student/course-display";

import { Card, Button, Form } from "antd";
import { QASection } from "@/components/student/qna";
import { FooterSection } from "@/components/guest/ui/guest";
import { useParams, notFound } from "next/navigation";
import { RightOutlined } from "@ant-design/icons";
import { useGetCourseByIdQuery, useGetTotalEnrollmentQuery } from "@/store/api/[module]/courseApi";

import AbstractTop from "@/../public/student/AbstractTop.svg";
import AbstractMiddle from "@/../public/student/AbstractMiddle.svg";
import starSVG from "@/../public/student/Star.svg";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { CourseHighLightComponent } from "@/components/student/course-category-props";

import { Course } from '@/type/course.type';
import { XCircle } from "@deemlol/next-icons";
import { useEnrollInCourseMutation } from '@/store/api/[module]/enrollmentApi';
import { useCreateLearningProgressMutation } from '@/store/api/[module]/lessonProgressApi';
const CourseSyllabusSection = ({ category }: { category: string }) => {
    const achievableKnowledge = [
        {
            title: 'Mô hình hóa toán học',
            description: 'Xây dựng mô hình giúp mô phỏng và dự đoán các hiện tượng trong đời sống, kinh tế và kỹ thuật.'
        },
        {
            title: 'Ứng dụng công nghệ trong phân tích dữ liệu',
            description: 'Sử dụng phần mềm PowerBI và ngôn ngữ lập trình Python để trực quan hóa và phân tích số liệu hiệu quả.'
        },
        {
            title: 'Xác suất và thống kê suy luận',
            description: 'Nắm vững công cụ để đưa ra kết luận, dự báo và ra quyết định dựa trên dữ liệu.'
        },
        {
            title: 'Phân tích và xử lý dữ liệu',
            description: 'Hiểu cách thu thập, sắp xếp, làm sạch và diễn giải dữ liệu thực tế.'
        }
    ]

    const achievableSkills: string[] = category.split(",");

    return (
        <section className="w-full py-[8vh] sm:py-[12vh] flex flex-col items-center justify-center">
            <div className="w-[var(--global-width)] px-4 sm:px-0 flex flex-col gap-[3rem] sm:gap-[4rem]">
                <div className="w-full">
                    <div><p className="text-[1.25rem] sm:text-[1.5rem] font-bold text-[var(--color-primary)] mb-[1rem]">Bạn sẽ học được</p></div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
                        {achievableKnowledge.slice(0, 4).map((knowledge) => (
                            <Card key={knowledge.title} className="!pr-[1.5rem] !border-gray-200 hover:shadow-[10px_10px_10px_var(--color-neutral)] transition-all duration-300 !rounded-[20px]">
                                <p className="text-[1.1rem] sm:text-[1.25rem] font-bold text-[var(--color-primary)]">{knowledge.title}</p>
                                <p className="text-[0.9rem] sm:text-[1rem] font-light text-[var(--color-primary)]">{knowledge.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="w-full">
                    <div><p className="text-[1.25rem] sm:text-[1.5rem] font-bold text-[var(--color-primary)] mb-[1rem]">Kỹ năng bạn sẽ học được</p></div>

                    <div className="w-full flex flex-wrap items-center justify-start gap-2">
                        {achievableSkills.map((skill) => (
                            <div key={skill} className="min-w-[120px] sm:w-[145px] h-[32px] px-3 sm:px-0 bg-blue-200 flex items-center justify-center rounded-full">
                                <p className="text-[0.9rem] sm:text-[1rem] text-[var(--color-secondary)]">{skill}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

const CourseRegisterModal = ({ isOpen, onClose, children }: {
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode,
}) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="relative bg-[var(--color-white)] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] rounded-[20px] p-4 w-[500px] flex flex-col items-center justify-top" onClick={(e) => e.stopPropagation()}>
                <Button
                    className="!w-[2rem] !h-[2rem] !bg-[var(--color-secondary)] !rounded-full !text-white !p-2 !text-md !absolute !top-2 !right-2"
                    onClick={onClose}
                >
                    <XCircle className="!text-white !w-full !h-full" />
                </Button>
                {children}
            </div>
        </div>
    )
}

const CourseInfoSection = ({ courseData, courseId, totalEnrollment }: { courseData: Course, courseId: string, totalEnrollment: number }) => {

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [enrollInCourse, { isLoading: isEnrolling }] = useEnrollInCourseMutation();
    const [createLearningProgress] = useCreateLearningProgressMutation();

    const handleRegisterCourse = () => {
        setIsModalOpen(true);
    }

    const handleConfirmRegisterCourse = async () => {
        try {
            await enrollInCourse(courseId).unwrap();
            await createLearningProgress(courseId).unwrap();
            closeModal();
            router.refresh();
        }
        catch (error) {
            console.error('Đăng ký thất bại:', error);
        }
    }


    return (
        <>
            {isModalOpen && (
                <CourseRegisterModal isOpen={isModalOpen} onClose={closeModal}>
                    <p className="text-[1.5rem] font-bold text-[var(--color-primary)] text-center mb-[1rem]">Xác nhận đăng kí môn học</p>
                    <p className="text-[1rem] font-light text-[var(--color-primary)] text-center mb-[2rem]">Bạn có chắc chắn muốn đăng ký môn học này không? Hãy xác nhận để bắt đầu học ngay!</p>
                    <div className="w-full flex items-center justify-center gap-2">
                        <Button className="!w-[50%] !h-[40px] !bg-[var(--color-secondary)] !text-white hover:!bg-white hover:!text-black rounded-[20px] !text-[1rem]"
                            onClick={closeModal}
                        >Hủy</Button>
                        <Button className="!w-[50%] !h-[40px] !bg-[var(--color-secondary)] !text-white hover:!bg-white hover:!text-black rounded-[20px] !text-[1rem]"
                            onClick={handleConfirmRegisterCourse}
                            loading={isEnrolling}
                        >
                            Đăng ký ngay
                        </Button>
                    </div>
                </CourseRegisterModal>
            )}



            <section className="w-full flex flex-col relative">
                <div className="w-full absolute top-0 left-0 z-[-1]">
                    <Image
                        src={AbstractMiddle} alt="Curve Space Middle" width={0} height={0}
                        className="w-full h-auto object-cover"
                    />
                </div>

                <div className="w-full h-full flex flex-col items-center z-10">
                    <div className="w-[var(--global-width)] mt-[5vh] px-4 sm:px-0 flex flex-col justify-between">
                        <div className="h-full w-full md:w-[80%] lg:w-[60%] flex flex-col items-start justify-between">
                            <div className={`flex flex-col items-start justify-between w-full mb-[2rem]`}>
                                <p className={`text-[2rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-[var(--color-primary)]`}>{courseData?.course_name}</p>
                                <p className="text-[0.9rem] sm:text-[1rem] text-[var(--color-primary)] mb-[2rem]">{courseData?.course_description}</p>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-[20px] h-[20px] relative rounded-full overflow-hidden items-center justify-center">
                                        <Image
                                            src={courseData?.teacher_avatar_url || starSVG}
                                            alt="Empty Layout"
                                            width={0}
                                            height={0}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-[0.9rem] sm:text-[1rem] text-[var(--color-primary)]">GV. {courseData?.teacher_name}</p>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto sm:flex-row flex items-center justify-start mb-[1.5rem]">

                                {courseData.is_enrolled ? (
                                    <Button
                                        onClick={() => router.push(`/student/courses/${courseId}/content`)} className="!w-full sm:!w-auto !min-w-[160px] !h[54px] !bg-[var(--color-secondary)] !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-full !text-[1rem]">
                                        Đi đến môn học
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleRegisterCourse}
                                        className="!w-full sm:!w-auto !min-w-[160px] !h[54px] !bg-[var(--color-secondary)] !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-full !text-[1rem]">
                                        Tham gia ngay
                                    </Button>
                                )}
                            </div>

                            <p className="text-[0.9rem] sm:text-[1rem] text-[var(--color-primary)]">{totalEnrollment} học viên tham gia</p>

                        </div>

                    </div>
                    {/*<CourseHighlightComponent/> */}

                    <div className="mt-[8vh] sm:mt-[12vh] grid grid-cols-2 sm:grid-cols-4 w-[var(--global-width)] min-h-[11rem] bg-white shadow-[5px_5px_20px_var(--color-neutral)] rounded-[20px] border-2 border-gray-200 py-3 mx-4 sm:mx-0">
                        <div className="flex flex-col items-center w-full border-r-2 border-gray-200 sm:border-r-2 border-b-2 sm:border-b-0">
                            <div className="mt-7 w-[80%] h-full text-center">
                                {
                                    Number(courseData?.tuition_fee) === 0 ? (
                                        <>
                                            <p className="text-[1.5rem] mb-3 font-bold text-[var(--color-primary)]">Khóa học miễn phí</p>
                                            <p className="text-[1rem] font-light text-[var(--color-primary)]">Mở rộng kỹ năng của bạn hoàn toàn miễn phí</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[1.5rem] font-bold text-[var(--color-primary)]">Khóa học có phí</p>
                                            <p className="text-[1rem] font-light text-[var(--color-primary)]">Phí: {courseData?.tuition_fee} VNĐ</p>
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-full border-gray-200 sm:border-r-2 border-b-2 sm:border-b-0">
                            <div className="mt-7 h-full">
                                <span className="flex mb-3">
                                    <p className="text-[1.4rem] mr-4 font-bold text-[var(--color-primary)]">5.0</p>

                                    <Image
                                        src={starSVG} alt="Star Icon" width={0} height={0}
                                        className="w-[1.4rem]"
                                    />
                                </span>
                                <p className="text-[1rem] font-light text-[var(--color-primary)]">5.0 đánh giá</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-full border-r-2 border-gray-200">
                            <div className="mt-7 w-[80%] h-full text-center">
                                <p className="text-[1.5rem] mb-3 font-bold text-[var(--color-primary)]">Phân loại</p>
                                <p className="text-[1rem] font-light text-[var(--color-primary)]">{courseData?.category}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-full">
                            <div className="mt-7 w-[70%] h-full text-center">
                                <p className="text-[1.4rem] mb-3 font-bold text-[var(--color-primary)]">Thời lượng khóa học</p>
                                <p className="text-[1rem] font-light text-[var(--color-primary)]">{courseData?.duration}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )

}

export default function StudentCoursePage() {


    const router = useRouter();
    const { id } = useParams();
    const { data: courseInfo, isLoading, error } = useGetCourseByIdQuery(id as string);
    const courseData = courseInfo?.data;
    const { data: teacherStatistc } = useGetTotalEnrollmentQuery(id as string);
    const totalEnrollment = teacherStatistc ?? 0;

    if (isLoading) {
        return <div className="w-full min-h-screen flex items-center justify-center">Đang tải...</div>;
    }

    if (error || !courseData) {
        return <div className="w-full min-h-screen flex items-center justify-center">Không tìm thấy khóa học</div>;
    }

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <section className="w-full h-[3rem] mt-[5rem] flex flex-col items-center justify-center border-b border-gray-200">
                <div className="w-[var(--global-width)] h-full flex items-center justify-start">
                    Môn học <span className="ml-2 mr-2"><RightOutlined className="text-[var(--color-primary)]" /></span> {courseData?.category}
                </div>
            </section>

            <CourseInfoSection courseData={courseData} courseId={id as string} totalEnrollment={totalEnrollment} />
            <CourseSyllabusSection category={courseData?.category} />

            <CourseDisplaySection
                title="Môn học tương tự"
            />
            {/* <QASection /> */}
            <FooterSection hasRegisterBox={false} />
        </main>
    )

}