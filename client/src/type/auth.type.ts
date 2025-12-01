export interface SignUpRequest {
    email: string;
    password_hash: string;
    role: string;
    full_name: string;
    phone_number: string;
    gender: string;
    dob: string;
    location: string;
    avatar_url?: string;
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