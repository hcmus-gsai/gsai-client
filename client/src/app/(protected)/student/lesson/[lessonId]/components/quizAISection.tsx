import '@ant-design/v5-patch-for-react-19';
import { Button, Card } from "antd";
import { useGetQuizByLessonIdQuery } from '@/store/api/[module]/quizApi';

const QuizAIContent = ({ lessonId }: { lessonId: string }) => {

    localStorage.setItem("lessonId", lessonId);

    const { data: quizRes } = useGetQuizByLessonIdQuery(lessonId);
    const quiz = quizRes;

    return (
        <div className="flex-1">
            <div className="w-full flex items-center justify-start mb-[1rem]">
                <p className="text-[1.5rem] font-bold text-[var(--color-primary)]">{quiz?.lesson_name}</p>
            </div>
            <Card
                className="!mb-[1rem] !w-full !rounded-[20px] !border !border-gray-200 !bg-[var(--color-neutral)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4"
            >
                <p className="text-[1rem] font-bold text-[var(--color-primary)]">Luyện tập cùng AI</p>
                <div className="flex items-start justify-between gap-[1rem]">
                    <div className="w-full flex items-start justify-start">
                        Tận dụng AI để ôn luyện để đảm bảo bạn có sự chuẩn bị hoàn hảo nhất.
                    </div>

                    <Button
                        className="!w-[155px] !h-[54px] !rounded-full !flex !items-center !justify-center !bg-[var(--color-secondary)] !text-white !border !border-[var(--color-secondary)] hover:!bg-neutral hover:!text-[var(--color-secondary)]"
                    >
                        Bắt đầu
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default QuizAIContent;