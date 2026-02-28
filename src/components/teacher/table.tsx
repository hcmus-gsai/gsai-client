'use client';

import { useMemo } from "react";

type HistoryItem = {
    id: number;
    lessonName: string;
    studentName: string;
    submissionDate: string;
    score: number | null;
};

type AITaskItem = {
    id: number;
    lessonName: string;
    status: string;
    createdAt: string;
    endedAt: string | null;
};

type SubmissionTableProps = {
    columns: string[];
    data: HistoryItem[];
    maxItems?: number;
    type: "submission";
    className?: string;
};

type AITaskTableProps = {
    columns: string[];
    data: AITaskItem[];
    maxItems?: number;
    type: "ai_task";
    className?: string;
};

type TableProps = SubmissionTableProps | AITaskTableProps;

export const Table = (props: TableProps) => {
    const { columns, data, maxItems, type, className = "" } = props;

    const tableData = useMemo(() => {
        return maxItems ? data.slice(0, maxItems) : data;
    }, [data, maxItems]);

    if (!tableData.length) return null;

    return (
        <div className={`w-full rounded-[16px] overflow-hidden ${className}`}>
            <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1fr] bg-blue-600 text-white font-semibold px-6 py-4">
                {columns.map((col, index) => (
                    <div key={index} className="text-sm">
                        {col}
                    </div>
                ))}
                <div />
            </div>

            {tableData.map((item, index) => {
                if (type === "submission") {
                    const submissionItem = item as HistoryItem;

                    return (
                        <div
                            key={submissionItem.id}
                            className={`grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1fr] px-6 py-4 text-sm items-center
                            ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                        >
                            <div className="text-blue-600 hover:underline cursor-pointer">
                                {submissionItem.lessonName}
                            </div>
                            <div>{submissionItem.studentName}</div>
                            <div>{submissionItem.submissionDate}</div>
                            <div>{submissionItem.score ?? "--"}</div>
                            <div className="text-blue-600 text-right hover:underline cursor-pointer">
                                {submissionItem.score == null
                                    ? "Chấm bài"
                                    : submissionItem.score === 100
                                        ? "Xem chi tiết"
                                        : "Chấm lại"}
                            </div>
                        </div>
                    );
                }

                const aiItem = item as AITaskItem;

                return (
                    <div
                        key={aiItem.id}
                        className={`grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1fr] px-6 py-4 text-sm items-center
                        ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                    >
                        <div className="text-blue-600 hover:underline cursor-pointer">
                            {aiItem.lessonName}
                        </div>
                        <div>{aiItem.status}</div>
                        <div>{aiItem.createdAt}</div>
                        <div>{aiItem.endedAt ?? "--"}</div>
                        <div className="text-blue-600 text-right hover:underline cursor-pointer">
                            Chi tiết
                        </div>
                    </div>
                );
            })}
        </div>
    );
};