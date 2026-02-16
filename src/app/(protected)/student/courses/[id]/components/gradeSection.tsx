'use client';
import '@ant-design/v5-patch-for-react-19';

import { useParams, useRouter } from "next/navigation";
import { useState } from 'react';

import { useGetCourseModulesQuery } from "@/store/api/[module]/courseApi";

import { useGetQuizzesByCourseIdQuery } from '@/store/api/[module]/quizApi';
import { useGetAllEnrollmentsQuery } from '@/store/api/[module]/enrollmentApi';
import { GradeCard } from '../components/gradeCard';


const GradeSection = () => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { id } = useParams();

    const { data: moduleRes } = useGetCourseModulesQuery(id as string, {
        skip: !id,
    });
    console.log('moduleRes', moduleRes);
    const modules = moduleRes?.modules ?? [];

    const { data: quizzes } = useGetQuizzesByCourseIdQuery(id as string);
    const { enrollment } = useGetAllEnrollmentsQuery(undefined, {
        selectFromResult: ({ data, isLoading }) => ({
            enrollment: data?.data?.find((e: any) => e.course_id === id),
            isLoading,
        }),
    });

    const handleNavigate = (lesson: any) => {
        router.push(`/student/lesson/${lesson.id}/${lesson.type}`);
    };

    return (
        <div className="w-full mt-[1rem] mb-[2rem]">
            <div className="grid grid-cols-12 gap-2 px-6 mb-2 font-medium">
                <div className='col-span-6'>Bài tập</div>
                <div className='col-span-2 text-center'>Tình trạng</div>
                <div className='col-span-3 text-center'>Hết hạn</div>
                <div className='col-span-1 text-center'>Điểm</div>
            </div>
            <div className="w-full h-px bg-gray-300 my-4" />

            <div className="flex flex-col gap-2">
                {quizzes?.map((quiz: any) => (
                    <GradeCard
                        key={quiz.id}
                        quiz={quiz}
                        enrollmentDate={enrollment?.enrolled_at}
                        onNavigate={handleNavigate}
                    />
                ))}
            </div>
        </div>
    );
}

export default GradeSection;