'use client';
import '@ant-design/v5-patch-for-react-19';
import QuizContent from '../components/quizSection';
import { useParams } from 'next/navigation';

export default function LectureQuizPage() {

    const { lessionId } = useParams();

    return (
        <div className="flex-1 flex flex-col gap-[0.5rem]">
            <QuizContent lessonId={lessionId as string} />
        </div>
    )
}