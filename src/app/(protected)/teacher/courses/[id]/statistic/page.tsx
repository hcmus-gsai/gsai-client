'use client';
import '@ant-design/v5-patch-for-react-19';

import { FooterSection } from "@/components/guest/ui/guest";
import { useState, useEffect } from 'react';
import { SubmissionHistorySection } from '@/components/teacher/submission-history';
import { useGetUserProfileQuery } from '@/store/api/[module]/userApi';
import { Button, Progress } from 'antd';
import WeeklyRegistrationLineChart from '@/components/teacher/weekly-registration-line-chart';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import UpperPointer from "@/../public/student/UpperPointer.svg";
import LowerPointer from "@/../public/student/LowerPointer.svg";
import { StarFilled } from "@ant-design/icons";
import Image from "next/image";

const WeeklyRegistrationData = [
    { date: "16/02", value: 5 },
    { date: "17/02", value: 8 },
    { date: "18/02", value: 3 },
    { date: "19/02", value: 10 },
    { date: "20/02", value: 6 },
    { date: "21/02", value: 4 },
    { date: "22/02", value: 7 },
];

export default function TeacherHomePage() {
    const router = useRouter();
    const { id: courseId } = useParams();

    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    const { data: profile } = useGetUserProfileQuery();
    const streak = 4;

    return (
        <section className="w-full flex flex-col items-center justify-center mt-[5rem]">
            <div className="flex items-center justify-between w-[var(--global-width)] px-4 mt-[2.5rem] mb-5">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-[var(--color-primary)]">
                    Cơ sở trí tuệ nhân tạo
                </h1>

                <Button
                    className="!w-[178px] !h-[54px] !bg-[var(--color-neutral)] !rounded-full !border-none !text-[var(--color-secondary)] !p-2 !text-md !font-medium hover:!bg-[var(--color-secondary)] hover:!text-white transition-colors duration-300"
                    onClick={() => router.push(`/teacher/courses/${courseId}`)}
                >
                    Chế độ xem
                </Button>
            </div>

            <div className="flex flex-col items-center gap-[1.5rem] w-full mb-50">
                <div className="flex justify-center w-full">
                    <div className="flex w-[var(--global-width)] gap-[1rem]">

                        <div className="flex-[3] flex flex-col bg-[var(--color-bg-white)] rounded-[20px] border border-[#DCDCDC] p-[1rem]">
                            <p className="text-[1rem] font-bold text-[var(--color-primary)] mb-[1rem] text-center">
                                Tình trạng học tập
                            </p>

                            <div className="flex items-center justify-center gap-4">
                                <div className="flex items-end">
                                    <p className="text-[0.875rem] text-[var(--color-primary)]">
                                        Chưa hoàn thành (70%)
                                    </p>
                                    <Image
                                        src={LowerPointer}
                                        alt=""
                                        width={36}
                                        height={36}
                                        className="relative bottom-5 !w-[3rem]"
                                    />
                                </div>

                                <Progress
                                    percent={30}
                                    type="circle"
                                    size={100}
                                    strokeWidth={12}
                                />

                                <div className="flex items-start">
                                    <Image
                                        src={UpperPointer}
                                        alt=""
                                        width={36}
                                        height={36}
                                        className="relative top-2 !w-[3rem]"
                                    />
                                    <p className="text-[0.875rem] text-[var(--color-primary)]">
                                        Đã hoàn thành (30%)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-white rounded-[20px] border border-gray-200 py-6 flex flex-col items-center justify-center">
                            <p className="text-gray-600 text-sm">Số lượng học sinh</p>
                            <p className="text-[2rem] font-bold text-blue-600 mt-2">100</p>
                        </div>

                        <div className="flex-1 bg-white rounded-[20px] border border-gray-200 py-6 flex flex-col items-center justify-center">
                            <p className="text-gray-600 text-sm">Số lượt đánh giá</p>
                            <p className="text-[2rem] font-bold text-blue-600 mt-2">78</p>
                        </div>

                        <div className="flex-1 bg-white rounded-[20px] border border-gray-200 py-6 flex flex-col items-center justify-center">
                            <p className="text-gray-600 text-sm">Đánh giá trung bình</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[2rem] font-bold text-blue-600">4.5</span>
                                <StarFilled className="!text-yellow-400 text-lg" />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="w-[var(--global-width)] flex-1 min-h-[200px] bg-[var(--color-bg-white)] rounded-[20px] border-[1px] border-solid border-[#DCDCDC] p-[1rem]">
                    <p className="text-[1rem] font-bold text-[var(--color-primary)] mb-[1rem]">Số bài học đã hoàn thành trong tuần</p>
                    <div className="w-full h-[90%]">
                        <WeeklyRegistrationLineChart data={WeeklyRegistrationData} />
                    </div>
                </div>
            </div>
        </section>
    )
}
