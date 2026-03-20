'use client';

import { RedirectButton } from "@/components/shared/redirect-button";
import { Table } from "@/components/teacher/table";
import { useGetAllSubmissionsQuery } from "@/store/api/[module]/projectApi";
import { useGetVideoGenerationRequestsQuery } from "@/store/api/[module]/aiStudioApi";

const SubmissionHistorySection = ({
    title,
    type = "submission",
}: {
    title: string;
    type?: "submission" | "ai_task";
}) => {
    const { data: submissionsData, isLoading } = useGetAllSubmissionsQuery(null);
    const { data: aiTasksData = [], isLoading: isAiTasksLoading } = useGetVideoGenerationRequestsQuery();

    const formatDateTime = (value?: string | Date | null) => {
        if (!value) return "-";

        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "-";

        const hh = String(parsed.getHours()).padStart(2, "0");
        const mm = String(parsed.getMinutes()).padStart(2, "0");
        const dd = String(parsed.getDate()).padStart(2, "0");
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const yyyy = parsed.getFullYear();

        return `${hh}:${mm} ${dd}/${month}/${yyyy}`;
    };

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

    const aiTaskHistoryData = aiTasksData.map((item, index) => ({
        id: index + 1,
        lessonName: 'Tạo Video AI: ' + item.videoName,
        status: item.jobStatus,
        createdAt: formatDateTime(item.createAt),
        endedAt: item.completedAt ? formatDateTime(item.completedAt) : "-",
    }));

    const isTableLoading = type === "submission" ? isLoading : isAiTasksLoading;
    const tableDataLength = type === "submission" ? historyData.length : aiTaskHistoryData.length;

    return (
        <section className="w-full flex flex-col items-center gap-6 mt-10 mb-10">
            <div className="flex flex-col items-center justify-center w-[var(--global-width)] gap-[1.5rem] px-4">
                <h1 className="text-[2rem] md:text-[2.5rem] font-bold w-full text-[var(--color-primary)] text-center md:text-left">{title}</h1>
                <div className="flex items-center justify-center w-full">
                    {isTableLoading ? (
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
                            data={aiTaskHistoryData}
                            maxItems={4}
                            type={type}
                        />)}
                </div>
            </div>
            {tableDataLength > 4 ?
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

export { SubmissionHistorySection };