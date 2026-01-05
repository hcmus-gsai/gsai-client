'use client';
import '@ant-design/v5-patch-for-react-19';
import QuizContent from '../components/quizSection';
import { useParams } from 'next/navigation';
import QuizAIContent from '../components/quizAISection';

export default function LectureQuizPage() {

    const { lessonId } = useParams();

    return (
        <div className="flex-1 flex flex-col gap-[0.5rem]">
            <QuizAIContent lessonId={lessonId as string} />
            <QuizContent lessonId={lessonId as string} />
        </div>
    )
}