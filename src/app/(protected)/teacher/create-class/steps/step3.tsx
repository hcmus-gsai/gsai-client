'use client'

import React, { useMemo, useState } from 'react';
import { Collapse, ConfigProvider, Form, Button, Input, Upload, UploadProps, message } from 'antd';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, X } from '@deemlol/next-icons';

import VideoIcon from '@/../public/shared/VideoIcon.svg';
import DocumentIcon from '@/../public/shared/DocumentIcon.svg';
import UploadIcon from '@/../public/shared/UploadIcon.svg';
import CreateClassEdit from '@/../public/teacher/createClassEdit.svg';
import CreateClassTrashRed from '@/../public/teacher/createClassTrashRed.svg';
import Link from "next/link";
import { Lesson, Step3Data } from '@/type/createClass.type';
import CreateClassIntro from '../components/create-class-intro';
import {
    useCreateDocumentMaterialStepMutation,
    useCreateLessonStepMutation,
    useCreateVideoMaterialStepMutation,
    useDeleteLessonStepMutation,
    usePatchLessonStepMutation,
    usePatchMaterialStepMutation,
    useReorderLessonsStepMutation,
} from '@/store/api/[module]/createClassApi';

interface Props {
    data: any;
    onNext: (data: Partial<Step3Data>) => void;
    onBack: () => void;
}

