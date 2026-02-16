import { QuizCourseResponse } from '@/type/quiz.type'
import { createSlice, PayloadAction  } from '@reduxjs/toolkit'
import {RootState} from '../store';
interface LearningProgressQuiz {
    quizzesByCourse: Record<string, QuizCourseResponse[]>
    isLoading: boolean
}

const initialState :  LearningProgressQuiz  = {
    quizzesByCourse : {},
    isLoading: false
}

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers :{
        setQuizzesByCourseId: (state, action: PayloadAction<{
            courseId:string,
            quizzes: QuizCourseResponse[]
        }>) =>{
            state.quizzesByCourse[action.payload.courseId] = action.payload.quizzes
        },

        clearQuizzesByCourseId : (state, action:PayloadAction<{
            courseId: string
        }>) => {
            state.quizzesByCourse[action.payload.courseId] = []
        }
    }
})

export const {
    setQuizzesByCourseId,
    clearQuizzesByCourseId
} = quizSlice.actions; 


export const selectQuizMap = (state: RootState) =>
    state.quiz.quizzesByCourse;

export default quizSlice.reducer;

