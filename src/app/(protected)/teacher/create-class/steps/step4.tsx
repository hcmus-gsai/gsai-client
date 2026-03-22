'use client'

import React, { useMemo, useState } from 'react';
import { Collapse, ConfigProvider, Form, Button, App } from 'antd';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from '@deemlol/next-icons';

import QuizIcon from '@/../public/shared/QuizIcon.svg';

import { Quiz, Step3Data } from '@/type/createClass.type';
import CreateClassIntro from '../components/create-class-intro';
import CreateClassQuizList from '../components/create-class-quiz-list';
import CreateClassQuizModal from '../components/create-class-quiz-modal';
import {
    useCreateLessonStepMutation,
    useDeleteLessonStepMutation,
    usePatchLessonStepMutation,
    useReorderLessonsStepMutation,
    useUpsertQuizStructureStepMutation,
} from '@/store/api/[module]/createClassApi';

interface Props {
    data: any;
    onNext: (data: Partial<Step3Data>) => void;
    onBack: () => void;
}

const extractApiErrorMessage = (error: any) => {
    const payloadMessage = error?.data?.message;

    if (Array.isArray(payloadMessage)) {
        return payloadMessage.join('; ');
    }

    if (typeof payloadMessage === 'string' && payloadMessage.trim()) {
        return payloadMessage;
    }

    if (typeof error?.message === 'string' && error.message.trim()) {
        return error.message;
    }

    return 'Lỗi không xác định từ server';
};

