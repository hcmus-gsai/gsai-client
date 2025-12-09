'use client';
import '@ant-design/v5-patch-for-react-19';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

// const lessonId = "cb2adaed-0af3-4608-b1ab-5907db64a285";
// const quizId = "76797ff7-33ec-49b8-9e7d-7295d3fde640";

const QuizNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 w-full h-[5rem] flex items-center border-b border-gray-200 bg-white z-20">
            <div className="flex items-center gap-5 ml-30">
                <ArrowLeftOutlined className="text-xl cursor-pointer" />
                <div>
                    <h1 className="text-xl font-semibold">Bài tập Toán ứng dụng</h1>
                    <p className="text-sm text-gray-500">30 phút</p>
                </div>
            </div>
            <p className="text-sm text-gray-500 ml-auto mr-30">
                Hết hạn vào T4 12/11/2025, 23:59
            </p>
        </nav>
    );
}

const QA = [
    {
        id: 1,
        question_text: "Câu 1: Hệ phương trình nào sau đây có vô số nghiệm?",
        point: "2 điểm",
        is_answered: true,
        is_correct: true,
        quiz_options: [
            {
                option_id: '1a',
                option_text: '2x + 3y = 5',
                is_correct: false,
            },
            {
                option_id: '1b',
                option_text: 'x - y = 1',
                is_correct: false,
            },
            {
                option_id: '1c',
                option_text: 'Hệ vô nghiệm',
                is_correct: false,
            },
            {
                option_id: '1d',
                option_text: 'x = x',
                is_correct: true,
            }
        ]
    },
    {
        id: 2,
        question_text: "Câu 2: Hệ phương trình nào sau đây có vô số nghiệm?",
        point: "2 điểm",
        is_answered: true,
        is_correct: false,
        quiz_options: [
            {
                option_id: '2a',
                option_text: '2x + 3y = 5',
                is_correct: false,
            },
            {
                option_id: '2b',
                option_text: 'x - y = 1',
                is_correct: false,
            },
            {
                option_id: '2c',
                option_text: 'Hệ vô nghiệm',
                is_correct: false,
            },
            {
                option_id: '2d',
                option_text: 'x = x',
                is_correct: true,
            }
        ]
    },
    {
        id: 3,
        question_text: "Câu 3: Hệ phương trình nào sau đây có vô số nghiệm?",
        point: "2 điểm",
        is_answered: false,
        is_correct: false,
        quiz_options: [
            {
                option_id: '3a',
                option_text: '2x + 3y = 5',
                is_correct: false,
            },
            {
                option_id: '3b',
                option_text: 'x - y = 1',
                is_correct: false,
            },
            {
                option_id: '3c',
                option_text: 'Hệ vô nghiệm',
                is_correct: false,
            },
            {
                option_id: '3d',
                option_text: 'x = x',
                is_correct: true,
            }
        ]
    },
    {
        id: 4,
        question_text: "Câu 4: Hệ phương trình nào sau đây có vô số nghiệm?",
        point: "2 điểm",
        is_answered: false,
        is_correct: false,
        quiz_options: [
            {
                option_id: '4a',
                option_text: '2x + 3y = 5',
                is_correct: false,
            },
            {
                option_id: '4b',
                option_text: 'x - y = 1',
                is_correct: false,
            },
            {
                option_id: '4c',
                option_text: 'Hệ vô nghiệm',
                is_correct: false,
            },
            {
                option_id: '4d',
                option_text: 'x = x',
                is_correct: true,
            }
        ]
    }
];

const QASection = () => {
    return (
        <section className="w-full flex flex-col items-center justify-center mt-[8rem] mb-[2rem]">
            <div>
                {QA.map((item) => (
                    <div key={item.id} className="mb-8 p-4 border-none rounded-lg w-full">
                        <div className="flex items-center justify-between w-full mb-2 gap-4">
                            <h2 className="text-lg font-regular flex-1 truncate">
                                {item.question_text}
                            </h2>
                            <span className="text-sm font-normal !bg-[var(--color-neutral)] rounded-full px-3 py-1 !text-[var(--color-secondary)] whitespace-nowrap">
                                {item.point}
                            </span>
                        </div>
                        <ul className="space-y-2">
                            {item.quiz_options.map((option) => (
                                <li key={option.option_id}>
                                    <label className="relative flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 leading-none">
                                        <input type="radio" name={`quiz-${item.id}`} value={option.option_id} />
                                        <span className="text-gray-800 text-base peer-checked:text-[var(--color-secondary)]">
                                            {option.option_text}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>

                    </div>
                ))}
            </div>
        </section>
    )
}

const ProgressSection = () => {
    const TimeRemaining = [
        {
            hour: 0,
            minute: 20,
            second: 15,
        }
    ]

    return (
        <section className="w-[calc(100%-12rem)] flex flex-col items-center justify-center text-center mt-[8rem] mb-[2rem] border border-gray-200 rounded-2xl">
            <div className='m-6'>
                <h2 className="text-2xl font-semibold mb-4">Thời gian còn lại</h2>
                <div className="text-3xl font-bold mb-4 flex gap-6 justify-center">
                    {TimeRemaining.map((time, index) => (
                        <div key={index} className="flex items-center gap-6">

                            <div className="flex flex-col items-center">
                                <div>{time.hour.toString().padStart(2, '0')}</div>
                                <p className="text-sm font-normal">giờ</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <div>{time.minute.toString().padStart(2, '0')}</div>
                                <p className="text-sm font-normal">phút</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <div>{time.second.toString().padStart(2, '0')}</div>
                                <p className="text-sm font-normal">giây</p>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    {QA.map((item) => (
                        <div
                            key={item.id}
                            className={`mb-4 w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium 
                            ${item.is_answered
                                    ? "bg-[var(--color-neutral)] text-black"
                                    : "bg-[var(--color-secondary-light)] text-black"
                                }`}
                        >
                            {item.id}
                        </div>
                    ))}
                </div>

                <Button
                    htmlType="submit"
                    className="!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)]"
                >
                    Nộp bài
                </Button>
            </div>
        </section>
    )
}

export default function SolvingQuizPage({ }: {
    params: { lessonId: string };
}) {
    return (
        <div className="flex-1 flex flex-col gap-[0.5rem]">
            <QuizNavbar />
            <main className="w-full grow flex flex-col md:flex-row items-start justify-between min-h-screen overflow-x-clip px-4">
                <div className="flex-[6] md:pr-6">
                    <QASection />
                </div>
                <div className="flex-[4] md:pl-6 flex justify-center sticky top-2 h-fit">
                    <ProgressSection />
                </div>
            </main>
        </div>
    )
}