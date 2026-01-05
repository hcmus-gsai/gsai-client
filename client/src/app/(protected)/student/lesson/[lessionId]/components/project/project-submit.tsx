'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  useLazyGetSubmissionQuery,
  useSubmitProjectMutation,
  useUpdateSubmissionMutation
 } from "@/store/api/[module]/projectApi";

/* ===== Types ===== */
type SubmissionData = {
  due: string;
  submissionStatus: string;
  gradingStatus: string;
  timeRemaining: string;
  lastModified: string;
  submissionLink: string | null;
  submissionTime: string | null;
};

/* ===== Date formatter ===== */
const formatDate = (dateInput?: string | number | Date | null): string => {
  if (!dateInput) return "—";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

type TimeParts = {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const diffToParts = (diffMs: number): TimeParts => {
  const abs = Math.abs(diffMs);

  const seconds = Math.floor(abs / 1000) % 60;
  const minutes = Math.floor(abs / (1000 * 60)) % 60;
  const hours = Math.floor(abs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(abs / (1000 * 60 * 60 * 24)) % 365;
  const years = Math.floor(abs / (1000 * 60 * 60 * 24 * 365));

  return { years, days, hours, minutes, seconds };
};

const formatParts = (parts: TimeParts): string => {
  const units: [number, string][] = [
    [parts.years, "year"],
    [parts.days, "day"],
    [parts.hours, "hour"],
    [parts.minutes, "min"],
    [parts.seconds, "sec"],
  ];

  const nonZero = units.filter(([v]) => v > 0).slice(0, 2);

  if (nonZero.length === 0) return "0 secs";

  return nonZero
    .map(([v, label]) => `${v} ${label}${v > 1 ? "s" : ""}`)
    .join(" ");
};

const calculateTimeRemaining = (
  due: string | null,
  submittedAt: string | null
): string => {
  if (!due) return "—";

  const dueDate = new Date(due);
  const now = new Date();
  const submittedDate = submittedAt ? new Date(submittedAt) : null;

  // ===== CHƯA NỘP =====
  if (!submittedDate) {
    const diff = dueDate.getTime() - now.getTime();
    const parts = diffToParts(diff);

    // 1️⃣ Chưa nộp & còn hạn
    if (diff > 0) {
      return `${formatParts(parts)} remaining`;
    }

    // 2️⃣ Chưa nộp & quá hạn
    return `Assignment is overdue by: ${formatParts(parts)}`;
  }

  // ===== ĐÃ NỘP =====
  const diff = dueDate.getTime() - submittedDate.getTime();
  const parts = diffToParts(diff);

  // 3️⃣ Nộp trước hạn
  if (diff > 0) {
    return `Assignment was submitted ${formatParts(parts)} early`;
  }

  // 4️⃣ Nộp sau hạn
  return `Assignment was submitted ${formatParts(parts)} late`;
};



const LectureProjSubmit: React.FC = () => {
  const { lessonId } = useParams();

  /* ===== API ===== */
  const [getSubmission, { data, isLoading, isError }] =
    useLazyGetSubmissionQuery();

  const [submitProject, { isLoading: isSubmitting }] =
    useSubmitProjectMutation();

  const [updateProject, { isLoading: isUpdating }] =
    useUpdateSubmissionMutation();


  useEffect(() => {
    if (lessonId) {
      getSubmission(lessonId as string);
    }
  }, [lessonId, getSubmission]);

  /* ===== State ===== */
  const [submission, setSubmission] = useState<SubmissionData>({
    due: "—",
    submissionStatus: "No submission",
    gradingStatus: "Not graded",
    timeRemaining: "—",
    lastModified: "—",
    submissionLink: null,
    submissionTime: null,
  });

  const [repoLink, setRepoLink] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  /* ===== Sync API → UI ===== */
  useEffect(() => {
    if (!data) return;

    setSubmission({
      due: formatDate(data.due),
      submissionStatus: data.submission_status ?? "No submission",
      gradingStatus: data.grading_status ?? "Not graded",
      timeRemaining: calculateTimeRemaining(
        data.due,
        data.last_modified ?? null
      ),
      lastModified: formatDate(data.last_modified),
      submissionLink: data.submission || null,
      submissionTime: formatDate(data.last_modified),
    });

    setRepoLink(data.submission || "");
    setIsEditing(!data.submission);
  }, [data]);

  /* ===== Handlers (placeholder) ===== */
  const handleSave = async () => {
    if (!repoLink.trim() || !lessonId) return;

    try {
      if (submission.submissionLink) {
        // UPDATE
        await updateProject({
          lessonId: lessonId as string,
          github_url: repoLink,
        }).unwrap();
      } else {
        // SUBMIT
        await submitProject({
          lessonId: lessonId as string,
          github_url: repoLink,
        }).unwrap();
      }

      setIsEditing(false);
      getSubmission(lessonId as string);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {/* ===== STATUS TABLE ===== */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <tbody>
          <tr>
            <td style={labelStyle}>Due</td>
            <td style={valueStyle}>{submission.due}</td>
          </tr>

          <tr>
            <td style={labelStyle}>Submission status</td>
            <td style={valueStyle}>{submission.submissionStatus}</td>
          </tr>

          <tr>
            <td style={labelStyle}>Grading status</td>
            <td style={valueStyle}>{submission.gradingStatus}</td>
          </tr>

          <tr>
            <td style={labelStyle}>Time remaining</td>
            <td style={valueStyle}>{submission.timeRemaining}</td>
          </tr>

          <tr>
            <td style={labelStyle}>Last modified</td>
            <td style={valueStyle}>{submission.lastModified}</td>
          </tr>

          <tr>
            <td style={labelStyle}>Submission</td>
            <td style={valueStyle}>
              {submission.submissionLink ? (
                <a
                  href={submission.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {submission.submissionLink}
                </a>
              ) : (
                <em>No submission</em>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ===== SUBMIT / EDIT ===== */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 6,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>
          {submission.submissionLink ? "Edit submission" : "Add submission"}
        </h3>
        {isEditing ? (
          <>
            <input
              type="text"
              placeholder="https://github.com/username/project-repo"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", marginBottom: 12 }}
            />

            <button
              onClick={handleSave}
              style={buttonPrimary}
              disabled={isSubmitting || isUpdating}
            >
              {isSubmitting || isUpdating ? "Saving..." : "Save submission"}
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} style={buttonSecondary}>
            Edit submission
          </button>
        )}

        {isLoading && <p>Loading submission…</p>}
        {isError && <p style={{ color: "red" }}>Failed to load submission</p>}
      </div>
    </div>
  );
};
/* ===== Styles ===== */
const labelStyle: React.CSSProperties = {
  width: "30%",
  padding: "10px 12px",
  backgroundColor: "#f5f5f5",
  fontWeight: 500,
  border: "1px solid #ddd",
};

const valueStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #ddd",
};

const buttonPrimary: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const buttonSecondary: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#e5e7eb",
  border: "1px solid #ccc",
  borderRadius: 4,
  cursor: "pointer",
};

export default LectureProjSubmit;
