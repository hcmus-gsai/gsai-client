'use client';
import '@ant-design/v5-patch-for-react-19';

import { useParams, useRouter } from "next/navigation";
import { Button, Card, Progress } from "antd";
import { useState, useEffect } from 'react';

import { useGetCourseByIdQuery, useGetCourseModulesQuery } from "@/store/api/[module]/courseApi";
import { useLazyGetModuleLessonsQuery } from "@/store/api/[module]/moduleApi";
import { useGetLearningProgressByCourseQuery } from "@/store/api/[module]/lessonProgressApi";
import { useLazyGetCourseModulesQuery } from "@/store/api/[module]/courseApi";
import { useGetQuizzesByCourseIdQuery } from '@/store/api/[module]/quizApi';
import { useGetAllEnrollmentsQuery } from '@/store/api/[module]/enrollmentApi';
import { QuizCard } from '@/app/(protected)/student/courses/[id]/components/quizCard';

import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
	setLessonProgressData,
	setModuleStats,
	setTotalLessons,
	selectCompletionPercent,
} from "@/store/slice/lessonProgressSlice";

import LectureSection from '@/app/(protected)/student/courses/[id]/components/lectureSection';
import GradeSection from '@/app/(protected)/student/courses/[id]/components/gradeSection';
import { setQuizzesByCourseId } from '@/store/slice/quizSlice';

interface IChapterState {
	id: string;
	isExtended: boolean;
};

const CourseModules = () => {

	const [activeTab, setActiveTab] = useState<'lecture' | 'quiz' | 'grade'>('lecture');

	const dispatch = useAppDispatch();
	const { id } = useParams();

	const { data: courseRes } = useGetCourseByIdQuery(id as string, {
		skip: !id,
	});
	const course = courseRes?.data;
	const { data: moduleRes } = useGetCourseModulesQuery(id as string, {
		skip: !id,
	});
	const modules = moduleRes?.modules ?? [];
	const [chapterState, setChapterState] = useState<IChapterState[]>([]);

	useEffect(() => {
		if (modules.length > 0) {
			setChapterState(
				modules.map((m: any) => ({
					id: String(m.id),
					isExtended: false,
				}))
			);
		}
	}, [modules]);

	const { data: progressData } = useGetLearningProgressByCourseQuery(id as string, {
		skip: !id,
	});

	const [fetchCourseModules] = useLazyGetCourseModulesQuery();
	const [fetchModuleLessons] = useLazyGetModuleLessonsQuery();

	const completionPercent = useAppSelector(selectCompletionPercent);

	useEffect(() => {
		if (!progressData) return;

		const loadCourseProgress = async () => {
			try {
				dispatch(setLessonProgressData({
					courseId: id as string,
					lessonProgress: progressData.lessonProgress,
				}));

				const moduleResponse = await fetchCourseModules(id as string).unwrap();
				let totalLesson = 0;

				for (const module of moduleResponse.modules) {
					const lessonsResponse = await fetchModuleLessons(module.id).unwrap();
					totalLesson += lessonsResponse.lesson.length;

					let currentStats = {
						video: { total: 0, completed: 0 },
						document: { total: 0, completed: 0 },
						quiz: { total: 0, completed: 0 },
						project: { total: 0, completed: 0 },
						moduleCompletionPercent: 0
					};

					for (const lesson of lessonsResponse.lesson) {
						const isCompleted = progressData.lessonProgress.some(
							(progress: any) => progress.lesson_id === lesson.id && progress.is_completed
						);

						if (lesson.type === "video") {
							currentStats.video.total++;
							if (isCompleted) currentStats.video.completed++;
						} else if (lesson.type === "document") {
							currentStats.document.total++;
							if (isCompleted) currentStats.document.completed++;
						} else if (lesson.type === "quiz") {
							currentStats.quiz.total++;
							if (isCompleted) currentStats.quiz.completed++;
						} else if (lesson.type === 'project') {
							currentStats.project.total++;
							if (isCompleted) currentStats.project.completed++;
						}

						const totalLessonInModule = currentStats.video.total + currentStats.document.total + currentStats.quiz.total + currentStats.project.total;
						const completedLessonInModule = currentStats.video.completed + currentStats.document.completed + currentStats.quiz.completed + currentStats.project.completed;

						const moduleCompletionPercent = totalLessonInModule > 0 ? Math.round((completedLessonInModule / totalLessonInModule) * 100) : 0;
						currentStats.moduleCompletionPercent = moduleCompletionPercent;
					}

					dispatch(setModuleStats({
						moduleId: module.id,
						stats: currentStats,
					}));
				}

				dispatch(setTotalLessons(totalLesson));
			} catch (error) {
				console.error('Error loading course progress', error);
			}
		}
		loadCourseProgress();
	}, [id, progressData, dispatch, fetchCourseModules, fetchModuleLessons]);

	const baseBtn = "!w-[7rem] !h-[2.25rem] !rounded-full !border-white hover:!border-[var(--color-secondary)]";
	const activeBtn = "!text-[var(--color-secondary)] !bg-[var(--color-neutral)]";
	const inactiveBtn = "!text-black !bg-white hover:!text-[var(--color-secondary)] hover:!bg-white";

	return (
		<section className="w-full md:flex-1 flex flex-col items-center justify-start">
			<div className="w-full mb-[1.5rem]">
				<p className="text-3xl md:text-6xl font-semibold mb-4 text-[var(--color-primary)]">
					{course?.course_name}
				</p>

				<div className="flex flex-wrap gap-3 mb-6">
					<Button
						onClick={() => setActiveTab('lecture')}
						className={`${baseBtn} ${activeTab === 'lecture' ? activeBtn : inactiveBtn}`}
					>
						Bài giảng
					</Button>
					<Button
						onClick={() => setActiveTab('grade')}
						className={`${baseBtn} ${activeTab === 'grade' ? activeBtn : inactiveBtn}`}
					>
						Điểm
					</Button>
				</div>

				<div className="w-full flex flex-col gap-2">
					<p className="text-[0.875rem] md:text-[1rem] font-light text-[var(--color-primary)]">
						Hoàn thành {completionPercent}% · Dự kiến hoàn thành: {course?.duration}
					</p>
					<Progress
						percent={completionPercent}
						showInfo={false}
						strokeColor={completionPercent === 100 ? "#22c55e" : "#1363DF"}
						trailColor="#E5E7EB"
						className="w-full"
					/>
				</div>
			</div>
			{activeTab === 'lecture' && <LectureSection />}
			{activeTab === 'grade' && <GradeSection />}
		</section>
	);
}

