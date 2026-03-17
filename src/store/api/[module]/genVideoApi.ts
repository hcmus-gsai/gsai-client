import { baseApi } from '../baseApi';

export const videoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Transcribe audio file to text
        audioTranscribe: builder.mutation<{ transcript: string, message: string }, { audioFile: File }>({
            query: ({ audioFile }) => {
                const formData = new FormData();
                formData.append('file', audioFile);
                return {
                    url: '/voice/transcribe',
                    method: 'POST',
                    body: formData,
                };
            },
        }),

        // Get, Create Register Voice of user
        getRegisterVoice: builder.query<
            { voice_name: string; audio_url: string }[], 
            void
        >({
            query: () => ({
                url: '/voice-cloning/register',
                method: 'GET',
            }),
        }),

    }),

});

export const {
    // Transcribe audio file to text
    useAudioTranscribeMutation,

    // Get, Create Register Voice of user
    useGetRegisterVoiceQuery,


} = videoApi;