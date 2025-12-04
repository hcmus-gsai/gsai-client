import { baseApi } from '../baseApi'; 
import { TranscribeRequest, TranscribeResponse } from '@/type/voice.type';


export const voiceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        transcribeAudio: builder.mutation<TranscribeResponse, TranscribeRequest>({
            query: (body) => ({
                url: '/voice/transcribe',
                method: 'POST',
                body,
            }),
        }),
    })
})

export const { 
    useTranscribeAudioMutation 
} = voiceApi;