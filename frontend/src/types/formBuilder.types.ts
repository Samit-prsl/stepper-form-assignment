import type { FormValues } from "./form.types";


export type FieldType = "TEXT" | "SELECT" | "RADIO" | "TEXTAREA";

export interface FormOptionPayload {
  label: string;
  value: string;
}

export interface FormFieldPayload {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;

  placeholder?: string;

  minLength?: number;
  maxLength?: number;

  options?: FormOptionPayload[];
}

export interface FormStepPayload {
  id: string;
  title: string;
  fields: FormFieldPayload[];
}

export interface CreateFormPayload {
  title: string;
  steps: FormStepPayload[];
}

export interface BuilderField extends FormFieldPayload {
  _key: string;
}

export interface BuilderStep {
  _key: string;
  id: string;
  title: string;
  fields: BuilderField[];
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Text Input",
  TEXTAREA: "Text Area",
  SELECT: "Dropdown",
  RADIO: "Radio Group",
};

export const FIELD_TYPES: FieldType[] = ["TEXT", "TEXTAREA", "SELECT", "RADIO"];

let keyCounter = 0;
export const nextKey = () => `k_${++keyCounter}`;

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const makeField = (): BuilderField => ({
  _key: nextKey(),
  id: "",
  label: "",
  type: "TEXT",
  required: false,
  placeholder: "",
  options: [],
  minLength: undefined,
  maxLength: undefined,
});

export const makeStep = (): BuilderStep => ({
  _key: nextKey(),
  id: `step_${Date.now()}`,
  title: "",
  fields: [makeField()],
});

export interface UseUnsavedChangesReturn {
  isDirty: boolean;
  markClean: (values: FormValues, stepId: string) => void;
  guardNavigation: (action: () => void) => void;
  warnDialog: { open: boolean; onConfirm: (() => void) | null };
  handleWarnStay: () => void;
  handleWarnLeave: () => void;
}