const Step4: React.FC<Props> = ({ data, onNext, onBack }) => {
    const { message } = App.useApp();

    const searchParams = useSearchParams();
    const [form] = Form.useForm();
    // form.resetFields();

    const [createLessonStep, { isLoading: isCreatingLesson }] = useCreateLessonStepMutation();
    const [patchLessonStep, { isLoading: isPatchingLesson }] = usePatchLessonStepMutation();
    const [deleteLessonStep, { isLoading: isDeletingLesson }] = useDeleteLessonStepMutation();
    const [reorderLessonsStep, { isLoading: isReorderingLessons }] = useReorderLessonsStepMutation();
    const [upsertQuizStructureStep, { isLoading: isSyncingQuizStructure }] = useUpsertQuizStructureStepMutation();

    const [quizs, setQuizs] = useState<Quiz[]>(data.quizs || []);
    const [chapter, setChapter] = useState<number>(0);
    const [modalQuiz, setModalQuiz] = useState(false);
    const [editingItem, setEditingItem] = useState<Quiz | null>(null);

    const chapters = useMemo(() => {
        if (Array.isArray(data.chapters) && data.chapters.length > 0) {
            return data.chapters;
        }

        return [
            { chapterName: 'Chương 1', description: '' },
            { chapterName: 'Chương 2', description: '' },
        ];
    }, [data.chapters]);

    const openQuizModal = (chapterIndex: number) => {
        setChapter(chapterIndex);
        setModalQuiz(true);
    };

    const handleClose = () => {
        setModalQuiz(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleDeleteItem = (createdAt: number) => {
        setQuizs((prev) => prev.filter((quiz) => quiz.createdAt !== createdAt));
    };

    const handleEditItem = (item: Quiz) => {
        setEditingItem(item);
        setChapter(item.chapter);
        setModalQuiz(true);

        form.setFieldsValue({
            quizName: item.quizName,
            expiredDate: item.expiredDate,
            duration: item.duration,
            questions: item.questions,
        });
        console.log(item);
    };

    const onFinishQuiz = (values: any) => {
        const updatedQuiz: Quiz = {
            quizName: values.quizName,
            expiredDate: Number(values.expiredDate || 1),
            duration: Number(values.duration || 0),
            questions: (values.questions || []).map((question: any) => {
                const normalizedOptions = (question.options || []).map((option: any) => {
                    if (typeof option === 'string') {
                        return { value: option };
                    }
                    return {
                        id: option?.id,
                        value: option?.value || '',
                    };
                });

                const optionCount = normalizedOptions.length;
                const safeCorrectOption = typeof question.correctOption === 'number' && question.correctOption >= 0
                    ? Math.min(question.correctOption, Math.max(optionCount - 1, 0))
                    : 0;

                return {
                    ...question,
                    options: normalizedOptions,
                    correctOption: safeCorrectOption,
                };
            }),
            chapter,
            contentType: 'quiz',
            order: editingItem?.order,
            lessonId: editingItem?.lessonId,
            moduleId: editingItem?.moduleId,
            createdAt: editingItem ? editingItem.createdAt : Date.now(),
        };

        if (editingItem) {
            setQuizs((prev) => prev.map((quiz) => quiz.createdAt === editingItem.createdAt ? updatedQuiz : quiz));
        } else {
            setQuizs((prev) => [...prev, updatedQuiz]);
        }

        handleClose();
    };

    const genHeader = (title: string, index: number) => (
        <>
            <div className="flex items-center justify-between w-full pr-4 mb-[2rem]">
                <span className="text-2xl font-bold text-[#1D3557]">
                    Chương {index}: {title}
                </span>
                <div className="flex gap-4 text-gray-500">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            openQuizModal(index);
                        }}
                        className="hover:scale-110 transition-transform active:opacity-70"
                    >
                        <Image src={QuizIcon} alt="Quiz" width={24} height={24} />
                    </button>
                </div>
            </div>
            <hr style={{ color: 'gray', opacity: 0.5 }} />
        </>
    );

    const collapseItems = chapters.map((chapterItem: any, index: number) => ({
        key: `${index + 1}`,
        label: genHeader(chapterItem.chapterName || `Chương ${index + 1}`, index + 1),
        children: (
            <CreateClassQuizList
                quizs={quizs}
                chapterIndex={index + 1}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
            />
        ),
    }));

    const onSubmitStep4 = async () => {
        const resumeCourseId = searchParams.get('courseId') || undefined;
        const courseId = (data.courseId as string | undefined) || resumeCourseId;
        if (!courseId) {
            message.error('Thiếu courseId. Vui lòng hoàn tất bước 1 trước.');
            return;
        }

        const chapterModuleMap = (data.chapters || []).reduce((acc: Record<number, string>, chapterItem: any, index: number) => {
            if (chapterItem.moduleId) {
                acc[index + 1] = chapterItem.moduleId;
            }
            return acc;
        }, {});

        const previousQuizs = (data.quizs || []) as Quiz[];
        const keptCreatedAt = new Set<number>(quizs.map((item) => item.createdAt));

        try {
            for (const previous of previousQuizs) {
                if (previous.lessonId && !keptCreatedAt.has(previous.createdAt)) {
                    await deleteLessonStep(previous.lessonId).unwrap();
                }
            }

            const savedQuizs: Quiz[] = [];
            for (let i = 0; i < quizs.length; i += 1) {
                const quiz = quizs[i];

                for (let questionIndex = 0; questionIndex < (quiz.questions || []).length; questionIndex += 1) {
                    const question = quiz.questions[questionIndex];
                    const options = question.options || [];
                    const correctOption = Number(question.correctOption ?? -1);

                    if (options.length < 2) {
                        throw new Error(`Quiz "${quiz.quizName}": Câu ${questionIndex + 1} phải có ít nhất 2 lựa chọn.`);
                    }

                    if (correctOption < 0 || correctOption >= options.length) {
                        throw new Error(`Quiz "${quiz.quizName}": Câu ${questionIndex + 1} chưa có đáp án đúng hợp lệ.`);
                    }
                }

                const moduleId = chapterModuleMap[quiz.chapter];
                if (!moduleId) {
                    throw new Error(`Thiếu moduleId cho chương ${quiz.chapter}`);
                }

                let lessonId = quiz.lessonId;
                if (lessonId) {
                    await patchLessonStep({
                        lessonId,
                        body: {
                            lesson_name: quiz.quizName,
                            contentType: 'quiz',
                            estimatedCompletionTime: String(quiz.duration || 0),
                        },
                    }).unwrap();
                } else {
                    const createdLesson = await createLessonStep({
                        moduleId,
                        body: {
                            name: quiz.quizName,
                            lesson_name: quiz.quizName,
                            moduleId,
                            orderIndex: i + 1,
                            contentType: 'quiz',
                            estimatedCompletionTime: String(quiz.duration || 0),
                        },
                    }).unwrap();
                    lessonId = createdLesson.id;
                }

                let syncedQuiz: { questions?: any[] };

                try {
                    syncedQuiz = await upsertQuizStructureStep({
                        lessonId,
                        body: {
                            expired_date: Math.max(Number(quiz.expiredDate || 1), 1),
                            duration: Math.max(Number(quiz.duration || 1), 1),
                            passing_score_percentage: 50,
                            questions: (quiz.questions || []).map((question, questionIndex) => {
                                const normalizedOptions = (question.options || []).map((option: any) => {
                                    if (typeof option === 'string') {
                                        return { option_text: option, is_correct: false };
                                    }

                                    return {
                                        id: option.id,
                                        option_text: option.value || '',
                                        is_correct: false,
                                    };
                                });

                                return {
                                    id: question.id,
                                    question_text: question.question,
                                    question_type: 'multiple_choice' as const,
                                    points: Number(question.score || 0),
                                    order_index: questionIndex + 1,
                                    options: normalizedOptions.map((option, optionIndex) => ({
                                        ...option,
                                        is_correct: question.correctOption === optionIndex,
                                    })),
                                };
                            }),
                        },
                    }).unwrap();
                } catch (upsertError) {
                    throw new Error(`Quiz "${quiz.quizName}" (chương ${quiz.chapter}) lưu thất bại: ${extractApiErrorMessage(upsertError)}`);
                }

                const syncedQuestions = [...(syncedQuiz.questions || [])]
                    .sort((a: any, b: any) => Number(a.order_index || 0) - Number(b.order_index || 0))
                    .map((question: any, questionIndex: number) => {
                        const sortedOptions = [...(question.options || [])]
                            .sort((a: any, b: any) => Number(a.order_index || 0) - Number(b.order_index || 0));

                        return {
                            id: question.id,
                            index: questionIndex + 1,
                            question: question.question_text,
                            score: Number(question.points || 0),
                            required: true,
                            correctOption: Math.max(
                                sortedOptions.findIndex((option: any) => option.is_correct),
                                0,
                            ),
                            options: sortedOptions.map((option: any) => ({
                                id: option.id,
                                value: option.option_text,
                            })),
                        };
                    });

                savedQuizs.push({
                    ...quiz,
                    questions: syncedQuestions,
                    lessonId,
                    moduleId,
                    order: i + 1,
                });
            }

            const savedLessons = (data.lessons || []) as Array<{ lessonId?: string; moduleId?: string; createdAt: number }>;
            const savedProjects = (data.projects || []) as Array<{ lessonId?: string; moduleId?: string; createdAt: number }>;

            const lessonOrderByModule = [...savedLessons, ...savedQuizs, ...savedProjects]
                .filter((item) => item.lessonId && item.moduleId)
                .sort((a, b) => a.createdAt - b.createdAt)
                .reduce((acc: Record<string, string[]>, item) => {
                    const moduleId = item.moduleId as string;
                    const lessonId = item.lessonId as string;

                    if (!acc[moduleId]) {
                        acc[moduleId] = [];
                    }

                    acc[moduleId].push(lessonId);
                    return acc;
                }, {});

            for (const [moduleId, lessonIds] of Object.entries(lessonOrderByModule)) {
                if (lessonIds.length > 0) {
                    await reorderLessonsStep({
                        moduleId,
                        body: {
                            lesson_ids: lessonIds,
                        },
                    }).unwrap();
                }
            }

            message.success('Đã lưu quiz');
            onNext({ quizs: savedQuizs });
        } catch (error) {
            console.error('Save step 4 failed', error);
            message.error(extractApiErrorMessage(error));
        }
    };

    return (
        <main className="w-full min-h-screen flex justify-center">
            <div className="relative w-[var(--global-width)] top-[15vh] mb-[200px] z-10">
                <CreateClassIntro step={4} title="Thêm quiz" />

                <ConfigProvider
                    theme={{
                        components: {
                            Collapse: {
                                headerBg: 'transparent',
                                contentPadding: '0px 16px',
                                headerPadding: '12px 0px',
                            },
                        },
                    }}
                >
                    <Collapse
                        items={collapseItems}
                        ghost
                        expandIconPosition="start"
                        expandIcon={({ isActive }) => (
                            <div className="flex items-center justify-center transition-all duration-300">
                                {isActive ? (
                                    <ChevronUp
                                        width={24}
                                        height={24}
                                        className="md:w-[32px] md:h-[32px] !text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300"
                                    />
                                ) : (
                                    <ChevronDown
                                        width={24}
                                        height={24}
                                        className="md:w-[32px] md:h-[32px] !text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300"
                                    />
                                )}
                            </div>
                        )}
                        className="bg-transparent"
                    />
                </ConfigProvider>

                <div className="w-full flex justify-center gap-8">
                    <Button
                        type="primary"
                        size="large"
                        onClick={onBack}
                        className="!w-[8.5rem] !h-[3.375rem] !text-[var(--color-secondary)] !bg-[var(--color-bg-white)] !border-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-bg-white)] hover:!bg-[var(--color-secondary)] hover:!border-[var(--color-bg-white)]"
                    >
                        Quay lại
                    </Button>

                    <Button
                        type="primary"
                        size="large"
                        onClick={onSubmitStep4}
                        loading={isCreatingLesson || isPatchingLesson || isDeletingLesson || isReorderingLessons || isSyncingQuizStructure}
                        className="!w-[8.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                    >
                        Tiếp tục
                    </Button>
                </div>

                <CreateClassQuizModal
                    visible={modalQuiz}
                    form={form}
                    onClose={handleClose}
                    onSubmit={onFinishQuiz}
                />
            </div>
        </main>
    );
};

export default Step4;
