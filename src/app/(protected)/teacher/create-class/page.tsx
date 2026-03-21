'use client'; 

import { useEffect, useState } from 'react';
import { message, App } from 'antd';
import { useSearchParams } from 'next/navigation';
import Step1 from '@/app/(protected)/teacher/create-class/steps/step1';
import Step2 from '@/app/(protected)/teacher/create-class/steps/step2';
import Step3 from '@/app/(protected)/teacher/create-class/steps/step3';
import Step4 from '@/app/(protected)/teacher/create-class/steps/step4';
import Step5 from '@/app/(protected)/teacher/create-class/steps/step5';
import { useLazyGetCourseByIdQuery, useLazyGetCourseModulesQuery } from '@/store/api/[module]/courseApi';
import { useLazyGetModuleLessonsQuery } from '@/store/api/[module]/moduleApi';
import { useLazyGetDocumentQuery } from '@/store/api/[module]/documentApi';
import { useLazyGetVideoUrlQuery } from '@/store/api/[module]/videoApi';
import { useLazyGetProjectDocumentQuery } from '@/store/api/[module]/projectApi';
import { useLazyGetQuizQuestionsByQuizIdQuery, useLazyGetQuizzesByCourseIdQuery } from '@/store/api/[module]/quizApi';

const CREATE_CLASS_DRAFT_KEY = 'teacher-create-class-draft-v1';

type CreateClassDraft = {
    currentStep: number;
    classData: Record<string, unknown>;
};

