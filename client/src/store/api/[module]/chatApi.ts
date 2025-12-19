import {baseApi} from '../baseApi';
import { SendMessageRequest, SendMessageResponse } from '../../../type/chat.type';
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
    useGetChatHistoryQuery
} = chatApi;