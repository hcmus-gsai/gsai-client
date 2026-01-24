'use client';

import { Card } from "antd";
import { useRouter } from "next/navigation";
import { useGetLatestQuizAttemptQuery } from '@/store/api/[module]/quizApi';
import { Check, Circle } from "@deemlol/next-icons"

function formatDateDisplay(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(date);
}

export function GradeCard({ quiz, enrollmentDate, onNavigate }: any) {
    const router = useRouter();

    const { data: attemptResponse } = useGetLatestQuizAttemptQuery(quiz.id);
    const attempt = attemptResponse;

    const daysToAdd = quiz.expired_date || 0;

    let deadlineDate = new Date();
    let deadlineString = "--/--/----";

    if (enrollmentDate) {
        const enrolled = new Date(enrollmentDate);
        deadlineDate = new Date(enrolled.setDate(enrolled.getDate() + daysToAdd));
        deadlineString = formatDateDisplay(deadlineDate);
    }

    const isOverdue = new Date() > deadlineDate;

    const score = (attempt && typeof attempt.correct_count === 'number' && attempt.total_questions > 0)
        ? `${((attempt.correct_count / attempt.total_questions) * 100).toFixed(2)}`
        : null;

    const isPassed = attempt?.is_passed;

    return (
        <Card
            className="!rounded-[20px] !border-[var(--color-gray-300)] cursor-pointer hover:!border-[var(--color-secondary)] transition-all mb-2"
        // onClick={() => onNavigate(quiz)}
        >
            <div className="grid grid-cols-12 gap-2 items-center w-full p-2">
                <div className="col-span-6 flex gap-4 items-center">
                    <div className="shrink-0">
                        {isPassed ? (
                            <Check className="w-8 h-8 rounded-full text-[var(--color-secondary)] bg-[var(--color-neutral)] p-2" />
                        ) : (
                            <Circle className="w-8 h-8 rounded-full text-[var(--color-secondary)] bg-[var(--color-neutral)] p-2" />
                        )}
                    </div>
                    <div className="flex flex-col truncate">
                        <p className="text-[1rem] font-bold text-[var(--color-primary)] truncate">
                            {quiz.lesson?.lesson_name || quiz.lesson_name}
                        </p>
                        <p className="text-sm font-light text-gray-500">Quiz</p>
                    </div>
                </div>

                <div className="col-span-2 flex justify-center text-center">
                    {score === null ? (
                        <span className="text-gray-400">Chưa làm</span>
                    ) : (
                        <span className={`text-sm font-medium ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                            {isPassed ? "Đạt" : "Chưa đạt"}
                        </span>
                    )}
                </div>

                <div className="col-span-3 flex flex-col items-center justify-center text-center text-sm">
                    <span className={isOverdue ? "text-red-500 font-medium" : "text-gray-500"}>
                        {deadlineString}
                    </span>
                    {isOverdue && <span className="text-[10px] text-red-400">(Đã hết hạn)</span>}
                </div>

                <div className="col-span-1 flex justify-center font-bold text-[var(--color-primary)]">
                    {score !== null ? score : '-'}
                </div>
            </div>
        </Card>
    );
}