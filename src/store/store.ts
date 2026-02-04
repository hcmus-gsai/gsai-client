import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authReducer from './slice/authSlice';
import lessonReducer from './slice/lessonSlice';
import taskReducer from './slice/taskSlice';
import courseDisplayReducer from './slice/courseDisplaySlice';
import './api/[module]/courseApi'; // Import để đăng ký courseApi endpoints
import notifyReducer from './slice/notifySlice';
import lessonProgressReducer from './slice/lessonProgressSlice';
import quizReducer from  './slice/quizSlice';

//Add redux persists
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {combineReducers} from '@reduxjs/toolkit';

const lessonPersistConfig = {
    key: 'lesson',
    storage,
    whitelist: ['moduleId']
}

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    lesson: persistReducer(lessonPersistConfig, lessonReducer),
    task:taskReducer,
    courseDisplay: courseDisplayReducer,
    notify: notifyReducer,
    lessonProgress: lessonProgressReducer,
    quiz: quizReducer,
})

export const store = configureStore({
    // reducer: {
    //     [baseApi.reducerPath]: baseApi.reducer,
    //     auth: authReducer,
    //     lesson: lessonReducer,
    //     task: taskReducer,
    //     courseDisplay: courseDisplayReducer,
    //     notify: notifyReducer,
    //     lessonProgress: lessonProgressReducer,
    //     quiz: quizReducer,
    // },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;