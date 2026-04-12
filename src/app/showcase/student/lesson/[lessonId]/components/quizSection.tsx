"use client";

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Switch, Progress, Calendar } from "antd";
import { useGetQuizByLessonIdQuery, useGetLatestQuizAttemptQuery } from '@/store/api/[module]/quizApi';
import { useRouter } from 'next/dist/client/components/navigation';

import { redirect } from 'next/navigation';
import { useAppDispatch } from '@/store/hook';
import { addNotification } from '@/store/slice/notifySlice';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

const QuizContent = ({ lessonId }: { lessonId: string }) => {

    const router = useRouter();

    const dispatch = useAppDispatch();
    const { data: quizRes, error } = useGetQuizByLessonIdQuery(lessonId);
    const quiz = quizRes;
    useEffect(() => {
        if (isFetchBaseQueryError(error) && error.status === 403) {
            dispatch(addNotification({
                type: 'error',
                message: 'Cần quyền truy cập',
                description: 'Bạn chưa đăng ký môn học này!',
                createdAt: Date.now(),
                isShown: false
            }));

            redirect('/showcase/student'); 
        }
    }, [error]);

    const { data: latestAttempt } = useGetLatestQuizAttemptQuery(
        quiz?.quiz_id!, {
        skip: !quiz?.quiz_id,
    });

    const [isCompleted, setIsCompleted] = useState(false);
    useEffect(() => {
        if (latestAttempt?.status === 'graded') {
            setIsCompleted(true);
        } else {
            setIsCompleted(false);
        }
    }, [latestAttempt]);

    const formatTime = (s: number) => ({
        hours: Math.floor(s / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
    });

    return (
        <div className="flex-1">
            <Card
                className="!mb-[1.5rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-white [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
            >
                <p className="text-[1rem] font-bold text-[var(--color-primary)]">Thông tin chi tiết</p>
                <div className="flex items-start justify-between gap-[1rem]">
                    <div className="w-full flex items-start justify-start gap-[0.5rem]">
                        <div>
                            <p className="text-[1rem] text-[var(--color-primary)]">Hết hạn vào</p>
                            <p className="text-[0.875rem] text-[var(--color-primary)]">{quiz?.expired_date}</p>
                        </div>
                        <div>
                            <p className="text-[1rem] text-[var(--color-primary)]">Thời gian</p>
                            <p className="text-[0.875rem] text-[var(--color-primary)]">{quiz?.duration} phút</p>
                        </div>
                    </div>

                    {!isCompleted ? (
                        <Button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem("lessonId", lessonId);
                                }
                                router.push(`/student/quiz/${quiz?.quiz_id}`);
                            }}
                            className="!w-[155px] !h-[54px] !rounded-full !flex !items-center !justify-center !bg-[var(--color-secondary)] !text-white !border !border-[var(--color-secondary)]
                                    hover:!bg-neutral hover:!text-[var(--color-secondary)]"
                        >
                            Bắt đầu
                        </Button>
                    ) : (
                        <Button
                            onClick={() => router.push(`/student/quiz/${quiz?.quiz_id}`)}
                            className="!w-[155px] !h-[54px] !rounded-full !flex !items-center !justify-center !bg-white !text-[var(--color-secondary)] !border !border-[var(--color-secondary)]
                                    hover:!bg-[var(--color-secondary)] hover:!text-white"
                        >
                            Làm lại
                        </Button>
                    )}
                </div>
            </Card >

            {!isCompleted ? (
                <Card
                    className="!mb-[1.5rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-bg_white)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
                >
                    <p className="text-[1rem] font-bold text-[var(--color-primary)]">Điểm</p>
                    <p className="text-[0.875rem] text-[var(--color-primary)]">Bạn chưa hoàn thành bài quiz này. Kết quả cao nhất sẽ được ghi nhớ.</p>
                    <p className="text-[0.875rem] text-[var(--color-primary)]">Điểm cao nhất: 100/100</p>
                </Card>
            ) : (
                <Card
                    className="!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-bg_white)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
                >
                    <p className="text-[1rem] font-bold text-[var(--color-primary)]">Điểm của bạn</p>
                    <div className="w-full flex items-center justify-between gap-[1rem]">
                        <Progress
                            percent={(latestAttempt?.correct_count! / latestAttempt?.total_questions!) * 100}
                            type="circle"
                            size={200}
                            strokeWidth={12}
                            strokeLinecap="square"
                            strokeColor="var(--color-accent)"
                            format={() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className="text-[1rem] font-bold text-[var(--color-primary)]">Trả lời đúng</div>
                                    <div className="text-[1.5rem] font-bold text-[var(--color-secondary)]">
                                        {latestAttempt?.correct_count} / {latestAttempt?.total_questions}
                                    </div>
                                </div>
                            )}

                        />


                        <Progress
                            percent={latestAttempt?.score_percentage! * 100}
                            type="circle"
                            size={200}
                            strokeWidth={12}
                            strokeLinecap="square"
                            strokeColor="var(--color-accent)"
                            format={() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className="text-[2.5rem] font-bold text-[var(--color-secondary)]">
                                        {(latestAttempt?.score_percentage! * 100).toFixed(2)}
                                    </div>
                                </div>
                            )}
                        />

                        <Progress
                            percent={(latestAttempt?.time_used! / (quiz?.duration! * 60)) * 100}
                            type="circle"
                            size={200}
                            strokeWidth={12}
                            strokeLinecap="square"
                            strokeColor="var(--color-accent)"
                            format={() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className="text-[1rem] font-bold text-[var(--color-primary)]">Thời gian</div>
                                    <div className="text-[1.5rem] font-bold text-[var(--color-secondary)]">
                                        {formatTime(latestAttempt?.time_used || 0).hours}:{formatTime(latestAttempt?.time_used || 0).minutes}:{formatTime(latestAttempt?.time_used || 0).seconds}
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </Card>
            )}
        </div >
    )
}

export default QuizContent;