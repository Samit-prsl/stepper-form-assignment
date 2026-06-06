export interface SubmissionAnswers {
  name?: string;
  age?: string;
  gender?: string;

  primary_goal?: string;
  support_type?: string;
  notes?: string;

  preferred_time?: string;
  preferred_contact_method?: string;
  additional_details?: string;
}

export interface SubmissionData {
  _id: string;
  formConfigId: string;

  status: "DRAFT" | "SUBMITTED";

  currentStep: number;

  completedSteps: string[];

  answers?: SubmissionAnswers;

  createdAt: string;
  updatedAt: string;
}

export interface WellnessSubmission {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  primary_goals: string[];
  support_type: string;
  notes: string;
  preferred_time: string;
  contact_method: string;
  additional_details: string;
  created_at: string;
  status: "DRAFT" | "SUBMITTED";
  submissionId: string;
}

export interface CustomTableRef {
  refetch: () => void;
}

export interface CustomTableProps {
  onEditSubmission?: (submission: SubmissionData) => void;
}

export interface FormStore {
  submissionId: string | null;

  setSubmissionId: (id: string) => void;

  clearSubmissionId: () => void;
}