import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../type/auth.type';
import type { RootState } from '../store';

export type AuthState = {
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        signOut: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { setCredentials, signOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
