export interface FormConfigListItem {
  _id: string;
  title: string;
}

export interface CreateSubmissionResponse {
  formConfigId: string;
  status: string;
  currentStep: number;
  completedSteps: string[];
  progress: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SaveStepPayload {
  stepId: string;
  answers: Record<string, string | string[]>;
}

export interface SubmissionListItem {
  _id: string;
  title: string;
  status: "DRAFT" | "COMPLETED";
  progress: string;
}

export interface Submission {
  _id: string;
  formConfigId: string;
  status: "DRAFT" | "COMPLETED";
  answers: Record<string, unknown>;
  completedSteps: string[];
  progress: number;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
}
