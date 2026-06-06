import { useState } from "react";
import { makeField, makeStep, slugify, type BuilderField, type BuilderStep, type CreateFormPayload, type FieldType } from "../types/formBuilder.types";

export function useBuilderState() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<BuilderStep[]>([makeStep()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addStep = () => setSteps((s) => [...s, makeStep()]);

  const removeStep = (key: string) =>
    setSteps((s) => s.filter((st) => st._key !== key));

  const updateStepTitle = (key: string, value: string) =>
    setSteps((s) =>
      s.map((st) =>
        st._key === key
          ? { ...st, title: value, id: slugify(value) || st.id }
          : st
      )
    );

  const addField = (stepKey: string) =>
    setSteps((s) =>
      s.map((st) =>
        st._key === stepKey
          ? { ...st, fields: [...st.fields, makeField()] }
          : st
      )
    );

  const removeField = (stepKey: string, fieldKey: string) =>
    setSteps((s) =>
      s.map((st) =>
        st._key === stepKey
          ? { ...st, fields: st.fields.filter((f) => f._key !== fieldKey) }
          : st
      )
    );

  const updateField = (
    stepKey: string,
    fieldKey: string,
    patch: Partial<BuilderField>
  ) =>
    setSteps((s) =>
      s.map((st) =>
        st._key === stepKey
          ? {
              ...st,
              fields: st.fields.map((f) =>
                f._key === fieldKey ? { ...f, ...patch } : f
              ),
            }
          : st
      )
    );

  const updateFieldLabel = (stepKey: string, fieldKey: string, label: string) =>
    updateField(stepKey, fieldKey, { label, id: slugify(label) });

  const updateFieldType = (
    stepKey: string,
    fieldKey: string,
    type: FieldType
  ) => {
    const needsOptions = type === "SELECT" || type === "RADIO";
    updateField(stepKey, fieldKey, {
      type,
      options: needsOptions ? [{ label: "", value: "" }] : [],
    });
  };

  const addOption = (stepKey: string, fieldKey: string) =>
    setSteps((s) =>
      s.map((st) =>
        st._key === stepKey
          ? {
              ...st,
              fields: st.fields.map((f) =>
                f._key === fieldKey
                  ? {
                      ...f,
                      options: [...(f.options || []), { label: "", value: "" }],
                    }
                  : f
              ),
            }
          : st
      )
    );

  const removeOption = (stepKey: string, fieldKey: string, optIdx: number) =>
    setSteps((s) =>
      s.map((st) =>
        st._key === stepKey
          ? {
              ...st,
              fields: st.fields.map((f) =>
                f._key === fieldKey
                  ? {
                      ...f,
                      options: (f.options || []).filter((_, i) => i !== optIdx),
                    }
                  : f
              ),
            }
          : st
      )
    );

  const updateOption = (
    stepKey: string,
    fieldKey: string,
    optIdx: number,
    key: "label" | "value",
    val: string
  ) =>
    setSteps((s) =>
      s.map((st) =>
        st._key === stepKey
          ? {
              ...st,
              fields: st.fields.map((f) =>
                f._key === fieldKey
                  ? {
                      ...f,
                      options: (f.options || []).map((opt, i) =>
                        i === optIdx ? { ...opt, [key]: val } : opt
                      ),
                    }
                  : f
              ),
            }
          : st
      )
    );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors["title"] = "Form title is required";
    steps.forEach((step) => {
      if (!step.title.trim())
        newErrors[`step_${step._key}_title`] = "Step title is required";
      step.fields.forEach((field) => {
        if (!field.label.trim())
          newErrors[`field_${field._key}_label`] = "Field label is required";
        if (
          (field.type === "SELECT" || field.type === "RADIO") &&
          !field.options?.length
        )
          newErrors[`field_${field._key}_options`] =
            "At least one option required";
        field.options?.forEach((opt, oi) => {
          if (!opt.label.trim())
            newErrors[`opt_${field._key}_${oi}_label`] =
              "Option label required";
        });
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setTitle("");
    setSteps([makeStep()]);
    setErrors({});
  };

  const buildPayload = (): CreateFormPayload => ({
    title: title.trim(),
    steps: steps.map((step) => ({
      id: step.id || slugify(step.title),
      title: step.title.trim(),
      fields: step.fields.map((f) => ({
        id: f.id || slugify(f.label),
        label: f.label.trim(),
        type: f.type,
        required: f.required,
        placeholder: f.placeholder || undefined,
        options: f.options?.length ? f.options : undefined,
        minLength: f.minLength || undefined,
        maxLength: f.maxLength || undefined,
      })),
    })),
  });

  return {
    title,
    setTitle,
    steps,
    errors,
    addStep,
    removeStep,
    updateStepTitle,
    addField,
    removeField,
    updateField,
    updateFieldLabel,
    updateFieldType,
    addOption,
    removeOption,
    updateOption,
    validate,
    reset,
    buildPayload,
  };
}
