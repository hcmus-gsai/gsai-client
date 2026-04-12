'use client';
import '@ant-design/v5-patch-for-react-19';
import { Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetQuizQuestionsByQuizIdQuery, useGetQuizByLessonIdQuery, useSubmitQuizMutation, useGradeQuizAttemptMutation } from '@/store/api/[module]/quizApi';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';

const QuizSection = () => {

    // Quiz Info
    const [lessonId, setLessonId] = useState<string | null>(null);

    useEffect(() => {
        const storedLessonId = localStorage.getItem("lessonId");
        if (storedLessonId) setLessonId(storedLessonId);
    }, []);

    const { data: quizRes, isLoading } = useGetQuizByLessonIdQuery(lessonId!, { skip: !lessonId });
    const quiz = quizRes;
    const TOTAL_TIME = quiz?.duration ? quiz.duration * 60 : 0;

    // Handle Submit
    type ModalType = 'confirm' | 'auto' | 'retry' | null;
    const [modalType, setModalType] = useState<ModalType>(null);
    const [submitQuiz] = useSubmitQuizMutation();
    const [gradeQuiz] = useGradeQuizAttemptMutation();
    const [grade, setGrade] = useState<any>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [timeUsed, setTimeUsed] = useState<number | null>(null);
    const [attempt, setAttempt] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setModalType(null);

            const used = TOTAL_TIME - timeLeft;
            setTimeUsed(used);

            const payload = Object.entries(answers).map(
                ([question_id, selected_option_id]) => ({
                    question_id,
                    selected_option_id,
                    student_answer_text: "",
                })
            );

            const submitQuizRes = await submitQuiz({
                quiz_id: quiz?.quiz_id as string,
                answers: payload,
                time_used: used,
            }).unwrap();

            const gradeQuizRes = await gradeQuiz({ attempt_id: submitQuizRes.id }).unwrap();

            setAttempt(submitQuizRes);
            setGrade(gradeQuizRes);
            setIsCompleted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const responseMap = useMemo(() => {
        if (Object.keys(grade).length === 0) return {};
        return Object.fromEntries(
            grade.map((r: any) => [r.quession_id, r])
        );
    }, [grade]);

    // Handle retry after completion
    const handleRetry = () => {
        setAnswers({});
        setIsCompleted(false);
        setGrade({});

        if (quiz?.duration) {
            setTimeLeft(TOTAL_TIME);
            hasSubmittedRef.current = false;
        }
    }

    // Time Remaining
    const [timeLeft, setTimeLeft] = useState(0);
    const hasSubmittedRef = useRef(false);

    useEffect(() => {
        if (!quiz?.duration) return;

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

    // console.log(typeof(quiz?.expired_date));

    const formatTime = (s: number) => {
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;
        return { hours, minutes, seconds };
    }

    const formatExpiredDate = (isoString?: string | null) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        const mo = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();

        return `${h}:${m} ngày ${d}/${mo}/${y}`;
    };

    // Questions Info
    const { quizId } = useParams();
    const { data: questionRes } = useGetQuizQuestionsByQuizIdQuery(quizId as string, { skip: !quizId });
    const questions = questionRes;
    const [answers, setAnswers] = useState<Record<string, string>>({});
    // const totalQuestions = questions?.length ?? 0;
    const [isPaletteExpanded, setIsPaletteExpanded] = useState(false);

    // Handle loading state
    if (!lessonId) return <div>Đang tải bài học...</div>;
    if (isLoading || !quiz) return <div>Đang tải quiz...</div>;

    return (
        <section className="w-full flex justify-center px-6 pt-[6rem] mb-[2rem]">
            {/* Navbar */}
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

                    <p className="hidden md:block text-xs lg:text-sm text-gray-500">
                        Hết hạn vào {formatExpiredDate(quiz?.expired_date)}
                    </p>
                </div>
            </nav>

            {/* QA section */}
            {/* <div className="max-w-[var(--global-width)] w-full grid grid-cols-[1fr_20rem] gap-8"> */}
            <div className="max-w-[var(--global-width)] w-full grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-8">
                {!isCompleted ? (
                    // In-progress
                    <>
                        {/* LEFT: Questions */}
                        {/* <div className="flex flex-col gap-6"> */}
                        <div className="flex flex-col gap-6 order-2 lg:order-1">
                            {questions?.map((q) => (
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
                                            {q.points * 100} điểm
                                        </span>
                                    </div>

                                    {/* Options */}
                                    <ul className="space-y-2">
                                        {q.options.map((o) => (
                                            <li key={o.id}>
                                                <label className="relative flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                                                    <input
                                                        type="radio"
                                                        name={`quiz-${q.id}`}
                                                        checked={answers[q.id] === o.id}
                                                        onChange={() =>
                                                            setAnswers((prev) => ({
                                                                ...prev,
                                                                [q.id]: o.id,
                                                            }))
                                                        }
                                                    />
                                                    <span
                                                        className={`text-base ${answers[q.id] === o.id
                                                            ? "text-[var(--color-secondary)]"
                                                            : "text-gray-800"
                                                            }`}
                                                    >
                                                        {o.option_text}
                                                    </span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Timer & Progress */}
                        {/* <aside className="sticky top-24 h-fit flex flex-col items-center border border-gray-200 rounded-lg p-3 gap-4"> */}
                        <aside className="sticky top-[6rem] lg:top-24 h-fit flex flex-col items-center border border-gray-200 rounded-lg p-3 gap-4 bg-white z-10 order-1 lg:order-2 shadow-sm lg:shadow-none">
                            <h2 className="text-xl font-semibold">Thời gian còn lại</h2>
                            <div className="text-xl lg:text-3xl font-bold mb-4 flex gap-6 justify-center">
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

                            <div className="w-full flex flex-col items-center">
                                <div 
                                    className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out flex flex-wrap gap-2 justify-center
                                    ${isPaletteExpanded ? 'max-h-[50rem]' : 'max-h-[2.2rem] lg:max-h-[50rem]'}`}
                                >
                                    {questions?.map((q) => (
                                        <div
                                            key={q.id}
                                            className={`w-7 h-7 text-xs lg:w-10 lg:h-10 lg:text-sm shrink-0 flex items-center justify-center rounded-md font-medium ${
                                                answers[q.id]
                                                    ? "bg-[var(--color-neutral)] text-[var(--color-secondary)]"
                                                    : "bg-gray-200"
                                            }`}
                                        >
                                            {q.order_index}
                                        </div>
                                    ))}
                                </div>

                                {questions && questions.length > 12 && (
                                    <button
                                        onClick={() => setIsPaletteExpanded(!isPaletteExpanded)}
                                        className="mt-3 text-sm text-gray-500 hover:text-[var(--color-secondary)] lg:hidden flex items-center justify-center w-full py-2 border-t border-gray-100"
                                    >
                                        {isPaletteExpanded ? 'Thu gọn ▲' : 'Xem tất cả ▼'}
                                    </button>
                                )}
                            </div>

                            <Button
                                className="!form_button !w-[6rem] !h-[2rem] lg:!w-[12.5rem] lg:!h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                                onClick={() => setModalType("confirm")}
                            >
                                Nộp bài
                            </Button>
                        </aside>
                    </>
                ) : (
                    // Completed
                    <>
                        {/* LEFT: Questions */}
                        <div className="flex flex-col gap-6 order-2 lg:order-1">
                            {questions?.map((q) => (
                                <div
                                    key={q.id}
                                    className="mb-8 p-4 rounded-lg w-full transition bg-[var(--color-white)]"
                                >
                                    {/* Question */}
                                    <div className="flex items-center justify-between w-full mb-2 gap-4">
                                        <h2 className="text-lg font-regular flex-1 truncate">
                                            Câu {q.order_index}: {q.question_text}
                                        </h2>
                                    </div>

                                    {/* Options */}
                                    <ul className="space-y-2">
                                        {q.options.map((o) => {
                                            const res = responseMap[q.id];
                                            const isSelected = res?.selected_option_id === o.id;

                                            let optionClass = "text-gray-800";
                                            if (isSelected) {
                                                optionClass = res.is_correct
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700";
                                            }

                                            return (
                                                <li key={o.id}>
                                                    <label
                                                        className={`flex items-center gap-3 p-2 rounded-lg ${optionClass}`}
                                                    >
                                                        <input type="radio" disabled checked={isSelected} />
                                                        <span>{o.option_text}</span>
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Timer & Progress */}
                        <aside className="sticky top-[6rem] lg:top-24 h-fit flex flex-col items-center border border-gray-200 rounded-lg p-3 gap-4 bg-white z-10 order-1 lg:order-2 shadow-sm lg:shadow-none">
                            <h2 className="text-xl font-semibold">Thời gian hoàn thành</h2>

                            {timeUsed !== null && (
                                <div className="text-xl lg:text-3xl font-bold mb-4 flex gap-6 justify-center">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center">
                                            <div>{formatTime(timeUsed).hours.toString().padStart(2, '0')}</div>
                                            <p className="text-sm font-normal">giờ</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div>{formatTime(timeUsed).minutes.toString().padStart(2, '0')}</div>
                                            <p className="text-sm font-normal">phút</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div>{formatTime(timeUsed).seconds.toString().padStart(2, '0')}</div>
                                            <p className="text-sm font-normal">giây</p>
                                        </div>
                                    </div>
                                </div>
                                // <div className="text-3xl font-bold mb-4 flex gap-6 justify-center">
                                //     <div className="flex items-center gap-6">
                                //         <div className="flex flex-col items-center">
                                //             <div>{formatTime(timeUsed).hours.toString().padStart(2, '0')}</div>
                                //             <p className="text-sm font-normal">giờ</p>
                                //         </div>
                                //         <div className="flex flex-col items-center">
                                //             <div>{formatTime(timeUsed).minutes.toString().padStart(2, '0')}</div>
                                //             <p className="text-sm font-normal">phút</p>
                                //         </div>
                                //         <div className="flex flex-col items-center">
                                //             <div>{formatTime(timeUsed).seconds.toString().padStart(2, '0')}</div>
                                //             <p className="text-sm font-normal">giây</p>
                                //         </div>
                                //     </div>
                                // </div>
                            )}

                            <p className="text-base font-medium m-4">
                                Trả lời đúng:{" "}
                                <span>
                                    {attempt?.correct_count} / {attempt?.total_questions}
                                </span>
                            </p>

                            <div className="w-full flex flex-col items-center">
                                <div 
                                    className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out flex flex-wrap gap-2 justify-center
                                    ${isPaletteExpanded ? 'max-h-[50rem]' : 'max-h-[2.2rem] lg:max-h-[50rem]'}`}
                                >
                                    {questions?.map((q) => {
                                        const res = responseMap[q.id];
                                        let bgClass = "bg-gray-200";

                                        if (res) {
                                            bgClass = res.is_correct
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700";
                                        }
                                        return (
                                            <div
                                                key={q.id}
                                                className={`w-7 h-7 text-xs lg:w-10 lg:h-10 lg:text-sm shrink-0 flex items-center justify-center rounded-md font-medium ${bgClass}`}
                                            >
                                                {q.order_index}
                                            </div>
                                        );
                                    })}
                                </div>

                                {questions && questions.length > 12 && (
                                    <button
                                        onClick={() => setIsPaletteExpanded(!isPaletteExpanded)}
                                        className="mt-3 text-sm text-gray-500 hover:text-[var(--color-secondary)] lg:hidden flex items-center justify-center w-full py-2 border-t border-gray-100"
                                    >
                                        {isPaletteExpanded ? 'Thu gọn ▲' : 'Xem tất cả ▼'}
                                    </button>
                                )}
                            </div>

                            <Button
                                className="!form_button !w-[6rem] !h-[2rem] lg:!w-[12.5rem] lg:!h-[3.375rem] !text-[var(--color-secondary)] !bg-[var(--color-bg-white)] !border-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-bg-white)] hover:!bg-[var(--color-secondary)]"
                                onClick={() => setModalType("retry")}
                            >
                                Làm lại
                            </Button>
                        </aside>
                    </>
                )}
            </div>

            {/* Modals */}
            {modalType === 'confirm' && (
                <SubmitModal
                    onCancel={() => setModalType(null)}
                    onConfirm={handleSubmit}
                />
            )
            }
            {modalType === 'auto' && <AutoSubmitModal />}
            {modalType === 'retry' && (
                <RetryModal
                    onCancel={() => setModalType(null)}
                    onConfirm={() => {
                        setModalType(null);
                        handleRetry();
                    }}
                />
            )}

            {/* Submitting spinner */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
                    <Spin fullscreen tip="Đang nộp bài..." />
                </div>
            )}
        </section >
    );
};

type Props = {
    onCancel: () => void;
    onConfirm: () => void;
};

function RetryModal({ onCancel, onConfirm }: Props) {
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
                <h2 className="text-lg font-semibold mb-2">Làm lại</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Bạn có chắc muốn làm lại bài không?
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
                        onClick={onConfirm}
                    >
                        Làm lại
                    </Button>
                </div>
            </div>
        </div>
    );
}

function SubmitModal({ onCancel, onConfirm }: Props) {
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
                        onClick={onConfirm}
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