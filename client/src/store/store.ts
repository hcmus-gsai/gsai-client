import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authReducer from './slice/authSlice';
import lessonReducer from './slice/lessonSlice';
import taskReducer from './slice/taskSlice';
import courseDisplayReducer from './slice/courseDisplaySlice';
import './api/[module]/courseApi'; // Import để đăng ký courseApi endpoints

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
        lesson: lessonReducer,
        task: taskReducer,
        //Thêm vào courseDisplay vào để test 
        courseDisplay: courseDisplayReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;