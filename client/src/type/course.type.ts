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
export interface CourseLesson{
    id: string;
    name: string;
    description: string;
    

}
export interface CourseModule {
    id: string;
    name: string;
    lessons: CourseLesson[];
}
export interface CourseInfo{
    id: string;
    name: string;
    estimated_time: string;
    tags: string[];

    teachers?:string[];
    image_url?: string;
    rating?: number;
    description? :string;
    participants?: number;
    isFree?: boolean;
    category?:string[];

    //Course module
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
