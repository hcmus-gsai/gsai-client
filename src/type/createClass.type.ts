export interface Step1Data {
    courseId?: string;
    courseCode: string;   
    courseName: string;  
    description: string;  
    duration?: string;
    categories: string[]; 
    pricingType: number; 
    price?: number;   
}

export interface Step2Data {
    courseId?: string;
    chapters: {
        chapterName: string;
        description: string;
        moduleId?: string;
    }[];
}

export interface Lesson {
    chapter: number
    type: string;
    lessonName: string;
    file: File | null;
    lessonId?: string;
    materialId?: string;
    moduleId?: string;
    estimatedCompletionTime?: string;
    order?: number;

    contentType: string;
    createdAt: number;
}

export interface Question {
    id?: string;
    index: number;
    question: string;
    score: number;
    options: Array<{
        id?: string;
        value: string;
    } | string>;
    correctOption?: number;
    required: boolean; 
}

export interface Quiz {
    quizName: string;
    expiredDate: number;
    duration: number;
    questions: Question[];
    chapter: number;
    lessonId?: string;
    moduleId?: string;
    order?: number;
    
    contentType: string;
    createdAt: number;
}

export interface Project {
    projectName: string;
    deadline: Date;
    file: File | null;
    permit: boolean;
    audio?: File | null;
    chapter: number;
    lessonId?: string;
    materialId?: string;
    moduleId?: string;
    order?: number;
    
    contentType: string;
    createdAt: number;
}

export interface Step3Data {
    lessons: Lesson[];
    quizs: Quiz[];
    projects: Project[];
}