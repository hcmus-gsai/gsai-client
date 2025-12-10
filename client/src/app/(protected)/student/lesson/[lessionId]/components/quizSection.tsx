import '@ant-design/v5-patch-for-react-19';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Form, Input, Switch, Progress, Calendar } from "antd";
import { useGetQuizByLessonIdQuery } from '@/store/api/[module]/quizApi';
import { useRouter } from 'next/dist/client/components/navigation';

const QuizContent = ({ lessonId }: { lessonId: string }) => {

    localStorage.setItem("lessonId", lessonId);

    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(true);

    const { data: quizRes } = useGetQuizByLessonIdQuery(lessonId);
    const quiz = quizRes;

    return (
        <div className="flex-1">
            <div className="w-full flex items-center justify-start mb-[1rem]">
                <p className="text-[1.5rem] font-bold text-[var(--color-primary)]">{quiz?.lesson_name}</p>
            </div>

            <Card
                className="!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-neutral)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
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

                    <Button
                        onClick={() => router.push(`/student/quiz/${quiz?.quiz_id}`)}
                        className="!w-[155px] !h-[54px] !rounded-full !flex !items-center !justify-center !bg-[var(--color-secondary)] !text-white"
                    >
                        Bắt đầu
                    </Button>
                </div>

            </Card>

            {!isCompleted ? (
                <Card
                    className="!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-bg_white)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
                >
                    <p className="text-[1rem] font-bold text-[var(--color-primary)]">Điểm</p>
                    <p className="text-[0.875rem] text-[var(--color-primary)]">Bạn chưa hoàn thành bài quiz này. Điểm cao nhát sẽ được ghi nhớ.</p>
                    <p className="text-[0.875rem] text-[var(--color-primary)]">Điểm cao nhất: 100/100</p>
                </Card>
            ) : (
                <Card
                    className="!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-bg_white)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
                >
                    <p className="text-[1rem] font-bold text-[var(--color-primary)]">Điểm của bạn</p>
                    <div className="w-full flex items-center justify-between gap-[1rem]">
                        <Progress
                            percent={75}
                            type="circle"
                            size={200}
                            strokeWidth={12}
                            strokeLinecap="square"
                            format={() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className="text-[1rem] font-bold text-[var(--color-primary)]">Trả lời đúng</div>
                                    <div className="text-[1.5rem] font-bold text-[var(--color-secondary)]">
                                        4 / 15
                                    </div>
                                </div>
                            )}

                        />


                        <Progress
                            percent={75}
                            type="circle"
                            size={200}
                            strokeWidth={12}
                            strokeLinecap="square"
                            format={() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className="text-[2.5rem] font-bold text-[var(--color-secondary)]">
                                        2.67
                                    </div>
                                </div>
                            )}
                        />

                        <Progress
                            percent={75}
                            type="circle"
                            size={200}
                            strokeWidth={12}
                            strokeLinecap="square"
                            format={() => (
                                <div style={{ textAlign: 'center', fontSize: 16, lineHeight: 1.2 }}>
                                    <div className="text-[1rem] font-bold text-[var(--color-primary)]">Thời gian</div>
                                    <div className="text-[1.5rem] font-bold text-[var(--color-secondary)]">
                                        29:28
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </Card>
            )
            }


        </div>
    )
}

export default QuizContent;