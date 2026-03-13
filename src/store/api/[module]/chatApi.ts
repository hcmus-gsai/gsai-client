import {baseApi} from '../baseApi';
import { SendMessageRequest, SendMessageRequestV2, SendMessageResponse, SendMessageResponseV2 } from '../../../type/chat.type';
import { ChatHistoryRequest, ChatHistoryResponse } from '../../../type/chat.type';
export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
            query: (body) => ({
                url: 'chat/messages/',
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { module_id }) => [
                { type: 'ChatModule', id: module_id }
            ],
        }),

        sendMessageV2: builder.mutation<SendMessageResponseV2, SendMessageRequestV2>({
            query: (body) => ({
                url: 'chat/messages/v2/',
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { module_id }) => [
                { type: 'ChatModule', id: module_id }
            ],
        }),

        getChatHistory: builder.query<ChatHistoryResponse, ChatHistoryRequest>({
            query: (params) =>({
                url: 'chat/history',
                method : 'GET',
                params: params
            }),
            providesTags: (result, error, { module_id }) => [
                { type: 'ChatModule', id: module_id }
            ],
        })
    })
})

export const {
    useSendMessageMutation,
    useSendMessageV2Mutation,
    useGetChatHistoryQuery,
    useLazyGetChatHistoryQuery
} = chatApi;