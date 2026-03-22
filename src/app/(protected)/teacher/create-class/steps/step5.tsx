'use client'

import React, { useMemo, useState } from 'react';
import { Collapse, ConfigProvider, Form, Button, Input, Space, InputNumber, Upload, UploadProps, Radio, App } from 'antd';
import Image from 'next/image';
import { ChevronDown, ChevronUp, X } from '@deemlol/next-icons';
import { useRouter, useSearchParams } from 'next/navigation';

import ProjectIcon from '@/../public/shared/ProjectIcon.svg';
import UploadIcon from '@/../public/shared/UploadIcon.svg';
import CreateClassEdit from '@/../public/teacher/createClassEdit.svg';
import CreateClassTrashRed from '@/../public/teacher/createClassTrashRed.svg';

import { Project, Step3Data } from '@/type/createClass.type';
import CreateClassIntro from '../components/create-class-intro';
import {
    useCreateLessonStepMutation,
    useCreateProjectMaterialStepMutation,
    useDeleteLessonStepMutation,
    usePatchCourseStepMutation,
    usePatchLessonStepMutation,
    usePatchMaterialStepMutation,
    useReorderLessonsStepMutation,
} from '@/store/api/[module]/createClassApi';

interface Props {
    data: any;
    onNext: (data: Partial<Step3Data>) => void;
    onBack: () => void;
}

interface InputProps {
    value?: number | null;
    onChange?: (value: number | null) => void;
    id?: string;
    content: string
}

const CustomInput: React.FC<InputProps> = ({ value, onChange, id, content }) => (
    <Space.Compact style={{ width: '100%' }}>
        <InputNumber 
            id={id}
            value={value} 
            onChange={onChange} 
            min={1} 
            step={1} 
            size="large" 
            style={{ width: '100%' }}
        />
        <Button 
            disabled 
            size="large"
            style={{ 
                color: 'rgba(0, 0, 0, 0.88)',
                backgroundColor: '#fafafa'  
            }}
            className="!cursor-not-allowed !pointer-events-none hover:!bg-inherit hover:!text-inherit hover:!border-inherit [&_.anticon]:!text-inherit"
        >
            {content}
        </Button>
    </Space.Compact>
);

