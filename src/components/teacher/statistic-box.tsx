'use client';

import { StarFilled } from "@ant-design/icons";
import { useGetTeacherStatisticQuery } from "@/store/api/[module]/courseApi";

export const StatisticBoxSection = () => {
    const { data: statisticData, isLoading } = useGetTeacherStatisticQuery();

    return (
        <section className="w-full flex flex-col items-center mt-[2.5rem] mb-5">
            <div className="w-[var(--global-width)] flex items-center justify-between gap-6 p-6">
                <div className="flex-1 bg-white rounded-[20px] border border-gray-200 py-6 flex flex-col items-center justify-center">
                    <p className="text-gray-600 text-sm">Số lượng học sinh</p>
                    <p className="text-[2rem] font-bold text-blue-600 mt-2">{statisticData?.data.total_enrollments || 0}</p>
                </div>

                <div className="flex-1 bg-white rounded-[20px] border border-gray-200 py-6 flex flex-col items-center justify-center">
                    <p className="text-gray-600 text-sm">Số lượng khóa học</p>
                    <p className="text-[2rem] font-bold text-blue-600 mt-2">{statisticData?.data.total_courses || 0}</p>
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
        </section>
    );
};