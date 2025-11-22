export interface SignUpRequest {
    email: string;
    password: string;
    name: string;
    gender: string;
    dob: string;
    location: string;
    phone: string;
    role: string;
}

export interface SignUpResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
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