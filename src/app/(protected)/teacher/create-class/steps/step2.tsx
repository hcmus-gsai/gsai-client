'use client'

import { Form, Button, App } from 'antd'
import { useSearchParams } from 'next/navigation';

import CreateClassIntro from '../components/create-class-intro'
import CreateClassChapter from '../components/create-class-chapter'
import { Step2Data } from '@/type/createClass.type'
import {
    useCreateModuleStepMutation,
    useCreateModulesBatchStepMutation,
    useDeleteModuleStepMutation,
    usePatchModuleStepMutation,
    useReorderModulesStepMutation,
} from '@/store/api/[module]/createClassApi'

interface Props {
  data: any; 
  onNext: (data: Partial<Step2Data>) => void;
  onBack: () => void
}

type ChapterDraft = {
        chapterName: string;
        description: string;
        moduleId?: string;
};

const Step2: React.FC<Props> = ({ data, onNext, onBack}) =>{
    const { message } = App.useApp();

    const searchParams = useSearchParams();
    const [form] = Form.useForm();
    const [createModulesBatchStep, { isLoading: isBatchCreating }] = useCreateModulesBatchStepMutation();
    const [createModuleStep, { isLoading: isCreatingOne }] = useCreateModuleStepMutation();
    const [patchModuleStep, { isLoading: isPatching }] = usePatchModuleStepMutation();
    const [deleteModuleStep, { isLoading: isDeleting }] = useDeleteModuleStepMutation();
    const [reorderModulesStep, { isLoading: isReordering }] = useReorderModulesStepMutation();

    const handleFinish = async (values: any) => {
        console.log('Dữ liệu thu thập được:', values);

        const resumeCourseId = searchParams.get('courseId') || undefined;
        const courseId = (data.courseId as string | undefined) || resumeCourseId;
        if (!courseId) {
            message.error('Thiếu courseId. Vui lòng hoàn tất bước 1 trước.');
            return;
        }

        const inputChapters: ChapterDraft[] = values.chapters || [];
        const previousChapters: ChapterDraft[] = data.chapters || [];
        const normalizedInputChapters: ChapterDraft[] = inputChapters.map((chapter, index, chapters) => {
            if (!chapter.moduleId) {
                return chapter;
            }

            const firstSeenIndex = chapters.findIndex((item) => item.moduleId === chapter.moduleId);
            if (firstSeenIndex === index) {
                return chapter;
            }

            // Duplicate moduleId means this chapter is a copied draft and must be created as a new module.
            return {
                ...chapter,
                moduleId: undefined,
            };
        });

        try {
            let savedChapters: ChapterDraft[] = [];

            const hasPersistedModules = previousChapters.some((chapter) => !!chapter.moduleId);

            if (!hasPersistedModules) {

                try {
                    const batch = await createModulesBatchStep({
                        courseId,
                        modules: normalizedInputChapters.map((chapter, index) => ({
                            module_name: chapter.chapterName,
                            module_description: chapter.description,
                            order_index: index + 1,
                        })),
                    }).unwrap();

                    savedChapters = normalizedInputChapters.map((chapter, index) => ({
                        ...chapter,
                        moduleId: batch.modules[index]?.id,
                    }));
                }
                catch {
                    message.error('Không thể để trống chương môn học');
                    return;
                }
            } else {
                const previousById = new Map(
                    previousChapters
                        .filter((chapter) => Boolean(chapter.moduleId))
                        .map((chapter) => [chapter.moduleId as string, chapter]),
                );

                const nextIds = new Set(
                    normalizedInputChapters
                        .map((chapter) => chapter.moduleId)
                        .filter((id): id is string => Boolean(id)),
                );

                // 1) Delete removed modules (exist in previous but not in next)
                for (const prevId of previousById.keys()) {
                    if (!nextIds.has(prevId)) {
                        await deleteModuleStep(prevId).unwrap();
                    }
                }

                // 2) Upsert remaining modules following UI order
                savedChapters = [];
                for (let i = 0; i < normalizedInputChapters.length; i += 1) {
                    const chapter = normalizedInputChapters[i];

                    if (chapter.moduleId && previousById.has(chapter.moduleId)) {
                        await patchModuleStep({
                            moduleId: chapter.moduleId,
                            body: {
                                module_name: chapter.chapterName,
                                module_description: chapter.description,
                            },
                        }).unwrap();

                        savedChapters.push({
                            ...chapter,
                            moduleId: chapter.moduleId,
                        });
                        continue;
                    }

                    const created = await createModuleStep({
                        courseId,
                        body: {
                            module_name: chapter.chapterName,
                            module_description: chapter.description,
                            order_index: i + 1,
                        },
                    }).unwrap();

                    savedChapters.push({
                        ...chapter,
                        moduleId: created.id,
                    });
                }
            }

            const moduleIdsForReorder = savedChapters
                .map((chapter) => chapter.moduleId)
                .filter((moduleId): moduleId is string => Boolean(moduleId));

            if (moduleIdsForReorder.length > 0) {
                await reorderModulesStep({
                    courseId,
                    body: {
                        module_ids: moduleIdsForReorder,
                    },
                }).unwrap();
            }

            message.success('Lưu thông tin chương thành công');
            onNext({
                courseId,
                chapters: savedChapters,
            });
        } catch (error) {
            console.error('Save modules error', error);
            message.error('Không thể lưu chương học, vui lòng thử lại');
        }
    };

    return (
        <main className="w-full min-h-screen flex justify-center">
            <div className="relative w-[var(--global-width)] top-[15vh] mb-[200px] z-10">
                <CreateClassIntro step={2} title="Thông tin chương"/>

                <Form 
                    form={form} 
                    onFinish={handleFinish} 
                    initialValues={{ chapters: data.chapters?.length ? data.chapters : [{}] }}
                    requiredMark={false}
                    labelCol={{
                        xs: { span: 4 }, 
                        sm: { span: 4 }, 
                        md: { span: 4 },
                        lg: { span: 3 },
                        style: { display: 'flex', alignItems: 'center' } 
                    }}
                    labelAlign = "left"
                >
                    <Form.List name="chapters">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <CreateClassChapter 
                                        key={key}
                                        index={index}
                                        restField={restField}
                                        name={name}
                                        remove={remove}
                                        add={add}
                                        form={form}
                                    />
                                ))}
                                
                                <button 
                                    type='button'
                                    onClick={() => add()}
                                    className="cursor-pointer relative w-[3rem] h-[3rem] group focus:outline-none transition-transform active:scale-95 mb-10"
                                >
                                    <svg height="3rem" width="3rem" className="transition-colors group-hover:drop-shadow-lg">
                                        <circle
                                            r="1.3rem" 
                                            cx="1.5rem" 
                                            cy="1.5rem" 
                                            fill="white" 
                                            stroke="#1363DF" 
                                            strokeWidth="1.5"
                                            className="group-hover:stroke-blue-700"
                                        />
                                    </svg>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg width="24" height="24" fill="currentColor" className="text-[#1363DF] group-hover:text-blue-700">
                                            <path d="M12 4a.5.5 0 0 1 .5.5v7h7a.5.5 0 0 1 0 1h-7v7a.5.5 0 0 1-1 0v-7h-7a.5.5 0 0 1 0-1h7v-7A.5.5 0 0 1 12 4z"/>
                                        </svg>
                                    </div>
                                </button>
                            </>
                        )}
                    </Form.List>

                    <div className='w-full  flex justify-center gap-8'>
                        <Button 
                            type="primary" 
                            size="large"
                            onClick={onBack}
                            className="!w-[8.5rem] !h-[3.375rem] !text-[var(--color-secondary)] !bg-[var(--color-bg-white)] !border-[var(--color-secondary)]  !rounded-full hover:!text-[var(--color-bg-white)] hover:!bg-[var(--color-secondary)] hover:!border-[var(--color-bg-white)]"
                        >
                            Quay lại
                        </Button>
    
                        <Button 
                            type="primary" 
                            size="large"
                            htmlType="submit"
                            loading={isBatchCreating || isCreatingOne || isPatching || isDeleting || isReordering}
                            className="!w-[8.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                        >
                            Tiếp tục
                        </Button>
                    </div>
                </Form>
                
            </div>
        </main>
    )
}

export default Step2;