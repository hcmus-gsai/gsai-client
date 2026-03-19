import { baseApi } from '../baseApi';
import { TranscribeResponse } from '@/type/voice.type';
import {VoiceCloneResponse} from "@/type/voice.type";
export const voiceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        transcribeAudio: builder.mutation<TranscribeResponse, FormData>({
            query: (formData) => ({
                url: '/voice/transcribe',
                method: 'POST',
                body: formData,
            }),
        }),

        // If teacher call this api, do not add teacher_id to body, let server get teacher_id from token. 
        cloneVoice: builder.mutation<VoiceCloneResponse, {text: string, voice_name:string, teacher_id?:string}>({
            query: (body) => ({
                url: "/voice-cloning/clone",
                method: "POST",
                body: body
            }) 
        })
    }),
});

export const {
    useTranscribeAudioMutation,
    useCloneVoiceMutation
} = voiceApi;