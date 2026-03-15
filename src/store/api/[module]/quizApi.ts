import { baseApi } from '../baseApi';
import { QuizCourseResponse, QuizResponse, QuestionsResponse, AnswerSubmit, GradeResponse, AttemptResponse } from '../../../type/quiz.type';

export const quizApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getQuizByLessonId: builder.query<QuizResponse, string>({
            query: (lesson_id) => `/lessons/${lesson_id}/quizzes`,
            providesTags: (result, error, id) => [{ type: 'Quiz', id }],
        }),

        getQuizQuestionsByQuizId: builder.query<QuestionsResponse[], string>({
            query: (quiz_id) => `/quizzes/${quiz_id}/questions`,
            providesTags: (result, error, id) => [{ type: 'Quiz', id }],
        }),

        submitQuiz: builder.mutation<AttemptResponse, { quiz_id: string; answers: AnswerSubmit[], time_used: number }>({
            query: ({ quiz_id, answers, time_used }) => ({
                url: `/quizzes/${quiz_id}/submit`,
                method: 'POST',
                body: {
                    time_used: time_used,
                    responses: answers,
                },
            }),
            invalidatesTags: (result, error, { quiz_id }) => [{ type: 'Quiz', id: quiz_id }],
        }),

        gradeQuizAttempt: builder.mutation<GradeResponse, { attempt_id: string }>({
            query: ({ attempt_id }) => ({
                url: `/quiz-attemps/${attempt_id}/grade`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, { attempt_id }) => [{ type: 'Quiz', id: attempt_id }],
        }),

        getLatestQuizAttempt: builder.query<AttemptResponse, string>({
            query: (quiz_id) => `/quiz-attemps/${quiz_id}/latest`,
            providesTags: (result, error, quiz_id) => [{ type: 'Quiz', id: quiz_id }],
        }),

        getQuizzesByCourseId: builder.query<QuizCourseResponse[], string>({
            query: (course_id) => `/courses/${course_id}/quizzes`,
            providesTags: (result, error, id) => [{ type: 'Quiz', id }],
        }),
    }),
});

export const {
    useGetQuizByLessonIdQuery,
    useLazyGetQuizByLessonIdQuery,
    useGetQuizQuestionsByQuizIdQuery,
    useLazyGetQuizQuestionsByQuizIdQuery,
    useSubmitQuizMutation,
    useGradeQuizAttemptMutation,
    useGetLatestQuizAttemptQuery,
    useGetQuizzesByCourseIdQuery,
    useLazyGetQuizzesByCourseIdQuery,
} = quizApi;
