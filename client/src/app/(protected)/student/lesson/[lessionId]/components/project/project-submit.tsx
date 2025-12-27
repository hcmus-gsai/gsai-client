/* 'use client';

import React from 'react';

const LectureProjSubmit = () => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-lg font-semibold mb-2">Nộp bài</h3>
            <p className="text-gray-500">
                Khu vực nộp bài (upload file, deadline, trạng thái chấm điểm…)
            </p>
        </div>
    );
};

export default LectureProjSubmit; */


import React, { useState } from "react";

/* ===== Types ===== */
type SubmissionData = {
  due: string | null;
  submissionStatus: string;
  gradingStatus: string;
  timeRemaining: string;
  lastModified: string;
  submissionLink: string | null;
  submissionTime: string | null;
};

const LectureProjSubmit: React.FC = () => {
  
    /* ===== Helpers ===== */
  const nowString = () =>
    new Date().toLocaleString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ===== State ===== */
  const [submission, setSubmission] = useState<SubmissionData>({
    due: nowString(),
    submissionStatus: "No submission",
    gradingStatus: "Not graded",
    timeRemaining: "—",
    lastModified: "—",
    submissionLink: null,
    submissionTime: null,
  });

  const [repoLink, setRepoLink] = useState("");
  const [isEditing, setIsEditing] = useState(true);



  /* ===== Handlers ===== */
  const handleSubmit = () => {
    if (!repoLink.trim()) return;

    setSubmission({
      due: nowString(),
      submissionStatus: "Submitted for grading",
      gradingStatus: "Not graded",
      timeRemaining: "Assignment was submitted early",
      lastModified: nowString(),
      submissionLink: repoLink,
      submissionTime: nowString(),
    });

    setIsEditing(false);
  };

  const handleEdit = () => {
    setRepoLink(submission.submissionLink ?? "");
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
                <>
                  <a
                    href={submission.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {submission.submissionLink}
                  </a>
                  {" "}– {submission.submissionTime}
                </>
              ) : (
                <em>No submission</em>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ===== SUBMIT / EDIT SECTION ===== */}
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
              style={{
                width: "100%",
                padding: "8px 10px",
                marginBottom: 12,
              }}
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
  verticalAlign: "top",
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