export default function CreateClassPage() {
    const searchParams = useSearchParams();
    const resumeCourseId = searchParams.get('courseId');
	const isFreshCreate = searchParams.get('fresh') === '1';

	const [currentStep, setCurrentStep] = useState(1);
	const [classData, setClassData] = useState<Record<string, unknown>>({});
	const [isHydrated, setIsHydrated] = useState(false);

    const [getCourseById] = useLazyGetCourseByIdQuery();
    const [getCourseModules] = useLazyGetCourseModulesQuery();
    const [getModuleLessons] = useLazyGetModuleLessonsQuery();
    const [getDocument] = useLazyGetDocumentQuery();
    const [getVideoUrl] = useLazyGetVideoUrlQuery();
    const [getProjectDocument] = useLazyGetProjectDocumentQuery();
	const [getQuizzesByCourseId] = useLazyGetQuizzesByCourseIdQuery();
	const [getQuizQuestionsByQuizId] = useLazyGetQuizQuestionsByQuizIdQuery();

	useEffect(() => {
		if (resumeCourseId) {
			return;
		}

		if (isFreshCreate) {
			localStorage.removeItem(CREATE_CLASS_DRAFT_KEY);
			setCurrentStep(1);
			setClassData({});
			setIsHydrated(true);
			return;
		}

		try {
			const rawDraft = localStorage.getItem(CREATE_CLASS_DRAFT_KEY);
			if (!rawDraft) {
				setIsHydrated(true);
				return;
			}

			const draft = JSON.parse(rawDraft) as Partial<CreateClassDraft>;
			if (draft.currentStep && draft.currentStep >= 1 && draft.currentStep <= 5) {
				setCurrentStep(draft.currentStep);
			}

			if (draft.classData && typeof draft.classData === 'object') {
				setClassData(draft.classData as Record<string, unknown>);
			}
		} catch (error) {
			console.error('Failed to restore create-class draft', error);
		} finally {
			setIsHydrated(true);
		}
	}, [isFreshCreate, resumeCourseId]);

	useEffect(() => {
		if (!resumeCourseId) {
			return;
		}

		let isCancelled = false;

		const restoreFromServer = async () => {
			try {
				const courseResp = await getCourseById(resumeCourseId).unwrap();
				const modulesResp = await getCourseModules(resumeCourseId).unwrap();
				const courseQuizzesResp = await getQuizzesByCourseId(resumeCourseId).unwrap();

				const course = courseResp.data;
				const modules = [...(modulesResp.modules || [])].sort((a, b) => a.order_index - b.order_index);

				const categories = Array.isArray(course.category)
					? course.category
					: `${course.category || ''}`
						.split(',')
						.map((item) => item.trim())
						.filter(Boolean);

				const moduleIndexMap = new Map<string, number>();
				modules.forEach((module, index) => {
					moduleIndexMap.set(module.id, index + 1);
				});

				const quizByLessonId = new Map(
					(courseQuizzesResp || []).map((quizItem) => [quizItem.lesson_id, quizItem]),
				);

				let createdAtSeed = Date.now();
				const hydratedLessons: any[] = [];
				const hydratedProjects: any[] = [];
				const hydratedQuizs: any[] = [];

				for (const module of modules) {
					const lessonResp = await getModuleLessons(module.id).unwrap();
					const moduleLessons = [...(lessonResp.lesson || [])].sort((a, b) => a.order_index - b.order_index);
					const chapter = moduleIndexMap.get(module.id) || 1;

					for (const lesson of moduleLessons) {
						const lessonType = (lesson.type || 'document') as string;

						if (lessonType === 'project') {
							let materialId: string | undefined;
							let fileName: string | undefined;
							let expiredDate = 7;

							try {
								const projectResp = await getProjectDocument(lesson.id).unwrap();
								const projectAny = projectResp as any;
								materialId = projectAny?.id || projectAny?.project?.id;
								expiredDate = Number(projectAny?.expired_date || projectAny?.project?.expired_date || 7);
								const rawUrl = projectAny?.file_url || projectAny?.project?.file_url;
								if (typeof rawUrl === 'string' && rawUrl.length > 0) {
									const segments = rawUrl.split('/');
									fileName = decodeURIComponent(segments[segments.length - 1] || 'project-file');
								}
							} catch {
								// Continue restoring other fields even if project metadata API fails.
							}

							hydratedProjects.push({
								projectName: lesson.lesson_name,
								expiredDate,
								file: fileName ? { name: fileName } : null,
								permit: false,
								audio: null,
								chapter,
								lessonId: lesson.id,
								materialId,
								moduleId: module.id,
								order: lesson.order_index,
								contentType: 'project',
								createdAt: createdAtSeed,
							});
							createdAtSeed += 1;
							continue;
						}

						if (lessonType === 'quiz') {
							const quizMeta = quizByLessonId.get(lesson.id);
							let questions: any[] = [];

							if (quizMeta?.id) {
								try {
									const questionResp = await getQuizQuestionsByQuizId(quizMeta.id).unwrap();
									questions = [...(questionResp || [])]
										.sort((a, b) => a.order_index - b.order_index)
										.map((question, questionIndex) => {
											const sortedOptions = [...(question.options || [])].sort((a, b) => a.order_index - b.order_index);
											const correctOptionIndex = Math.max(
												sortedOptions.findIndex((option) => option.is_correct),
												0,
											);

											return {
												id: question.id,
												index: questionIndex + 1,
												question: question.question_text,
												score: question.points,
												required: true,
												correctOption: correctOptionIndex,
												options: sortedOptions.map((option) => ({
													id: option.id,
													value: option.option_text,
												})),
											};
										});
								} catch {
									// Continue with empty question list if question API fails.
								}
							}

							hydratedQuizs.push({
								quizName: lesson.lesson_name,
								expiredDate: Number(quizMeta?.expired_date) || 7,
								duration: Number(quizMeta?.duration) || Number(lesson.estimated_completion_time) || 0,
								questions,
								chapter,
								lessonId: lesson.id,
								moduleId: module.id,
								order: lesson.order_index,
								contentType: 'quiz',
								createdAt: createdAtSeed,
							});
							createdAtSeed += 1;
							continue;
						}

						let materialId: string | undefined;
						let fileName: string | undefined;

						if (lessonType === 'video') {
							try {
								const videoResp = await getVideoUrl(lesson.id).unwrap();
								const videoAny = videoResp as any;
								materialId = videoAny?.id;
								fileName = videoAny?.video_name;
							} catch {
								// Continue restoring even if video metadata API fails.
							}
						} else {
							try {
								const docResp = await getDocument(lesson.id).unwrap();
								const docAny = docResp as any;
								materialId = docAny?.id || docAny?.document?.id;
								fileName = docAny?.file_name;
							} catch {
								// Continue restoring even if document metadata API fails.
							}
						}

						hydratedLessons.push({
							chapter,
							type: lessonType === 'video' ? 'video' : 'document',
							lessonName: lesson.lesson_name,
							file: fileName ? { name: fileName } : null,
							lessonId: lesson.id,
							materialId,
							moduleId: module.id,
							estimatedCompletionTime: lesson.estimated_completion_time,
							order: lesson.order_index,
							contentType: 'lesson',
							createdAt: createdAtSeed,
						});
						createdAtSeed += 1;
					}
				}

				const restoredData: Record<string, unknown> = {
					courseId: course.id,
					courseCode: course.course_code,
					courseName: course.course_name,
					description: course.course_description,
					duration: course.duration,
					categories,
					pricingType: Number(course.tuition_fee) > 0 ? 2 : 1,
					price: Number(course.tuition_fee) || 0,
					chapters: modules.map((module) => ({
						chapterName: module.module_name,
						description: module.module_description,
						moduleId: module.id,
					})),
					lessons: hydratedLessons,
					quizs: hydratedQuizs,
					projects: hydratedProjects,
				};

				if (!isCancelled) {
					setClassData(restoredData);

					if ((restoredData.chapters as any[]).length === 0) {
						setCurrentStep(2);
					} else if (hydratedLessons.length === 0) {
						setCurrentStep(3);
					} else if (hydratedQuizs.length === 0) {
						setCurrentStep(4);
					} else if (hydratedProjects.length === 0) {
						setCurrentStep(5);
					} else {
						setCurrentStep(5);
					}
				}
			} catch (error) {
				console.error('Failed to restore course draft from server', error);
				if (!isCancelled) {
					message.error('Không thể tải dữ liệu môn học đang tạo. Vui lòng thử lại.');
				}
			} finally {
				if (!isCancelled) {
					setIsHydrated(true);
				}
			}
		};

		void restoreFromServer();

		return () => {
			isCancelled = true;
		};
	}, [getCourseById, getCourseModules, getDocument, getModuleLessons, getProjectDocument, getQuizQuestionsByQuizId, getQuizzesByCourseId, getVideoUrl, resumeCourseId]);

	useEffect(() => {
		if (!isHydrated) {
			return;
		}

		const draft: CreateClassDraft = {
			currentStep,
			classData,
		};

		localStorage.setItem(CREATE_CLASS_DRAFT_KEY, JSON.stringify(draft));
	}, [currentStep, classData, isHydrated]);

	const next = (data: any) => {
		setClassData((prev) => ({ ...prev, ...data }));
		setCurrentStep((prev) => Math.min(prev + 1, 5));
	};

	const back = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

	if (!isHydrated) {
		return null;
	}

	return (
		<App>
			<main>
				<h1>Tạo lớp học mới</h1>

				{currentStep === 1 && <Step1 onNext={next} data={classData} />}
				{currentStep === 2 && <Step2 onNext={next} onBack={back} data={classData}/>}
				{currentStep === 3 && <Step3 onNext={next} onBack={back} data={classData}/>}
				{currentStep === 4 && <Step4 onNext={next} onBack={back} data={classData}/>}
				{currentStep === 5 && <Step5 onNext={next} onBack={back} data={classData}/>}
			</main>
		</App>
	);
}