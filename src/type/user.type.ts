export interface UserResponse {
    id: string;
    email: string;
    role: string;
    full_name: string;
    phone_number: string;
    gender: string;
    dob: string;
    location: string;
    timezone: string;
    avatar_url: string;
}

export interface UserRequest {
    full_name?: string;
    phone_number?: string;
    gender?: string;
    dob?: string;
    location?: string;
    avatar_url?: string;
}

// For User Statistic
export interface CompletedLessonByDate {
    date: string;   // '2026-01-30'
    count: number;  // số lesson hoàn thành trong ngày
    detail: Record<string, number>; // chi tiết theo loại lesson
}