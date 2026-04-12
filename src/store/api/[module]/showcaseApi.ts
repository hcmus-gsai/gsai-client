import { baseApi } from '../baseApi';

export type ShowcaseCourseItem = {
    id: string;
    course_code: string;
    course_name: string;
    course_description: string;
    duration: string;
    teacher_name: string;
    first_lesson: {
        id: string;
        type: 'video' | 'document' | 'quiz' | 'project';
        lesson_name: string;
    } | null;
};

export type ShowcaseCoursesResponse = {
    courses: ShowcaseCourseItem[];
    total: number;
};

export type ShowcaseLessonDetailResponse = {
    lesson: {
        id: string;
        lesson_name: string;
        type: 'video' | 'document' | 'quiz' | 'project';
        estimated_completion_time: string;
    };
    course: {
        id: string;
        course_code: string;
        course_name: string;
        teacher_name: string;
    };
    modules: Array<{
        id: string;
        module_name: string;
        lessons: Array<{
            id: string;
            lesson_name: string;
            type: 'video' | 'document' | 'quiz' | 'project';
        }>;
    }>;
    content: {
        video: {
            video_url: string;
            ocr_json?: string;
        } | null;
        document: {
            document_url: string;
            document_name: string;
        } | null;
        project: {
            document_url: string;
            document_name: string;
            document_transcript?: string;
        } | null;
        quiz: {
            id: string;
            duration: number;
            passing_score_percentage: number;
            questions: Array<{
                id: string;
                question_text: string;
                question_type: string;
                points: number;
                options: Array<{
                    id: string;
                    option_text: string;
                    order_index: number;
                }>;
            }>;
        } | null;
    };
};

export const showcaseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getShowcaseCourses: builder.query<ShowcaseCoursesResponse, string[]>({
            query: (codes) => ({
                url: '/showcase/student/courses',
                params: {
                    codes: codes.join(','),
                },
            }),
        }),

        getShowcaseLessonDetail: builder.query<ShowcaseLessonDetailResponse, string>({
            query: (lessonId) => `/showcase/student/lessons/${lessonId}`,
        }),
    }),
});

export const {
    useGetShowcaseCoursesQuery,
    useGetShowcaseLessonDetailQuery,
} = showcaseApi;
