// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface LessonState {
//     moduleId: string | null;
// }

// const initialState: LessonState = {
//     moduleId: null,
// };

// const lessonSlice = createSlice({
//     name: 'lesson',
//     initialState,
//     reducers: {
//         setModuleId: (state, action: PayloadAction<string>) => {
//             state.moduleId = action.payload;
//         },
//         clearModuleId: (state) => {
//             state.moduleId = null;
//         },
//     },
// });

// export const { setModuleId, clearModuleId } = lessonSlice.actions;
// export default lessonSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LessonState {
    moduleId: string | null;
    isFullWidthMode: boolean;
}

const initialState: LessonState = {
    moduleId: null,
    isFullWidthMode: false,
}

const lessonSlice = createSlice({
    name: 'lesson',
    initialState,
    reducers: {
        setModuleId: (state, action: PayloadAction<string>) => {
            state.moduleId = action.payload;
        },
        clearModuleId: (state) => {
            state.moduleId = null;
        },
        setFullWidthMode: (state, action: PayloadAction<boolean>) => {
            state.isFullWidthMode = action.payload;
        }
    }
})

export const { setModuleId, clearModuleId, setFullWidthMode } = lessonSlice.actions;
export default lessonSlice.reducer;