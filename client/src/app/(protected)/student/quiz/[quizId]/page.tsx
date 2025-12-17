'use client';
import '@ant-design/v5-patch-for-react-19';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetQuizQuestionsByQuizIdQuery, useGetQuizByLessonIdQuery, useSubmitQuizMutation, useGradeQuizAttemptMutation } from '@/store/api/[module]/quizApi';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';;

const QuizSection = () => {

    // Quiz Info
    const [lessonId, setLessonId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("lessonId");
        if (id) setLessonId(id);
    }, []);

    const { data: quizRes } = useGetQuizByLessonIdQuery(lessonId!, { skip: !lessonId });
    const quiz = quizRes;

    // Handle Submit
    type ModalType = 'confirm' | 'auto' | null;
    const [modalType, setModalType] = useState<ModalType>(null);
    const [submitQuiz] = useSubmitQuizMutation();
    const [gradeQuiz] = useGradeQuizAttemptMutation();

    const handleSubmit = async () => {
        try {
            setModalType(null);

            const payload = Object.entries(answers).map(
                ([question_id, selected_option_id]) => ({
                    question_id,
                    selected_option_id,
                    student_answer_text: "",
                })
            );
            console.log('Submitting payload:', payload);

            const res = await submitQuiz({
                quiz_id: quiz?.quiz_id as string,
                answers: payload
            }).unwrap();

            console.log('Submit response:', res);

            await gradeQuiz({ attempt_id: res.attempt.id }).unwrap();
        }
        catch (error) {
            console.error("Failed to submit quiz:", error);
        }
    };

    // Time Remaining
    const [timeLeft, setTimeLeft] = useState(0);
    const hasSubmittedRef = useRef(false);

    useEffect(() => {
        if (!quiz?.duration) return;

        const TOTAL_TIME = quiz.duration * 60;
        setTimeLeft(TOTAL_TIME);
        hasSubmittedRef.current = false;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1 && !hasSubmittedRef.current) {
                    hasSubmittedRef.current = true;
                    clearInterval(interval);
                    setModalType('auto');

                    setTimeout(handleSubmit, 3000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [quiz?.duration]);

    const formatTime = (s: number) => {
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;
        return { hours, minutes, seconds };
    }

    // Questions Info
    const { quizId } = useParams();
    const { data: questionRes } = useGetQuizQuestionsByQuizIdQuery(quizId as string);
    const questions = questionRes;
    const [answers, setAnswers] = useState<Record<string, string>>({});

    return (
        <section className="w-full flex justify-center px-6 pt-[6rem] mb-[2rem]">
            <nav className="fixed top-0 left-0 w-full h-[5rem] border-b border-gray-200 bg-white z-20">
                <div className="max-w-[var(--global-width)] mx-auto mt-3 flex items-center justify-between px-6">
                    <div className="flex items-center gap-5">
                        <ArrowLeftOutlined
                            onClick={() => window.history.back()}
                            className="text-xl cursor-pointer"
                        />
                        <div>
                            <h1 className="text-xl font-semibold">{quiz?.lesson_name}</h1>
                            <p className="text-sm text-gray-500">{quiz?.duration} phút</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        Hết hạn vào {quiz?.expired_date}
                    </p>
                </div>
            </nav>
            <div className="max-w-[var(--global-width)] w-full grid grid-cols-[1fr_20rem] gap-8">
                {/* Questions */}
                <div className="flex flex-col gap-6">
                    {questions?.map((q) => {
                        const isAnswered = !!answers[q.id];
                        return (
                            <div
                                key={q.id}
                                className="mb-8 p-4 rounded-lg w-full transition bg-[var(--color-white)]"
                            >
                                {/* Question */}
                                <div className="flex items-center justify-between w-full mb-2 gap-4">
                                    <h2 className="text-lg font-regular flex-1 truncate">
                                        Câu {q.order_index}: {q.question_text}
                                    </h2>
                                    <span className="text-sm font-normal !bg-[var(--color-neutral)] rounded-full px-3 py-1 !text-[var(--color-secondary)] whitespace-nowrap">
                                        {q.points} điểm
                                    </span>
                                </div>

                                {/* Options */}
                                <ul className="space-y-2">
                                    {q.options.map((o) => (
                                        <li key={o.id}>
                                            <label className="relative flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 leading-none">
                                                <input
                                                    type="radio"
                                                    name={`quiz-${q.id}`}
                                                    value={o.id}
                                                    checked={answers[q.id] === o.id}
                                                    onChange={() =>
                                                        setAnswers((prev) => ({
                                                            ...prev,
                                                            [q.id]: o.id,
                                                        }))
                                                    }
                                                />
                                                <span className={`text-gray-800 text-base ${answers[q.id] === o.id
                                                    ? "text-[var(--color-secondary)]"
                                                    : ""
                                                    }`}
                                                >
                                                    {o.option_text}
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Timer & Progress */}
                <aside className="sticky top-24 h-fit flex flex-col items-center border border-gray-200 rounded-lg p-3 gap-3">
                    {/* Timer */}
                    <h2 className="text-2xl font-semibold mb-4">Thời gian còn lại</h2>
                    <div className="text-3xl font-bold mb-4 flex gap-6 justify-center">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                                <div>{formatTime(timeLeft).hours.toString().padStart(2, '0')}</div>
                                <p className="text-sm font-normal">giờ</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div>{formatTime(timeLeft).minutes.toString().padStart(2, '0')}</div>
                                <p className="text-sm font-normal">phút</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div>{formatTime(timeLeft).seconds.toString().padStart(2, '0')}</div>
                                <p className="text-sm font-normal">giây</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {questions?.map((q) => {
                            const isAnswered = !!answers[q.id];
                            return (
                                <div
                                    key={q.id}
                                    className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium
                        ${isAnswered
                                            ? "bg-[var(--color-neutral)]"
                                            : "bg-[var(--color-secondary-light)]"
                                        }
                    `}
                                >
                                    {q.order_index}
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        className="!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                        onClick={() => setModalType('confirm')}
                    >
                        Nộp bài
                    </Button>
                </aside>
            </div>

            {/* Submit Modals */}
            {modalType === 'confirm' && (
                <SubmitModal
                    onCancel={() => setModalType(null)}
                    onSubmit={handleSubmit}
                />
            )}
            {modalType === 'auto' && <AutoSubmitModal />}
        </section >

    );
};

type Props = {
    onCancel: () => void;
    onSubmit: () => void;
};

function SubmitModal({ onCancel, onSubmit }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blur background */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Pop up */}
            <div className="relative flex flex-col items-center justify-center
                      bg-white rounded-xl shadow-xl
                      w-[480px] h-[200px] px-6 text-center">
                <h2 className="text-lg font-semibold mb-2">Nộp bài</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Bạn có chắc muốn nộp bài ngay không?
                </p>

                <div className="flex justify-end gap-3">
                    <Button
                        className="!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-secondary)] !bg-[var(--color-bg-white)] !border-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-bg-white)] hover:!bg-[var(--color-secondary)]"
                        onClick={onCancel}
                    >
                        Hủy
                    </Button>

                    <Button
                        className="!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                        onClick={onSubmit}
                    >
                        Nộp bài
                    </Button>
                </div>
            </div>
        </div>
    );
}

function AutoSubmitModal() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blur background */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Pop up */}
            <div className="relative flex flex-col items-center justify-center
                      bg-white rounded-xl shadow-xl
                      w-[480px] h-[160px] px-6 text-center">
                <h2 className="text-lg font-semibold mb-2">Nộp bài</h2>
                <p className="text-sm text-gray-600">
                    Thời gian đã hết. Bài làm của bạn sẽ được nộp.
                </p>
            </div>
        </div>
    );
}

export default function SolvingQuizPage() {
    return (
        <div>
            <QuizSection />
        </div>
    )
}