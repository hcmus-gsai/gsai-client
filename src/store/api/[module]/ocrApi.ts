import {baseApi} from '../baseApi';
import { IVideoGenJobResponse } from '../../../type/videoGenJob';

export const vidGenJobApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVideoGenJobById: builder.query<IVideoGenJobResponse, string>({
            query: (id) => ({
                url: `video-generation/requests/lesson/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [
                { type: 'IVideoGenJob', id }
            ],
        }),
    })
})

export const {
    useGetVideoGenJobByIdQuery
} = vidGenJobApi;