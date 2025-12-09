'use client';
import '@ant-design/v5-patch-for-react-19';
import QuizContent from '../components/quizSection';

export default function LectureQuizPage() {

    return (
        <div className="flex-1 flex flex-col gap-[0.5rem]">
            <div>
                <QuizContent />
            </div>
        </div>
    )
}