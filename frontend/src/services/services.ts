import type { FormConfig } from "../types/form.types";
import type { CreateFormPayload } from "../types/formBuilder.types";
import type { CreateSubmissionResponse, SaveStepPayload, Submission, SubmissionListItem } from "../types/services.types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_DEPLOYED || import.meta.env.VITE_BACKEND_URL_LOCAL;

export async function createFormConfig(payload: CreateFormPayload) {
  const response = await fetch(`${API_BASE_URL}form-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Failed to create form");
  }

  return response.json();
}

export async function getFormConfigs(): Promise<FormConfig[]> {
  const response = await fetch(`${API_BASE_URL}form-config`);

  if (!response.ok) {
    throw new Error("Failed to fetch form configs");
  }

  return response.json();
}

export async function getFormConfigById(formId: string): Promise<FormConfig> {
  const response = await fetch(`${API_BASE_URL}form-config/${formId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch form config");
  }

  return response.json();
}

export async function createSubmission(payload: {
  formConfigId: string;
  stepId: string;
  answers: Record<string, unknown>;
}): Promise<CreateSubmissionResponse> {
  const response = await fetch(`${API_BASE_URL}submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Failed to create submission");
  }

  return response.json();
}

export async function saveStep(
  submissionId: string,
  payload: SaveStepPayload
): Promise<unknown> {
  const response = await fetch(
    `${API_BASE_URL}submissions/${submissionId}/save`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
     throw new Error(`Failed to save step: ${response.status}`);
  }

  return response.json();
}

export async function completeSubmission(
  submissionId: string
): Promise<unknown> {
  const response = await fetch(
    `${API_BASE_URL}submissions/${submissionId}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to complete submission: ${response.status}`);
  }

  return response.json();
}

export const fetchSubmissions = async (): Promise<SubmissionListItem[]> => {
  const response = await fetch(`${API_BASE_URL}submissions/list`);
  if (!response.ok) {
   throw new Error(`Failed to fetch submissions: ${response.status}`);
  }
  return response.json();
};

export async function getSubmissionById(
  submissionId: string
): Promise<Submission> {
  const response = await fetch(`${API_BASE_URL}submissions/${submissionId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch submission");
  }

  return response.json();
}

export async function deleteSubmission(submissionId: string) {
  const response = await fetch(`${API_BASE_URL}submissions/${submissionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete submission");
  }

  return response.json();
}