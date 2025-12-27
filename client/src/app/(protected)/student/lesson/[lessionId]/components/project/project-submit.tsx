'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLazyGetSubmissionQuery } from "@/store/api/[module]/projectApi";

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

const LectureProjSubmit: React.FC = () => {
  const { lessionId } = useParams();

  /* ===== API ===== */
  const [getSubmission, { data, isLoading, isError }] =
    useLazyGetSubmissionQuery();

  useEffect(() => {
    if (lessionId) {
      getSubmission(lessionId as string);
    }
  }, [lessionId, getSubmission]);

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
      timeRemaining: "—", // backend chưa trả
      lastModified: formatDate(data.last_modified),
      submissionLink: data.submission || null,
      submissionTime: formatDate(data.last_modified),
    });

    setRepoLink(data.submission || "");
    setIsEditing(!data.submission);
  }, [data]);

  /* ===== Handlers (placeholder) ===== */
  const handleSubmit = () => {
    if (!repoLink.trim()) return;

    const now = formatDate(new Date());

    setSubmission((prev) => ({
      ...prev,
      submissionStatus: "Submitted for grading",
      gradingStatus: "Not graded",
      lastModified: now,
      submissionLink: repoLink,
      submissionTime: now,
    }));

    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
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

            <button onClick={handleSubmit} style={buttonPrimary}>
              Save submission
            </button>
          </>
        ) : (
          <button onClick={handleEdit} style={buttonSecondary}>
            Edit submission
          </button>
        )}

        {isLoading && (
          <p style={{ marginTop: 8 }}>Loading submission…</p>
        )}
        {isError && (
          <p style={{ marginTop: 8, color: "red" }}>
            Failed to load submission
          </p>
        )}
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
