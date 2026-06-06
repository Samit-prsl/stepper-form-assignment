import { create } from "zustand";

export interface FormField {
  id: string;
  label: string;
  type: "TEXT" | "SELECT" | "RADIO" | "TEXTAREA";
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  options: Array<{
    label: string;
    value: string;
  }>;
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

interface FormStore {
  formConfig: FormConfig | null;
  submissionId: string | null;

  formValues: FormValues;
  formErrors: FormErrors;

  currentStep: number;
  completedSteps: boolean[];

  setFormConfig: (config: FormConfig) => void;

  setSubmissionId: (id: string) => void;
  clearSubmissionId: () => void;

  setFormValues: (values: FormValues) => void;
  setCompletedSteps: (steps: boolean[]) => void;

  setFieldValue: (
    stepId: string,
    fieldId: string,
    value: string | string[]
  ) => void;

  setFieldError: (stepId: string, fieldId: string, error: string) => void;

  clearFieldError: (stepId: string, fieldId: string) => void;

  setCurrentStep: (step: number) => void;

  markStepCompleted: (step: number) => void;

  resetForm: () => void;

  getStepValues: (stepId: string) => FormValues[string];

  getAllValues: () => FormValues;
}

export const useFormStore = create<FormStore>((set, get) => ({
  formConfig: null,
  submissionId: null,

  formValues: {},
  formErrors: {},

  currentStep: 0,
  completedSteps: [],

  setFormConfig: (config) =>
    set(() => {
      const formValues: FormValues = {};

      config.steps.forEach((step) => {
        formValues[step.id] = {};

        step.fields.forEach((field) => {
          formValues[step.id][field.id] = "";
        });
      });

      return {
        formConfig: config,
        formValues,
        completedSteps: new Array(config.steps.length).fill(false),
      };
    }),

  setSubmissionId: (id) =>
    set({
      submissionId: id,
    }),

  clearSubmissionId: () =>
    set({
      submissionId: null,
    }),

  setFormValues: (values) =>
    set({
      formValues: values,
    }),

  setCompletedSteps: (steps) =>
    set({
      completedSteps: steps,
    }),

  setFieldValue: (stepId, fieldId, value) =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        [stepId]: {
          ...state.formValues[stepId],
          [fieldId]: value,
        },
      },
    })),

  setFieldError: (stepId, fieldId, error) =>
    set((state) => ({
      formErrors: {
        ...state.formErrors,
        [stepId]: {
          ...state.formErrors[stepId],
          [fieldId]: error,
        },
      },
    })),

  clearFieldError: (stepId, fieldId) =>
    set((state) => ({
      formErrors: {
        ...state.formErrors,
        [stepId]: {
          ...state.formErrors[stepId],
          [fieldId]: "",
        },
      },
    })),

  setCurrentStep: (step) =>
    set({
      currentStep: step,
    }),

  markStepCompleted: (step) =>
    set((state) => {
      const completed = [...state.completedSteps];

      completed[step] = true;

      return {
        completedSteps: completed,
      };
    }),

  resetForm: () =>
    set((state) => ({
      formValues: {},
      formErrors: {},
      currentStep: 0,
      completedSteps: [],
      submissionId: null,
      formConfig: state.formConfig,
    })),

  getStepValues: (stepId) => {
    const state = get();

    return state.formValues[stepId] || {};
  },

  getAllValues: () => {
    return get().formValues;
  },
}));