const Step3: React.FC<Props> = ({ data, onNext, onBack }) => {
    const searchParams = useSearchParams();
    const [form] = Form.useForm();

    const [createLessonStep, { isLoading: isCreatingLesson }] = useCreateLessonStepMutation();
    const [patchLessonStep, { isLoading: isPatchingLesson }] = usePatchLessonStepMutation();
    const [deleteLessonStep, { isLoading: isDeletingLesson }] = useDeleteLessonStepMutation();

    const [createDocumentMaterialStep, { isLoading: isCreatingDocument }] = useCreateDocumentMaterialStepMutation();
    const [createVideoMaterialStep, { isLoading: isCreatingVideo }] = useCreateVideoMaterialStepMutation();
    const [patchMaterialStep, { isLoading: isPatchingMaterial }] = usePatchMaterialStepMutation();
    const [reorderLessonsStep, { isLoading: isReorderingLessons }] = useReorderLessonsStepMutation();

    const [lessons, setLessons] = useState<Lesson[]>(data.lessons || []);
    const [chapter, setChapter] = useState<number>(0);
    const [modalLessonType, setModalLessonType] = useState<'video' | 'document' | ''>('');
    const [fileLessonName, setFileLessonName] = useState<string>('');
    const [editingItem, setEditingItem] = useState<Lesson | null>(null);

    const toNativeFile = (input: any): File | null => {
        if (Array.isArray(input)) {
            return input.length > 0 ? toNativeFile(input[0]) : null;
        }

        if (Array.isArray(input?.fileList)) {
            return input.fileList.length > 0 ? toNativeFile(input.fileList[0]) : null;
        }

        if (input instanceof File) {
            return input;
        }

        if (input?.originFileObj instanceof File) {
            return input.originFileObj;
        }

        return null;
    };

    const handleClose = () => {
        setModalLessonType('');
        setEditingItem(null);
        setFileLessonName('');
        form.resetFields();
    };

    const changeFileLessonSelect: UploadProps['onChange'] = (info) => {
        const lastFile = info.fileList.slice(-1)[0];
        setFileLessonName(lastFile?.name || '');
    };

    const chapters = useMemo(() => {
        if (Array.isArray(data.chapters) && data.chapters.length > 0) {
            return data.chapters;
        }

        return [
            { chapterName: 'Chương 1', description: '' },
            { chapterName: 'Chương 2', description: '' },
        ];
    }, [data.chapters]);

    const openLessonModal = (type: 'video' | 'document', chapterIndex: number) => {
        setChapter(chapterIndex);
        setModalLessonType(type);
    };

    const handleEditItem = (item: Lesson) => {
        setEditingItem(item);
        setChapter(item.chapter);
        setModalLessonType(item.type === 'video' ? 'video' : 'document');
        setFileLessonName((item.file as any)?.name || '');

        form.setFieldsValue({
            lessonName: item.lessonName,
            file: item.file ? [item.file] : [],
        });
    };

    const handleDeleteItem = (createdAt: number) => {
        setLessons((prev) => prev.filter((lesson) => lesson.createdAt !== createdAt));
    };

    const onFinishLesson = (values: any) => {
        if (!modalLessonType) {
            return;
        }

        const normalizedFile = Array.isArray(values.file)
            ? values.file[0]
            : values.file?.fileList?.[0] || values.file;

        const updatedLesson: Lesson = {
            lessonName: values.lessonName,
            file: normalizedFile,
            chapter,
            type: modalLessonType,
            contentType: 'lesson',
            order: editingItem?.order,
            lessonId: editingItem?.lessonId,
            materialId: editingItem?.materialId,
            moduleId: editingItem?.moduleId,
            estimatedCompletionTime: editingItem?.estimatedCompletionTime || '0',
            createdAt: editingItem ? editingItem.createdAt : Date.now(),
        };

        if (editingItem) {
            setLessons((prev) => prev.map((lesson) => lesson.createdAt === editingItem.createdAt ? updatedLesson : lesson));
        } else {
            setLessons((prev) => [...prev, updatedLesson]);
        }

        handleClose();
    };

    const renderChapterContent = (chapterIndex: number) => {
        const chapterLessons = lessons
            .filter((lesson) => lesson.chapter === chapterIndex)
            .sort((a, b) => a.createdAt - b.createdAt);

        if (chapterLessons.length === 0) {
            return (
                <div className="py-8 text-center text-gray-400 italic bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    Chưa có tài liệu cho chương này
                </div>
            );
        }

        return (
            <div className="mb-4 flex flex-col gap-3 py-4">
                {chapterLessons.map((item) => (
                    <div key={item.createdAt} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <Image src={item.type === 'video' ? VideoIcon : DocumentIcon} alt="icon" width={24} height={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1D3557]">{item.lessonName}</h4>
                                <p className="text-sm text-gray-400">{item.type === 'video' ? 'Video' : 'Tài liệu'}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Image
                                src={CreateClassEdit}
                                alt="edit"
                                width={20}
                                height={20}
                                className="cursor-pointer hover:opacity-70"
                                onClick={() => handleEditItem(item)}
                            />
                            <Image
                                src={CreateClassTrashRed}
                                alt="delete"
                                width={20}
                                height={20}
                                className="cursor-pointer hover:opacity-70"
                                onClick={() => handleDeleteItem(item.createdAt)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
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
                            openLessonModal('video', index);
                        }}
                        className="hover:scale-110 transition-transform active:opacity-70"
                    >
                        <Image src={VideoIcon} alt="Vid" width={24} height={24} />
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            openLessonModal('document', index);
                        }}
                        className="hover:scale-110 transition-transform active:opacity-70"
                    >
                        <Image src={DocumentIcon} alt="Doc" width={24} height={24} />
                    </button>
                </div>
            </div>
            <hr style={{ color: 'gray', opacity: 0.5 }} />
        </>
    );

    const collapseItems = chapters.map((chapterItem: any, index: number) => ({
        key: `${index + 1}`,
        label: genHeader(chapterItem.chapterName || `Chương ${index + 1}`, index + 1),
        children: renderChapterContent(index + 1),
    }));

    const onSubmitStep3 = async () => {
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

        const previousLessons = (data.lessons || []) as Lesson[];
        const keptCreatedAt = new Set<number>(lessons.map((item) => item.createdAt));

        try {
            for (const previous of previousLessons) {
                if (previous.lessonId && !keptCreatedAt.has(previous.createdAt)) {
                    await deleteLessonStep(previous.lessonId).unwrap();
                }
            }

            const savedLessons: Lesson[] = [];
            for (let i = 0; i < lessons.length; i += 1) {
                const lesson = lessons[i];
                const moduleId = chapterModuleMap[lesson.chapter];
                if (!moduleId) {
                    throw new Error(`Thiếu moduleId cho chương ${lesson.chapter}`);
                }

                let lessonId = lesson.lessonId;
                const wasExistingLesson = Boolean(lessonId);

                const requiresNewMaterialUpload = !lesson.materialId && !wasExistingLesson;
                const nativeFileForNewMaterial = requiresNewMaterialUpload ? toNativeFile(lesson.file) : null;

                if (requiresNewMaterialUpload && !nativeFileForNewMaterial) {
                    throw new Error(lesson.type === 'video' ? 'File video không hợp lệ' : 'File tài liệu không hợp lệ');
                }

                let createdNewLesson = false;

                try {
                    if (lessonId) {
                        await patchLessonStep({
                            lessonId,
                            body: {
                                lesson_name: lesson.lessonName,
                                contentType: lesson.type === 'video' ? 'video' : 'document',
                                estimatedCompletionTime: lesson.estimatedCompletionTime || '0',
                            },
                        }).unwrap();
                    } else {
                        const createdLesson = await createLessonStep({
                            moduleId,
                            body: {
                                name: lesson.lessonName,
                                lesson_name: lesson.lessonName,
                                moduleId,
                                orderIndex: i + 1,
                                contentType: lesson.type === 'video' ? 'video' : 'document',
                                estimatedCompletionTime: lesson.estimatedCompletionTime || '0',
                            },
                        }).unwrap();

                        lessonId = createdLesson.id;
                        createdNewLesson = true;
                    }

                    if (!lessonId) {
                        throw new Error('Không thể lưu bài giảng');
                    }

                    if (lesson.type === 'document') {
                        if (lesson.materialId) {
                            await patchMaterialStep({
                                materialId: lesson.materialId,
                                body: {
                                    material_type: 'document',
                                    material_name: lesson.lessonName,
                                },
                            }).unwrap();
                        } else if (!wasExistingLesson && nativeFileForNewMaterial) {
                            await createDocumentMaterialStep({
                                lessonId,
                                file: nativeFileForNewMaterial,
                            }).unwrap();
                        }
                    }

                    if (lesson.type === 'video') {
                        if (lesson.materialId) {
                            await patchMaterialStep({
                                materialId: lesson.materialId,
                                body: {
                                    material_type: 'video',
                                    material_name: lesson.lessonName,
                                },
                            }).unwrap();
                        } else if (!wasExistingLesson && nativeFileForNewMaterial) {
                            await createVideoMaterialStep({
                                lessonId,
                                file: nativeFileForNewMaterial,
                                video_name: lesson.lessonName,
                            }).unwrap();
                        }
                    }
                } catch (lessonError) {
                    if (createdNewLesson && lessonId) {
                        try {
                            await deleteLessonStep(lessonId).unwrap();
                        } catch (rollbackError) {
                            console.error('Rollback lesson creation failed', rollbackError);
                        }
                    }

                    throw lessonError;
                }

                savedLessons.push({
                    ...lesson,
                    lessonId,
                    moduleId,
                    order: i + 1,
                });
            }

            const savedQuizs = (data.quizs || []) as Array<{ lessonId?: string; moduleId?: string; createdAt: number }>;
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

            message.success('Đã lưu tài liệu học tập');
            onNext({ lessons: savedLessons });
        } catch (error) {
            console.error('Save step 3 failed', error);
            message.error('Không thể lưu dữ liệu bước 3, vui lòng thử lại');
        }
    };

    return (
        <main className="w-full min-h-screen flex justify-center">
            <div className="relative w-[var(--global-width)] top-[15vh] mb-[200px] z-10">
                <CreateClassIntro step={3} title="Thêm tài liệu học tập" />

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
                        onClick={onSubmitStep3}
                        loading={
                            isCreatingLesson ||
                            isPatchingLesson ||
                            isDeletingLesson ||
                            isCreatingDocument ||
                            isCreatingVideo ||
                            isPatchingMaterial ||
                            isReorderingLessons
                        }
                        className="!w-[8.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                    >
                        Tiếp tục
                    </Button>
                </div>

                {modalLessonType && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

                        <div className="relative flex flex-col bg-white rounded-xl shadow-xl w-[60%] h-auto px-6 py-3">
                            <div className="flex flex-row justify-end">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="w-[2rem] h-[2rem] hover:scale-110 hover:drop-shadow-lg transition-transform active:opacity-70"
                                >
                                    <X width={24} height={24} />
                                </button>
                            </div>

                            <div className="w-full h-auto flex flex-col items-center">
                                <h2 className="text-2xl font-bold mb-2">Tạo bài giảng</h2>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    requiredMark={false}
                                    onFinish={onFinishLesson}
                                    className="w-full"
                                >
                                    <Form.Item
                                        name="lessonName"
                                        label={<span className="text-base">Tên bài giảng</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập tên bài giảng!' }]}
                                    >
                                        <Input size="large" placeholder="Tên bài giảng" />
                                    </Form.Item>

                                    <Form.Item
                                        name="file"
                                        label={<span className="text-base">{modalLessonType === 'document' ? 'Tài liệu' : 'Video'}</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập file bài giảng!' }]}
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => e?.fileList}
                                    >
                                        <Upload
                                            className="w-full"
                                            style={{ display: 'block' }}
                                            showUploadList={false}
                                            beforeUpload={() => false}
                                            onChange={changeFileLessonSelect}
                                            accept={modalLessonType === 'document' ? '.pdf,.doc,.docs,.docx,.odf,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text' : '.mp4'}
                                        >
                                            <Input
                                                className="w-full"
                                                placeholder={modalLessonType === 'document' ? 'Tài liệu' : 'Video'}
                                                readOnly
                                                size="large"
                                                value={fileLessonName}
                                                suffix={<Image src={UploadIcon} alt="upload" width={24} height={24} />}
                                            />
                                        </Upload>
                                        
                                    </Form.Item>

                                    <Link
                                        href="/teacher/create-slide"
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        Thử nghiệm tạo video bằng AI?
                                    </Link>

                                    <Form.Item className="flex justify-center">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            className="!w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                                        >
                                            Lưu thông tin
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Step3;
