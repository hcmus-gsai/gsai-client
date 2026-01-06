import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { actionAsyncStorage } from 'next/dist/server/app-render/action-async-storage.external';
import type { RootState } from '../store';

export interface NotificationItem {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    description?:string;
    createdAt: number;
    isShown: boolean;
}

interface NotifyState {
    notifications: NotificationItem[];
}

const initialState: NotifyState = {
    notifications: [],
}

const notifySlice = createSlice({
    name : 'notify',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id'>>) => {
            const newId = Date.now().toString();
            state.notifications.push({
                ...action.payload, id: newId,
                createdAt: Date.now(),
                isShown: false
            })
        },

        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
        },

        clearNotifications: (state) => {
            state.notifications = [];
        },

        markNotificationAsShown: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload);

            if (notification) {
                notification.isShown = true;
            }
        
        }
    }
})

export const {
    addNotification,
    removeNotification,
    clearNotifications,
    markNotificationAsShown,
} = notifySlice.actions;
export default notifySlice.reducer;

export const selectNotifications = (state: RootState) => state.notify.notifications;
