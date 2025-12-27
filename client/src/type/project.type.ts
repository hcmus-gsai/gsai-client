export interface ProjectSubmissionResponse {
    due: string;
    submission_status: string;
    grading_status: string;
    last_modified: string;
    submission: string;
}

/* ===== ENUM TYPES ===== */

export type SubmissionStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "RESUBMITTED"; // nếu backend có

export type GradingStatus =
  | "NOT_GRADED"
  | "GRADED";

/* ===== ENTITY RESPONSE ===== */

export interface ProjectSubmission {
  id: string;
  lesson_id: string;
  user_id: string;

  submission_status: SubmissionStatus;
  grading_status: GradingStatus;

  github_url: string | null;
  submit_json: string | null;

  submitted_at: string | null; // ISO string
}

/* ===== API RESPONSE ===== */
/**
 * GET /lessons/:id/projects-submission
 * POST /lessons/:id/projects-submission
 * PUT  /lessons/:id/projects-submission
 */
export interface SubmissionMuatationResponse {
  data: ProjectSubmission;
}
