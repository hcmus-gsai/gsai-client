import { baseApi } from '../baseApi';
import { QuizResponse, QuestionsResponse, AnswerSubmit, QuizSubmitResponse, GradeResponse } from '../../../type/quiz.type';

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

        submitQuiz: builder.mutation<QuizSubmitResponse, { quiz_id: string; answers: AnswerSubmit[] }>({
            query: ({ quiz_id, answers }) => ({
                url: `/quizzes/${quiz_id}/submit`,
                method: 'POST',
                body: answers,
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
    }),
});

export const {
    useGetQuizByLessonIdQuery,
    useGetQuizQuestionsByQuizIdQuery,
    useSubmitQuizMutation,
    useGradeQuizAttemptMutation,
} = quizApi;
