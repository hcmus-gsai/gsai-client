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

interface Lesson {
    type: string;
    lessonName: string;
    file: File | null;
}

interface Question {
    index: number;
    question: string;
    score: number;
    options: string[];
    required: boolean; 
}

interface Quiz {
    quizName: string;
    deadline: Date;
    questions: Question[];
}

interface Project {
    projectName: string;
    deadline: Date;
    file: File | null;
    permit: boolean;
    audio?: File | null;
}

export interface Step3Data {
    lessons: Lesson[];
    quizs: Quiz[];
    projects: Project[];
}