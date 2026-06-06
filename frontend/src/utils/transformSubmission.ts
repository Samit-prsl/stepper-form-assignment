import type { SubmissionData, WellnessSubmission } from "../types/table.types";

const transformSubmissionToRow = (
  submission: SubmissionData
): WellnessSubmission => {
  const answers = submission.answers ?? {};

  return {
    id: submission._id,
    submissionId: submission._id,

    full_name: answers.name ?? "-",
    age: Number(answers.age) || 0,
    gender: answers.gender ?? "",

    primary_goals: answers.primary_goal ? [answers.primary_goal] : [],

    support_type: answers.support_type ?? "",
    notes: answers.notes ?? "",

    preferred_time: answers.preferred_time ?? "",
    contact_method: answers.preferred_contact_method ?? "",

    additional_details: answers.additional_details ?? "",

    created_at: submission.createdAt,
    status: submission.status,
  };
};

export default transformSubmissionToRow
