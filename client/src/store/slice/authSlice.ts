import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../type/auth.type';
import type { RootState } from '../store';

export type AuthState = {
    user: User | null,
}

const initialState: AuthState = {
    user: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        signOut: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, signOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