const CourseSchedule = () => {
	const dispatch = useAppDispatch();

	const { id: courseId } = useParams();
	const { data: quizzes } = useGetQuizzesByCourseIdQuery(courseId as string);

	useEffect(() => {
		if (quizzes && courseId) {
			dispatch(setQuizzesByCourseId({
				courseId: courseId as string,
				quizzes: quizzes
			}));
		}
	}, [quizzes, courseId, dispatch]);

	const { enrollment } = useGetAllEnrollmentsQuery(undefined, {
		selectFromResult: ({ data, isLoading }) => ({
			enrollment: data?.data?.find(
				(e) => e.course_id === courseId
			),
			isLoading,
		}),
	});

	return (
		<section className="w-full md:w-[25%] flex flex-col items-start justify-start">
			<div className="w-full h-full flex flex-col items-start justify-start gap-[1.5rem] md:gap-[2rem]">
				<Card
					className="w-full h-auto !rounded-[20px] !border !border-gray-300 shadow-sm"
					styles={{
						body: {
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							padding: '24px'
						}
					}}
				>
					<p className="text-[1rem] font-bold text-[var(--color-primary)] mb-[1rem]">
						Sự kiện sắp tới
					</p>
					<div className="flex-1 overflow-y-auto flex flex-col gap-[0.5rem] pr-2 custom-scrollbar group relative">
						<div className="w-full text-center mt-4 text-sm text-gray-400 block group-has-[.visible-card]:hidden">
							Chưa có sự kiện nào
						</div>
						{!quizzes || !enrollment ? null : (
							quizzes.map(q => (
								<QuizCard
									key={q.id}
									quiz={q}
									enrollment={enrollment}
								/>
							))
						)}
					</div>
				</Card>
			</div>
		</section>
	);
}

export default function CourseDetailPage() {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);
	if (!isClient) {
		return <div>Loading...</div>;
	}
	return (
		<main className="w-full grow flex min-h-screen flex-col overflow-x-hidden bg-white">
			<div className="
				w-full px-4 md:px-0 md:w-[var(--global-width)] 
				mx-auto h-full 
				flex flex-col-reverse md:flex-row 
				items-start justify-center 
				mt-[6rem] md:mt-[10rem] 
				gap-[2rem]
			">
				<CourseModules />
				<CourseSchedule />
			</div>
		</main>
	)
}
