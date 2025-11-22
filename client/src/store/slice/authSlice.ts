import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../type/auth.type';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const isClient = typeof window !== "undefined";

const initialState: AuthState = {
  user: null,
  isAuthenticated: isClient ? !!localStorage.getItem('accessToken') : false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        email: '',
        password: ''
    },
    reducers: {
        signUpWithEmailPassword(state, action) {
            const { email, password } = action.payload;
            state.email = email;
            state.password = password;
        }
    },
});

export const { } = authSlice.actions;
export default authSlice.reducer;