import { baseApi } from '../baseApi';
import { QuizResponse, QuestionsResponse } from '../../../type/quiz.type';

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

    }),
});

export const {
    useGetQuizByLessonIdQuery,
    useGetQuizQuestionsByQuizIdQuery,
} = quizApi;
