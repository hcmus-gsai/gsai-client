import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CourseDisplayState {
    title: string;
    queryType: string;
}

const initialState: CourseDisplayState = {
    title : '',
    queryType : '',
}

const courseDisplaySlice = createSlice({
    name : 'courseDisplay',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setQueryType: (state, action: PayloadAction<string>) => {
            state.queryType = action.payload;
        }
    }
})

export const {setTitle, setQueryType} = courseDisplaySlice.actions;
export default courseDisplaySlice.reducer;