'use client';

import { RedirectButton } from "@/components/shared/redirect-button";
import { Table } from "@/components/teacher/table";

const SubmissionHistorySection = ({
    title,
    type = "submission",
}: {
    title: string;
    type?: "submission" | "ai_task";
}) => {
    return (
        <section className="w-full flex flex-col items-center gap-6 mt-10 mb-10">
            <div className="flex flex-col items-center justify-center w-[var(--global-width)] gap-[1.5rem] px-4">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold w-full text-[var(--color-primary)] text-center md:text-left">{title}</h1>
                <div className="flex items-center justify-center w-full">
                    {type === "submission" ? (
                        <Table
                            columns={ColumnName}
                            data={HistoryData}
                            maxItems={4}
                            type={type}
                        />
                    ) : (
                        <Table
                            columns={AITaskColumnName}
                            data={AITaskHistoryData}
                            maxItems={4}
                            type={type}
                        />)}
                </div>
            </div>
            {HistoryData?.length && HistoryData.length > 4 ?
                (<div className="flex items-center justify-center w-[var(--global-width)] py-[2rem]">
                    <RedirectButton
                        title={title}
                        text="Xem tất cả"
                        buttonBg="white"
                        buttonText="var(--color-secondary)"
                        buttonBorder="#1363DF"
                        iconBg="var(--color-secondary)"
                        iconText="var(--color-bg_white)"
                    />
                </div>) : null}
        </section>
    )
}

const ColumnName = ["Bài tập", "Học sinh", "Ngày nộp", "Điểm số"];
const HistoryData = [
    {
        id: 1,
        lessonName: "Bài tập 1: Giới thiệu về trí tuệ nhân tạo",
        studentName: "Nguyễn Văn A",
        submissionDate: "23/02/2026",
        score: 100,
    },
    {
        id: 2,
        lessonName: "Bài tập 2: Học máy cơ bản",
        studentName: "Trần Thị B",
        submissionDate: "24/02/2026",
        score: 95,
    },
    {
        id: 3,
        lessonName: "Bài tập 3: Mạng nơ-ron nhân tạo",
        studentName: "Lê Văn C",
        submissionDate: "25/02/2026",
        score: 90,
    },
    {
        id: 4,
        lessonName: "Bài tập 4: Xử lý ngôn ngữ tự nhiên",
        studentName: "Phạm Thị D",
        submissionDate: "26/02/2026",
        score: 85,
    }
]

const AITaskColumnName = ["Tác vụ AI", "Trạng thái", "Bắt đầu", "Kết thúc"];
const AITaskHistoryData = [
    {
        id: 1,
        lessonName: "Tác vụ AI 1: Phân loại hình ảnh",
        status: "Đang tạo",
        createdAt: "23/02/2026",
        endedAt: null,
    },
    {
        id: 2,
        lessonName: "Tác vụ AI 2: Dự đoán chuỗi thời gian",
        status: "Lỗi",
        createdAt: "24/02/2026",
        endedAt: null,
    },
    {
        id: 3,
        lessonName: "Tác vụ AI 3: Phân tích cảm xúc",
        status: "Đã hoàn thành",
        createdAt: "25/02/2026",
        endedAt: "26/02/2026",
    }
]

export { SubmissionHistorySection };