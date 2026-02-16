import { createSlice, PayloadAction  } from '@reduxjs/toolkit'
interface Task {
    id: string;
    title: string;
    description?:string;
    priorityLevel : 'low' | 'medium' | 'high';
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
    estimatedTime: number;
    actualTime?:number;
    completedAt?: Date;
    status: 'pending' | 'completed' | 'overdue';
}

interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
}
interface TaskState {
    tasks: Task[];
    stats: TaskStats
}

const initialState: TaskState = {
    tasks : [],
    stats: {
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
    }
}

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },
        // updateTask: (state, action: PayloadAction<Task>) => {
        //     const { id, ...updates } = action.payload;
        //     const taskIndex = state.tasks.findIndex(task => task.id === id);
        //     if (taskIndex !== -1) {
        //         state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
        //     }
        // },
        // deleteTask: (state, action: PayloadAction<string>) => {
        //     state.tasks = state.tasks.filter(task => task.id !== action.payload);
        // },

        // getTasksForDate: (state, action: PayloadAction<Date>) => {
        //     const date = action.payload;
        //     state.tasks = state.tasks.filter(task => new Date(task.dueDate).toDateString() === date.toDateString());
        // }
    }
});

export const {addTask} = taskSlice.actions;
export default taskSlice.reducer;

