export interface SignUpRequest {
    email: string;
    password?: string;
    auth_provider?: 'local' | 'google';
    role: string;
}

export interface SignUpResponse {
    userId: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    userId: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
    location?: string;
}