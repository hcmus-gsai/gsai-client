import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { LessonProgress } from '@/type/lessonProgress.type';
import { RootState } from '../store';

interface StatsCount {
    total: number;
    completed: number;
}

interface ModuleStats {
    video: StatsCount;
    document: StatsCount;
    quiz: StatsCount;
}

interface LessonProgressState {
    courseId: string | null;
    lessonProgress: LessonProgress[];
    moduleStats: Record<string, ModuleStats>;
    totalLessons: number;
    completedLessons: number;
    completionPercent: number;
    isLoading: boolean;
}


const initialState: LessonProgressState = {
    courseId: null,
    lessonProgress : [],
    moduleStats : {},
    totalLessons : 0,
    completedLessons : 0,
    completionPercent : 0,
    isLoading : false,
}

const lessonProgressSlice = createSlice({
    name: 'lessonProgress',
    initialState,
    reducers: {
        setLessonProgressData: (state, action: PayloadAction<{
            courseId: string;
            lessonProgress: LessonProgress[];
        }>) => {

            state.courseId = action.payload.courseId;
            state.lessonProgress = action.payload.lessonProgress;
            state.completedLessons = action.payload.lessonProgress.filter(progress => progress.is_completed).length;
        },

        setModuleStats: (state, action: PayloadAction<{
            moduleId: string,
            stats: ModuleStats;
        }>) => {
            state.moduleStats[action.payload.moduleId] = action.payload.stats;
        },

        setTotalLessons: (state, action: PayloadAction<number>) => {
            state.totalLessons = action.payload;

            state.completionPercent = state.totalLessons > 0 ? Math.round((state.completedLessons / state.totalLessons) * 100): 0; 
        },

        toggleLessonCompletion: (state, action: PayloadAction<{
            lessonId: string,
            moduleId: string,
            lessonType: 'video' | 'document' | 'quiz'
        }>) => {
            const { lessonId, moduleId, lessonType } = action.payload;

            const progressIdx = state.lessonProgress.findIndex(
                (prog) => prog.lesson_id === lessonId && prog.module_id === moduleId
            )

            if (progressIdx !== -1) {
                const currentStatus = state.lessonProgress[progressIdx].is_completed;
                state.lessonProgress[progressIdx].is_completed = !currentStatus;
                state.completedLessons += currentStatus ? -1 : 1;

                if (state.moduleStats[moduleId]) {
                    const moduleStats = state.moduleStats[moduleId];
                    if (lessonType === 'video') {
                        moduleStats.video.completed += currentStatus ? -1 : 1;
                    } else if (lessonType === 'document') {
                        moduleStats.document.completed += currentStatus ? -1 : 1;
                    } else if (lessonType === 'quiz') {
                        moduleStats.quiz.completed += currentStatus ? -1 : 1;
                    }
                }

                state.completionPercent = state.totalLessons > 0 ? Math.round((state.completedLessons / state.totalLessons) * 100): 0;

            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        
        resetLessonProgress: () => initialState,
    }
});

export const {
    setLessonProgressData,
    setModuleStats,
    setTotalLessons,
    toggleLessonCompletion,
    setLoading,
    resetLessonProgress,
} = lessonProgressSlice.actions;

export const selectLessonProgressState = (state: RootState) => 
    state.lessonProgress;


export const selectCompletionPercent = (state: RootState) =>
    state.lessonProgress.completionPercent;


export const selectModuleStats = (state: RootState, moduleId: string) =>
    state.lessonProgress.moduleStats[moduleId];


export const selectIsLessonCompleted = (
    state: RootState,
    lessonId: string,
    moduleId: string
) => {
    const progress = state.lessonProgress.lessonProgress.find(
        (p) => p.lesson_id === lessonId && p.module_id === moduleId
    );
    return progress?.is_completed ?? false;
};


export const selectLessonCompletionStatus = (state: RootState) => {
    const statusMap : Record<string, boolean> = {};
    state.lessonProgress.lessonProgress.forEach((progress) => {
        statusMap[progress.lesson_id] = progress.is_completed;
    });
    return statusMap;
}

export const selectAllModuleStats = (state: RootState) => 
    state.lessonProgress.moduleStats;

export default lessonProgressSlice.reducer;