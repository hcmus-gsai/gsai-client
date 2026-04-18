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

export type ShowcaseQAQuestion = {
    question_id: string;
    content: string;
    intent: string;
    rubric_ref: string | null;
    difficulty: 'basic' | 'intermediate' | 'advanced';
};

export type ShowcaseQuestionScore = {
    question_id: string;
    question_content: string;
    score: 0 | 1 | 2;
    score_label: 'không hiểu' | 'hiểu một phần' | 'hiểu hoàn toàn';
    what_student_got_right: string;
    what_student_missed: string;
    key_evidence: string;
    rubric_criteria_met: string | null;
};

export type ShowcaseGradingReport = {
    student_name: string | null;
    total_score: number;
    max_score: number;
    percentage: number;
    summary: string;
    per_question: ShowcaseQuestionScore[];
    generated_at: string;
};

export type ShowcaseCreateQASessionResponse = {
    session_id: string | null;
    questions: ShowcaseQAQuestion[];
    status: string;
    stage: 'loading' | 'interviewing' | 'grading' | 'result';
    grading_report: ShowcaseGradingReport | null;
};

export type ShowcaseCurrentQASessionResponse = {
    session_id: string | null;
    stage: 'loading' | 'interviewing' | 'grading' | 'result';
    questions: ShowcaseQAQuestion[];
    grading_report: ShowcaseGradingReport | null;
    last_status?: {
        agent_message: string;
        current_question_id: string;
        question_index: number;
        question_status: string;
        interview_status: string;
    };
    updated_at: string;
};

export type ShowcaseStartInterviewResponse = {
    question_index: number;
    agent_message: string;
    current_question_id: string;
};

export type ShowcaseRespondResponse = {
    agent_message: string;
    current_question_id: string;
    question_index: number;
    question_status: string;
    interview_status: 'in_progress' | 'completed';
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

        createShowcaseProjectQASession: builder.mutation<ShowcaseCreateQASessionResponse, string>({
            query: (lessonId) => ({
                url: `/showcase/student/projects/${lessonId}/qa/sessions`,
                method: 'POST',
            }),
        }),

        getShowcaseProjectQASession: builder.query<ShowcaseCurrentQASessionResponse, string>({
            query: (lessonId) => `/showcase/student/projects/${lessonId}/qa/sessions/current`,
        }),

        startShowcaseProjectQAInterview: builder.mutation<ShowcaseStartInterviewResponse, string>({
            query: (lessonId) => ({
                url: `/showcase/student/projects/${lessonId}/qa/start-interview`,
                method: 'POST',
            }),
        }),

        respondShowcaseProjectQA: builder.mutation<ShowcaseRespondResponse, { lessonId: string; student_message: string }>({
            query: ({ lessonId, student_message }) => ({
                url: `/showcase/student/projects/${lessonId}/qa/respond`,
                method: 'POST',
                body: { student_message },
            }),
        }),

        getShowcaseProjectQAReport: builder.query<ShowcaseGradingReport, string>({
            query: (lessonId) => `/showcase/student/projects/${lessonId}/qa/report`,
        }),

        saveShowcaseProjectQAResult: builder.mutation<{ success: boolean; session_id: string | null; stage: string }, { lessonId: string; grading_report: ShowcaseGradingReport }>({
            query: ({ lessonId, grading_report }) => ({
                url: `/showcase/student/projects/${lessonId}/qa-result`,
                method: 'PATCH',
                body: { grading_report },
            }),
        }),
    }),
});

export const {
    useGetShowcaseCoursesQuery,
    useGetShowcaseLessonDetailQuery,
    useCreateShowcaseProjectQASessionMutation,
    useGetShowcaseProjectQASessionQuery,
    useStartShowcaseProjectQAInterviewMutation,
    useRespondShowcaseProjectQAMutation,
    useLazyGetShowcaseProjectQAReportQuery,
    useSaveShowcaseProjectQAResultMutation,
} = showcaseApi;
