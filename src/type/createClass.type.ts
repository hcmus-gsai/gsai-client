export interface Step1Data {
    courseCode: string;   
    courseName: string;  
    description: string;  
    categories: string[]; 
    pricingType: number; 
    price?: number;   
}

export interface Step2Data {

    chapterName: string;
    description: string;
}

export interface Lesson {
    chapter: number
    type: string;
    lessonName: string;
    file: File | null;

    contentType: string;
    createdAt: number;
}

export interface Question {
    index: number;
    question: string;
    score: number;
    options: string[];
    required: boolean; 
}

export interface Quiz {
    quizName: string;
    deadline: Date;
    questions: Question[];
    chapter: number;
    
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
    
    contentType: string;
    createdAt: number;
}

export interface Step3Data {
    lessons: Lesson[];
    quizs: Quiz[];
    projects: Project[];
}