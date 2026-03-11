'use client';

import { RedirectButton } from "@/components/shared/redirect-button";
import { Table } from "@/components/teacher/table";
import { useGetAllSubmissionsQuery } from "@/store/api/[module]/projectApi";

const SubmissionHistorySection = ({
    title,
    type = "submission",
}: {
    title: string;
    type?: "submission" | "ai_task";
}) => {
    const { data: submissionsData, isLoading } = useGetAllSubmissionsQuery(null);

    const historyData = submissionsData?.data?.map((item, index) => ({
        id: index + 1,
        courseName: item.course_name,
        lessonName: item.lesson_name,
        studentName: item.student_name,
        submissionDate: item.submitted_at,
        score: item.grade,
        submission_status: item.submission_status,
        grading_status: item.grading_status,
    })) || [];

    return (
        <section className="w-full flex flex-col items-center gap-6 mt-10 mb-10">
            <div className="flex flex-col items-center justify-center w-[var(--global-width)] gap-[1.5rem] px-4">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold w-full text-[var(--color-primary)] text-center md:text-left">{title}</h1>
                <div className="flex items-center justify-center w-full">
                    {isLoading ? (
                        <div className="text-center py-8">Đang tải...</div>
                    ) : type === "submission" ? (
                        <Table
                            columns={ColumnName}
                            data={historyData}
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
            {historyData?.length && historyData.length > 4 ?
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

// Mock data removed - now using API data from useGetAllSubmissionsQuery

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