const Step5: React.FC<Props> = ({ data, onNext, onBack }) => {
    const { message } = App.useApp();

    const router = useRouter();
    const searchParams = useSearchParams();
    const [form] = Form.useForm();

    const [createLessonStep, { isLoading: isCreatingLesson }] = useCreateLessonStepMutation();
    const [patchLessonStep, { isLoading: isPatchingLesson }] = usePatchLessonStepMutation();
    const [deleteLessonStep, { isLoading: isDeletingLesson }] = useDeleteLessonStepMutation();

    const [createProjectMaterialStep, { isLoading: isCreatingProject }] = useCreateProjectMaterialStepMutation();
    const [patchMaterialStep, { isLoading: isPatchingMaterial }] = usePatchMaterialStepMutation();
    const [reorderLessonsStep, { isLoading: isReorderingLessons }] = useReorderLessonsStepMutation();
    const [patchCourseStep, { isLoading: isActivatingCourse }] = usePatchCourseStepMutation();

    const [projects, setProjects] = useState<Project[]>(data.projects || []);
    const [chapter, setChapter] = useState<number>(0);
    const [modalProject, setModalProject] = useState(false);
    const [modalSubmit, setModalSubmit] = useState(false);
    const [editingItem, setEditingItem] = useState<Project | null>(null);
    const [radioVal, setRadioVal] = useState(1);

    const [fileProjectName, setFileProjectName] = useState<string>('');
    const [audioProjectName, setAudioProjectName] = useState<string>('');

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

    const chapters = useMemo(() => {
        if (Array.isArray(data.chapters) && data.chapters.length > 0) {
            return data.chapters;
        }

        return [
            { chapterName: 'Chương 1', description: '' },
            { chapterName: 'Chương 2', description: '' },
        ];
    }, [data.chapters]);

    const openProjectModal = (chapterIndex: number) => {
        setChapter(chapterIndex);
        setModalProject(true);
    };

    const changeFileProjectSelect: UploadProps['onChange'] = (info) => {
        const lastFile = info.fileList.slice(-1)[0];
        setFileProjectName(lastFile?.name || '');
    };

    const changeAudioProjectSelect: UploadProps['onChange'] = (info) => {
        const lastFile = info.fileList.slice(-1)[0];
        setAudioProjectName(lastFile?.name || '');
    };

    const handleClose = () => {
        setModalProject(false);
        setEditingItem(null);
        setFileProjectName('');
        setAudioProjectName('');
        setRadioVal(1);
        form.resetFields();
    };

    const handleDeleteItem = (createdAt: number) => {
        setProjects((prev) => prev.filter((project) => project.createdAt !== createdAt));
    };

    const handleEditItem = (item: Project) => {
        setEditingItem(item);
        setChapter(item.chapter);
        setModalProject(true);

        const permitValue = item.permit ? 2 : 1;
        setRadioVal(permitValue);
        setFileProjectName((item.file as any)?.name || '');
        setAudioProjectName((item.audio as any)?.name || '');

        form.setFieldsValue({
            projectName: item.projectName,
            expiredDate: item.expiredDate,
            permit: permitValue,
            file: { fileList: item.file ? [item.file] : [] },
            audio: { fileList: item.audio ? [item.audio] : [] },
        });
    };

    const onFinishProject = (values: any) => {
        const updatedProject: Project = {
            projectName: values.projectName,
            expiredDate: Number(values.expiredDate || 1),
            file: values.file?.fileList?.[0] || values.file,
            permit: Number(values.permit) === 2,
            audio: values.audio?.fileList?.[0] || values.audio,
            chapter,
            contentType: 'project',
            order: editingItem?.order,
            lessonId: editingItem?.lessonId,
            materialId: editingItem?.materialId,
            moduleId: editingItem?.moduleId,
            createdAt: editingItem ? editingItem.createdAt : Date.now(),
        };

        if (editingItem) {
            setProjects((prev) => prev.map((project) => project.createdAt === editingItem.createdAt ? updatedProject : project));
        } else {
            setProjects((prev) => [...prev, updatedProject]);
        }

        handleClose();
    };

    const renderChapterContent = (chapterIndex: number) => {
        const chapterProjects = projects
            .filter((project) => project.chapter === chapterIndex)
            .sort((a, b) => a.createdAt - b.createdAt);

        if (chapterProjects.length === 0) {
            return (
                <div className="py-8 text-center text-gray-400 italic bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    Chưa có đồ án cho chương này
                </div>
            );
        }

        return (
            <div className="mb-4 flex flex-col gap-3 py-4">
                {chapterProjects.map((item) => (
                    <div key={item.createdAt} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <Image src={ProjectIcon} alt="icon" width={24} height={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1D3557]">{item.projectName}</h4>
                                <p className="text-sm text-gray-400">Đồ án • Hạn nộp: {item.expiredDate} ngày</p>
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
                            openProjectModal(index);
                        }}
                        className="hover:scale-110 transition-transform active:opacity-70"
                    >
                        <Image src={ProjectIcon} alt="Project" width={24} height={24} />
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

    const persistProjects = async () => {
        const chapterModuleMap = (data.chapters || []).reduce((acc: Record<number, string>, chapterItem: any, index: number) => {
            if (chapterItem.moduleId) {
                acc[index + 1] = chapterItem.moduleId;
            }
            return acc;
        }, {});

        const previousProjects = (data.projects || []) as Project[];
        const keptCreatedAt = new Set<number>(projects.map((item) => item.createdAt));

        for (const previous of previousProjects) {
            if (previous.lessonId && !keptCreatedAt.has(previous.createdAt)) {
                await deleteLessonStep(previous.lessonId).unwrap();
            }
        }

        const savedProjects: Project[] = [];
        for (let i = 0; i < projects.length; i += 1) {
            const project = projects[i];
            const moduleId = chapterModuleMap[project.chapter];
            if (!moduleId) {
                throw new Error(`Thiếu moduleId cho chương ${project.chapter}`);
            }

            let lessonId = project.lessonId;
            const wasExistingLesson = Boolean(lessonId);

            const requiresNewMaterialUpload = !project.materialId && !wasExistingLesson;
            const nativeFileForNewMaterial = requiresNewMaterialUpload ? toNativeFile(project.file) : null;

            if (requiresNewMaterialUpload && !nativeFileForNewMaterial) {
                throw new Error('File project không hợp lệ');
            }

            let createdNewLesson = false;

            try {
                if (lessonId) {
                    await patchLessonStep({
                        lessonId,
                        body: {
                            lesson_name: project.projectName,
                            contentType: 'project',
                            estimatedCompletionTime: '0',
                        },
                    }).unwrap();
                } else {
                    const createdLesson = await createLessonStep({
                        moduleId,
                        body: {
                            name: project.projectName,
                            lesson_name: project.projectName,
                            moduleId,
                            orderIndex: i + 1,
                            contentType: 'project',
                            estimatedCompletionTime: '0',
                        },
                    }).unwrap();

                    lessonId = createdLesson.id;
                    createdNewLesson = true;
                }

                if (!lessonId) {
                    throw new Error('Không thể lưu đồ án');
                }

                if (project.materialId) {
                    await patchMaterialStep({
                        materialId: project.materialId,
                        body: {
                            material_type: 'project',
                            material_name: project.projectName,
                            expired_date: Math.max(Number(project.expiredDate || 1), 1),
                        },
                    }).unwrap();
                } else if (requiresNewMaterialUpload && nativeFileForNewMaterial) {
                    await createProjectMaterialStep({
                        lessonId,
                        file: nativeFileForNewMaterial,
                        expired_date: Math.max(Number(project.expiredDate || 1), 1),
                    }).unwrap();
                }
            } catch (projectError) {
                if (createdNewLesson && lessonId) {
                    try {
                        await deleteLessonStep(lessonId).unwrap();
                    } catch (rollbackError) {
                        console.error('Rollback lesson creation failed (step 5)', rollbackError);
                    }
                }

                throw projectError;
            }

            savedProjects.push({
                ...project,
                lessonId,
                moduleId,
                order: i + 1,
            });
        }

        const savedLessons = (data.lessons || []) as Array<{ lessonId?: string; moduleId?: string; createdAt: number }>;
        const savedQuizs = (data.quizs || []) as Array<{ lessonId?: string; moduleId?: string; createdAt: number }>;

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

        return savedProjects;
    };

    const onFinalSubmit = async () => {
        const resumeCourseId = searchParams.get('courseId') || undefined;
        const courseId = (data.courseId as string | undefined) || resumeCourseId;
        if (!courseId) {
            message.error('Thiếu courseId. Vui lòng hoàn tất bước 1 trước.');
            return;
        }

        try {
            const savedProjects = await persistProjects();

            await patchCourseStep({
                courseId,
                body: {
                    is_active: true,
                },
            }).unwrap();

            onNext({ projects: savedProjects });
            setModalSubmit(false);
            message.success('Đã lưu môn học thành công');
            router.push('/teacher/courses');
        } catch (error) {
            console.error('Save step 5 failed', error);
            message.error('Không thể hoàn tất lưu môn học, vui lòng thử lại');
        }
    };

    return (
        <main className="w-full min-h-screen flex justify-center">
            <div className="relative w-[var(--global-width)] top-[15vh] mb-[200px] z-10">
                <CreateClassIntro step={5} title="Thêm đồ án" />

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
                        onClick={() => setModalSubmit(true)}
                        className="!w-[8.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                    >
                        Hoàn tất
                    </Button>
                </div>

                {modalProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center mt-[10vh]">
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
                                <h2 className="text-2xl font-bold mb-2">Tạo đồ án</h2>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    requiredMark={false}
                                    onFinish={onFinishProject}
                                    className="w-full"
                                    initialValues={{ permit: 1, expiredDate: 7 }}
                                >
                                    <Form.Item
                                        name="projectName"
                                        label={<span className="font-semibold">Tên đồ án</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập tên đồ án!' }]}
                                    >
                                        <Input size="large" placeholder="Tên đồ án" />
                                    </Form.Item>

                                    <Form.Item
                                        name="expiredDate"
                                        label={<span className="font-semibold">Hạn nộp (tính từ ngày đăng kí học)</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập số ngày hạn nộp!' }]}
                                    >
                                        <CustomInput content='ngày'/>
                                    </Form.Item>

                                    <Form.Item
                                        name="file"
                                        label={<span className="font-semibold">Tài liệu</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập file đồ án!' }]}
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => e?.fileList}
                                    >
                                        <Upload
                                            className="w-full"
                                            style={{ display: 'block' }}
                                            showUploadList={false}
                                            beforeUpload={() => false}
                                            onChange={changeFileProjectSelect}
                                            accept=".pdf"
                                        >
                                            <Input
                                                className="w-full"
                                                placeholder="Tài liệu"
                                                readOnly
                                                size="large"
                                                value={fileProjectName}
                                                suffix={<Image src={UploadIcon} alt="Doc" width={24} height={24} />}
                                            />
                                        </Upload>
                                    </Form.Item>

                                    <Form.Item
                                        name="permit"
                                        label={<span className="font-semibold">Cho phép dùng giọng nói của bạn trong tính năng Vấn đáp AI</span>}
                                    >
                                        <Radio.Group
                                            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                                            onChange={(e) => setRadioVal(e.target.value)}
                                            value={radioVal}
                                            options={[
                                                { value: 1, label: 'Không cho phép' },
                                                { value: 2, label: 'Cho phép' },
                                            ]}
                                        />
                                    </Form.Item>

                                    {radioVal === 2 && (
                                        <Form.Item
                                            name="audio"
                                            label={<span className="font-semibold">File ghi âm mẫu</span>}
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) => e?.fileList}
                                            rules={[{ required: true, message: 'Vui lòng nhập file ghi âm!' }]}
                                        >
                                            <Upload
                                                className="w-full"
                                                style={{ display: 'block' }}
                                                showUploadList={false}
                                                beforeUpload={() => false}
                                                onChange={changeAudioProjectSelect}
                                                accept='.mp4, .wav'
                                            >
                                                <Input
                                                    className="w-full"
                                                    placeholder="Ghi âm"
                                                    readOnly
                                                    size="large"
                                                    value={audioProjectName}
                                                    suffix={<Image src={UploadIcon} alt="Doc" width={24} height={24} />}
                                                />
                                            </Upload>
                                        </Form.Item>
                                    )}

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

                {modalSubmit && (
                    <SubmitModal
                        onCancel={() => setModalSubmit(false)}
                        onConfirm={onFinalSubmit}
                        loading={
                            isActivatingCourse ||
                            isCreatingLesson ||
                            isPatchingLesson ||
                            isDeletingLesson ||
                            isCreatingProject ||
                            isPatchingMaterial ||
                            isReorderingLessons
                        }
                    />
                )}
            </div>
        </main>
    );
};

type SubmitProps = {
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
};

function SubmitModal({ onCancel, onConfirm, loading = false }: SubmitProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative flex flex-col bg-white rounded-xl shadow-xl w-[40%] h-[35%] px-3 py-3">
                <div className="flex flex-row justify-end mb-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-[2rem] h-[2rem] hover:scale-110 hover:drop-shadow-lg transition-transform active:opacity-70"
                    >
                        <X width={24} height={24} />
                    </button>
                </div>

                <div className="w-full h-auto flex flex-col justify-center items-center text-center">
                    <h2 className="text-2xl font-bold mb-2">Xác nhận hoàn thành thiết lập môn học</h2>
                    <p className="text-sm text-gray-600">Bạn đã cài đặt tất cả thông tin cho môn học này.</p>
                    <p className="text-sm text-gray-600 mb-6">Hãy xác nhận để công bố môn học cho học sinh.</p>

                    <div className="flex justify-end gap-3">
                        <Button
                            className="!w-[12.5rem] !h-[3.375rem] !text-[var(--color-secondary)] !bg-[var(--color-bg-white)] !border-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-bg-white)] hover:!bg-[var(--color-secondary)]"
                            onClick={onCancel}
                        >
                            Hủy
                        </Button>

                        <Button
                            className="!w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                            onClick={onConfirm}
                            loading={loading}
                        >
                            Hoàn tất
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Step5;
