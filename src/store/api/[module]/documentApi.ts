import { baseApi } from '../baseApi';
import { DocumentResponse } from '@/type/document.type';


export const documentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getDocument: builder.query<DocumentResponse, string>({
            query: (lessonId) => `/lessons/${lessonId}/documents`,
            providesTags: ['Document'],
        }),
    }),
});

export const {
    useGetDocumentQuery,
    useLazyGetDocumentQuery,
} = documentApi;