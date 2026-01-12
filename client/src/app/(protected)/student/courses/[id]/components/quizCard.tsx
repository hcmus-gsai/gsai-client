'use client';

import Image from "next/image";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import { useGetLatestQuizAttemptQuery } from '@/store/api/[module]/quizApi';
import ComputingIcon from "@/../public/student/ComputingIcon.svg";
import { useEffect } from "react";

interface Props {
    quiz: any;
    enrollment: any;
    onVisible: () => void;
}

function formatDate(dateString: string) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function addDays(dateString: string, days: number) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return formatDate(date.toISOString());
}

function isExpired(dateString: string, days: number) {
    const deadline = addDays(dateString, days);
    const now = new Date();
    return new Date(deadline) < now;
}

export function QuizCard({ quiz, enrollment, onVisible }: Props) {
    const router = useRouter();

    const { data: attempt } = useGetLatestQuizAttemptQuery(quiz.id);
    console.log('Attempt: ', attempt)

    useEffect(() => {
        onVisible();
    }, [onVisible]);

    const expired = isExpired(enrollment.enrolled_at, quiz.expired_date || 0);

    if (attempt?.status === 'graded') {
        return (<div className = "text-light">Chưa có sự kiện nào</div>);

    }

    return (
        <Card
            className={`w-full min-h-[80px] rounded-[20px] shrink-0 cursor-pointer !border
                ${expired ? '!border-red-400 bg-red-50' : '!border-gray-300'}`}
            styles={{
                body: {
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                },
            }}
            onClick={() => router.push(`/student/lesson/${quiz.lesson_id}/${quiz.lesson.type}`)}
        >
            <div className="bg-[var(--color-neutral)] w-[48px] h-[48px] rounded-full flex items-center justify-center">
                <Image src={ComputingIcon} alt="Icon" width={20} height={20} />
            </div>

            <div className="flex-1 min-w-0">
                <p className={`font-bold truncate ${expired ? 'text-red-600' : 'text-[var(--color-primary)]'}`}>
                    {quiz.lesson.lesson_name}
                </p>

                <p className={`text-xs ${expired ? 'text-red-500' : 'text-[var(--color-primary)]'}`}>
                    Hết hạn vào {addDays(enrollment.enrolled_at, quiz.expired_date || 0)}
                </p>
            </div>
        </Card>
    );
}