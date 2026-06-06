export interface FormField {
  id: string;
  label: string;
  type: "TEXT" | "SELECT" | "RADIO" | "TEXTAREA";
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  options: Array<{ label: string; value: string }>;
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormConfig {
  _id: string;
  title: string;
  steps: FormStep[];
  createdAt: string;
  updatedAt: string;
}

export interface FormValues {
  [stepId: string]: {
    [fieldId: string]: string | string[];
  };
}

export interface FormErrors {
  [stepId: string]: {
    [fieldId: string]: string;
  };
}

export interface FormStore {
  formConfig: FormConfig | null;
  formValues: FormValues;
  formErrors: FormErrors;
  currentStep: number;
  completedSteps: boolean[];
  setFormConfig: (config: FormConfig) => void;
  setFieldValue: (
    stepId: string,
    fieldId: string,
    value: string | string[]
  ) => void;
  setFieldError: (stepId: string, fieldId: string, error: string) => void;
  clearFieldError: (stepId: string, fieldId: string) => void;
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  getStepValues: (stepId: string) => FormValues[string];
  getAllValues: () => FormValues;
}

export interface DynamicFormFieldProps {
  field: FormField;
  stepId: string;
  value: string | string[];
  error?: string;
}


export interface SubmissionData {
  _id: string;
  formConfigId: string;
  status: "DRAFT" | "COMPLETED";
  currentStep: number;
  completedSteps: string[];
  answers: {
    step_1?: Record<string, string>;
    step_2?: Record<string, string>;
    step_3?: Record<string, string>;
  };
}

export interface DynamicFormProps {
  open: boolean;
  onClose: () => void;
  formConfig: FormConfig | null;
  isLoading: boolean;
  editingSubmission?: SubmissionData | null;
}
