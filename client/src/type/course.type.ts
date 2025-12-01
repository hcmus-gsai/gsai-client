// Course Types
// export interface Course {
//     id: number;
//     name: string;
//     category: string;
//     teacher: string | string[];
//     estimated_time: string;
//     rating: number;
//     tags: string[];
//     image?: string;
//     description?: string;
//     createdAt?: string;
//     updatedAt?: string;
// }

// export interface CourseSubItem {
//     id: string;
//     name: string;
//     type: 'video' | 'Bài đọc' | 'Quiz' | string;
//     duration: string;
//     status: 'Hoàn thành' | 'Chưa hoàn thành' | string;
// }

// export interface CourseChapter {
//     id: number;
//     name: string;
//     status: 'Hoàn thành' | 'Chưa hoàn thành' | string;
//     subItem: CourseSubItem[];
// }

// export interface CourseDetail extends Course {
//     chapters?: CourseChapter[];
// }

// export interface CourseVideo {
//     id: string;
//     name: string;
//     url: string;
//     duration: string;
//     description?: string;
//     chapterId?: number;
// }

// // Request/Response Types
// export interface GetCoursesRequest {
//     category?: string;
//     search?: string;
//     limit?: number;
//     offset?: number;
// }

// export interface GetCoursesResponse {
//     courses: Course[];
//     total: number;
//     limit: number;
//     offset: number;
// }

// export interface GetCourseDetailRequest {
//     category: string;
//     name: string;
// }

// export interface GetCourseDetailResponse extends CourseDetail {}

// export interface GetCourseChaptersRequest {
//     category: string;
//     courseName: string;
// }

// export interface GetCourseChaptersResponse {
//     chapters: CourseChapter[];
// }

// export interface GetCourseVideoRequest {
//     category: string;
//     courseName: string;
//     videoId: string;
// }

// export interface GetCourseVideoResponse extends CourseVideo {}

export interface LessonInfo {
    id: string;
    name: string;
    estimatedTime: string;
    type: 'video' | 'article' | 'quiz';
    status: 'completed' | 'in-progress' | 'not-started';

    startedAt?: string;
    completedAt?: string;
    deadline?: string;
    grade?: number;
}

export interface ModuleInfo {
    id: string;
    name: string;
    status: 'completed' | 'in-progress' | 'not-started';

    startedAt?: string;
    completedAt?: string;

    // Course lessons
    lessons: LessonInfo[];
}

export interface CourseInfo {
    id: string;
    name: string;
    estimatedTime: string;
    tags: string[];

    teachers?: string[];
    imageUrl?: string;
    rating?: number;
    description?: string;
    participants?: number;
    isFree?: boolean;
    category?: string[];

    // Course modules
    modules: ModuleInfo[];
}

// export interface ChapterSection {
//     id: string;
//     name: string;
//     type: 'video' | 'Bài đọc' | 'Quiz' | string;
//     duration: string;

// }


// export interface CourseChapter {
//     id: string;
//     name: string;
//     status: 'Hoàn thành' | 'Chưa hoàn thành' | string;
//     chapterSection: ChapterSection[];
// }
// export interface Event {
//     id: string;
//     name:string;
//     start_date: string;
//     end_date: string;

// }

// export interface CourseDetail extends CourseInfo {
//     chapters?: CourseChapter[];
//     events?:  Event[]
// }
