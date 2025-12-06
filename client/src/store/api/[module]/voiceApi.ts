import { baseApi } from '../baseApi';
import { TranscribeResponse } from '@/type/voice.type';

export const voiceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        transcribeAudio: builder.mutation<TranscribeResponse, FormData>({
            query: (formData) => ({
                url: '/voice/transcribe',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {
    useTranscribeAudioMutation
} = voiceApi;