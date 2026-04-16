'use client';

import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import { useGetCoursesByTeacherQuery, useLazyGetCourseModulesQuery } from '@/store/api/[module]/courseApi';
import { useCreateLessonStepMutation } from '@/store/api/[module]/createClassApi';
import { useAssignVideoGenerationToLessonMutation } from '@/store/api/[module]/aiStudioApi';

interface AssignVideoToCourseModalProps {
    open: boolean;
    jobId: string | null;
    onClose: () => void;
    onAssigned?: () => void;
}

export default function AssignVideoToCourseModal({ open, jobId, onClose, onAssigned }: AssignVideoToCourseModalProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [lessonName, setLessonName] = useState('');
    const [formError, setFormError] = useState('');

    const { data: coursesRes, isLoading: isCoursesLoading } = useGetCoursesByTeacherQuery({
        limit: 100,
        sortBy: 'created_at',
        sortOrder: 'ASC',
    });

    const [getCourseModules, { data: modulesRes, isFetching: isModulesLoading }] = useLazyGetCourseModulesQuery();
    const [createLessonStep, { isLoading: isCreatingLesson }] = useCreateLessonStepMutation();
    const [assignVideoGenerationToLesson, { isLoading: isAssigningVideo }] = useAssignVideoGenerationToLessonMutation();

    const activeCourses = useMemo(
        () => (coursesRes?.data ?? []).filter((course) => course.is_active),
        [coursesRes?.data],
    );

    const modules = modulesRes?.modules ?? [];

    const resetForm = () => {
        setSelectedCourseId(null);
        setSelectedModuleId(null);
        setLessonName('');
        setFormError('');
    };

    const handleClose = () => {
        if (isCreatingLesson || isAssigningVideo) {
            return;
        }

        resetForm();
        onClose();
    };

    const handleSelectCourse = async (courseId: string) => {
        setSelectedCourseId(courseId);
        setSelectedModuleId(null);
        setLessonName('');
        setFormError('');

        try {
            await getCourseModules(courseId).unwrap();
        } catch (err) {
            console.error('Load modules failed:', err);
            setFormError('Không thể tải danh sách module. Vui lòng thử lại.');
        }
    };

    const handleSubmit = async () => {
        if (!jobId) {
            setFormError('Không tìm thấy video cần sắp xếp.');
            return;
        }

        if (!selectedModuleId) {
            setFormError('Vui lòng chọn module.');
            return;
        }

        const trimmedLessonName = lessonName.trim();
        if (!trimmedLessonName) {
            setFormError('Vui lòng nhập tên lesson.');
            return;
        }

        setFormError('');

        try {
            const lessonRes = await createLessonStep({
                moduleId: selectedModuleId,
                body: {
                    lesson_name: trimmedLessonName,
                    contentType: 'video',
                },
            }).unwrap();

            await assignVideoGenerationToLesson({
                jobId,
                lessonId: lessonRes.id,
            }).unwrap();

            onAssigned?.();

            handleClose();
        } catch (err) {
            console.error('Assign generated video failed:', err);
            setFormError('Không thể sắp xếp video vào môn học. Vui lòng thử lại.');
        }
    };

    if (!open || !jobId) {
        return null;
    }

    const isSubmitting = isCreatingLesson || isAssigningVideo;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-3xl rounded-2xl border border-blue-500/20 bg-white shadow-2xl p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-[var(--color-secondary)]">Sắp xếp video vào môn học</h2>
                <p className="text-sm text-slate-500 mt-1">Chọn Course, Module và nhập tên Lesson cho video này.</p>

                <div className="mt-4 space-y-5">
                    <div>
                        <p className="text-sm font-medium text-[var(--color-secondary)] mb-2">Bước 1: Chọn Course</p>
                        {isCoursesLoading ? (
                            <p className="text-sm text-slate-500">Đang tải course...</p>
                        ) : activeCourses.length === 0 ? (
                            <p className="text-sm text-slate-500">Bạn chưa có course đang hoạt động.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {activeCourses.map((course) => (
                                    <button
                                        key={course.id}
                                        type="button"
                                        onClick={() => handleSelectCourse(course.id)}
                                        className={`rounded-lg border px-3 py-2 text-left transition ${
                                            selectedCourseId === course.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-blue-100 hover:border-blue-300'
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-[var(--color-primary)]">{course.course_name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{course.course_code}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedCourseId && (
                        <div>
                            <p className="text-sm font-medium text-[var(--color-secondary)] mb-2">Bước 2: Chọn Module</p>
                            {isModulesLoading ? (
                                <p className="text-sm text-slate-500">Đang tải module...</p>
                            ) : modules.length === 0 ? (
                                <p className="text-sm text-slate-500">Course này chưa có module.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {modules.map((module) => (
                                        <button
                                            key={module.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedModuleId(module.id);
                                                setFormError('');
                                            }}
                                            className={`rounded-lg border px-3 py-2 text-left transition ${
                                                selectedModuleId === module.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-blue-100 hover:border-blue-300'
                                            }`}
                                        >
                                            <p className="text-sm font-semibold text-[var(--color-primary)]">{module.module_name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Thứ tự: {module.order_index}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedModuleId && (
                        <div>
                            <p className="text-sm font-medium text-[var(--color-secondary)] mb-2">Bước 3: Nhập tên Lesson</p>
                            <input
                                type="text"
                                value={lessonName}
                                onChange={(e) => {
                                    setLessonName(e.target.value);
                                    if (formError) {
                                        setFormError('');
                                    }
                                }}
                                placeholder="VD: Bài giảng AI - Chương 1"
                                className="w-full border border-blue-500/20 rounded-lg text-sm px-3 py-2.5 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                            />
                        </div>
                    )}

                    {formError && (
                        <p className="text-xs text-red-500">{formError}</p>
                    )}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="!rounded-lg"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        disabled={!selectedModuleId}
                        className="!rounded-lg !bg-[var(--color-secondary)]"
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    );
}
