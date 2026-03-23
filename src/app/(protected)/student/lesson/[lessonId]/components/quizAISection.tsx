import '@ant-design/v5-patch-for-react-19';

import React, { useEffect } from 'react';
import { Button, Card } from "antd";
import { useGetQuizByLessonIdQuery } from '@/store/api/[module]/quizApi';

import { redirect } from 'next/navigation';
import { useAppDispatch } from '@/store/hook';
import { addNotification } from '@/store/slice/notifySlice';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

const QuizAIContent = ({ lessonId }: { lessonId: string }) => {

    localStorage.setItem("lessonId", lessonId);

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

            redirect('/student/home'); 
        }
    }, [error]);
    

    return (
        <div className="flex-1">
            <div className="w-full flex items-center justify-start mb-[1rem]">
                <p className="text-[1.5rem] font-bold text-[var(--color-primary)]">{quiz?.lesson_name}</p>
            </div>
            <Card
                className="!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-neutral)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
            >
                <p className="text-[1rem] font-bold text-[var(--color-primary)]">Luyện tập cùng AI</p>
                <div className="flex items-start justify-between gap-[1rem]">
                    <div className="w-full flex items-start justify-start">
                        Tận dụng AI để ôn luyện để đảm bảo bạn có sự chuẩn bị hoàn hảo nhất.
                    </div>

                    {/*
                      TODO (khi feature AI Quiz hoàn thiện):
                      1) Xóa overlay "Đang phát triển" bên dưới.
                      2) Bỏ disabled ở nút Bắt đầu bản hoạt động này để mở chức năng.
                    */}

                    <Button
                        disabled
                        className="!w-[155px] !h-[54px] !rounded-full !flex !items-center !justify-center !bg-[var(--color-secondary)] !text-white !border !border-[var(--color-secondary)] hover:!bg-neutral hover:!text-[var(--color-secondary)]"
                    >
                        Bắt đầu
                    </Button>
                </div>

                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[20px] bg-white/60 backdrop-blur-[2px]">
                    <span className="rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-[var(--color-secondary)] shadow-sm">
                        Đang phát triển
                    </span>
                </div>
            </Card>
        </div>
    )
}

export default QuizAIContent;