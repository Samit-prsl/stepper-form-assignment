import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Button,
  Stack,
  Snackbar,
  Alert,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DynamicFormField from "./DynamicFormField";
import {
  useCompleteSubmission,
  useCreateSubmission,
  useSaveStep,
} from "../hooks/useMutation";
import { useFormStore } from "../store/form.store";
import type {
  DynamicFormProps,
  FormConfig,
  FormValues,
} from "../types/form.types";
import { formattedDate } from "../utils/component.utils";

interface UnsavedWarningDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

function UnsavedWarningDialog({
  open,
  onStay,
  onLeave,
}: UnsavedWarningDialogProps) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningAmberIcon sx={{ color: "#f59e0b" }} />
        Unsaved Changes
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have unsaved changes on this step. If you leave now, your changes
          will be lost. Do you want to continue?
        </DialogContentText>
      </DialogContent>
      {/* Change 7: stack warning dialog actions on mobile */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          onClick={onStay}
          sx={{
            borderColor: "#ccc",
            color: "#333",
            textTransform: "none",
            borderRadius: "6px",
            width: { xs: "100%", sm: "auto" },
            "&:hover": { backgroundColor: "#f0f0f0", borderColor: "#333" },
          }}
        >
          Stay on this step
        </Button>
        <Button
          variant="contained"
          onClick={onLeave}
          sx={{
            backgroundColor: "#ef4444",
            textTransform: "none",
            borderRadius: "6px",
            width: { xs: "100%", sm: "auto" },
            "&:hover": { backgroundColor: "#dc2626" },
          }}
        >
          Leave anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function UnsavedBadge() {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: "20px",
        backgroundColor: "#fff7ed",
        border: "1px solid #fed7aa",
        alignSelf: "center",
      }}
    >
      <WarningAmberIcon sx={{ fontSize: 14, color: "#f59e0b" }} />
      <Typography
        sx={{ fontSize: "0.75rem", color: "#92400e", fontWeight: 500 }}
      >
        Unsaved changes
      </Typography>
    </Stack>
  );
}

export default function DynamicForm({
  open,
  onClose,
  formConfig,
  isLoading,
  editingSubmission,
}: DynamicFormProps) {
  const [localErrors, setLocalErrors] = useState<{
    [stepId: string]: { [fieldId: string]: string };
  }>({});
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const createMutation = useCreateSubmission();
  const saveMutation = useSaveStep();
  const completeMutation = useCompleteSubmission();

  const isSubmitting =
    createMutation.isPending ||
    saveMutation.isPending ||
    completeMutation.isPending;

  const formStore = useFormStore();
  const {
    currentStep,
    completedSteps,
    formValues,
    submissionId,
    setCurrentStep,
    markStepCompleted,
    setSubmissionId,
    resetForm,
  } = formStore;

  const [isDirty, setIsDirty] = useState(false);
  const [warnDialog, setWarnDialog] = useState<{
    open: boolean;
    onConfirm: (() => void) | null;
  }>({ open: false, onConfirm: null });
  const savedSnapshotRef = useRef<Record<string, string>>({});

  const checkDirty = (values: typeof formValues, stepId: string) => {
    const currentStr = JSON.stringify(values[stepId] ?? {});
    return currentStr !== (savedSnapshotRef.current[stepId] ?? "");
  };

  useEffect(() => {
    if (!formConfig) return;
    const stepId = formConfig.steps[currentStep]?.id;
    if (!stepId) return;
    setIsDirty(checkDirty(formValues, stepId));
  }, [formValues, currentStep, formConfig]);

  const markClean = () => {
    if (!formConfig) return;
    const stepId = formConfig.steps[currentStep]?.id;
    if (!stepId) return;
    savedSnapshotRef.current[stepId] = JSON.stringify(formValues[stepId] ?? {});
    setIsDirty(false);
  };

  const guardNavigation = (action: () => void) => {
    if (isDirty) {
      setWarnDialog({ open: true, onConfirm: action });
    } else {
      action();
    }
  };

  const handleWarnStay = () => setWarnDialog({ open: false, onConfirm: null });

  const handleWarnLeave = () => {
    const cb = warnDialog.onConfirm;
    setWarnDialog({ open: false, onConfirm: null });
    setIsDirty(false);
    cb?.();
  };

  const mapSubmissionToFormValues = (
    formConfig: FormConfig,
    answers: Record<string, any>
  ) => {
    const values: FormValues = {};
    formConfig.steps.forEach((step) => {
      values[step.id] = {};
      step.fields.forEach((field) => {
        values[step.id][field.id] = answers?.[field.id] ?? "";
      });
    });
    return values;
  };

  useEffect(() => {
    if (formConfig) {
      const newFormValues: FormValues = {};
      const completedStepsArray = new Array(formConfig.steps.length).fill(
        false
      );

      formConfig.steps.forEach((step) => {
        newFormValues[step.id] = {};
        step.fields.forEach((field) => {
          newFormValues[step.id][field.id] = "";
        });
      });

      if (editingSubmission?.answers) {
        const mappedValues = mapSubmissionToFormValues(
          formConfig,
          editingSubmission.answers
        );
        Object.assign(newFormValues, mappedValues);

        editingSubmission.completedSteps.forEach((stepId) => {
          const stepIndex = formConfig.steps.findIndex(
            (step) => step.id === stepId
          );
          if (stepIndex >= 0) completedStepsArray[stepIndex] = true;
        });

        setSubmissionId(editingSubmission._id);
        setCurrentStep(editingSubmission.currentStep ?? 0);
      }

      useFormStore.setState({
        formConfig,
        formValues: newFormValues,
        completedSteps: completedStepsArray,
      });

      formConfig.steps.forEach((step) => {
        savedSnapshotRef.current[step.id] = JSON.stringify(
          newFormValues[step.id] ?? {}
        );
      });
      setIsDirty(false);
    }
  }, [formConfig, editingSubmission]);

  const validateStep = (stepIndex: number): boolean => {
    if (!formConfig) return false;
    const step = formConfig.steps[stepIndex];
    const stepValues = formValues[step.id] || {};
    const errors: { [fieldId: string]: string } = {};
    let isValid = true;

    step.fields.forEach((field) => {
      const value = stepValues[field.id];
      if (
        field.required &&
        (!value || (Array.isArray(value) && value.length === 0))
      ) {
        errors[field.id] = `${field.label} is required`;
        isValid = false;
      }
      if (value && field.minLength && String(value).length < field.minLength) {
        errors[field.id] = `Minimum ${field.minLength} characters required`;
        isValid = false;
      }
      if (value && field.maxLength && String(value).length > field.maxLength) {
        errors[field.id] = `Maximum ${field.maxLength} characters allowed`;
        isValid = false;
      }
      if (field.id === "name" && value && !/^[a-zA-Z]/.test(String(value))) {
        errors[field.id] = "Name must start with a letter";
        isValid = false;
      }
      if (
        field.id === "age" &&
        value &&
        (isNaN(Number(value)) || Number(value) <= 0 || Number(value) > 150)
      ) {
        errors[field.id] = "Please enter a valid age";
        isValid = false;
      }
    });

    setLocalErrors((prev) => ({ ...prev, [step.id]: errors }));
    return isValid;
  };

  const ensureSubmission = async (): Promise<string | null> => {
    if (submissionId) return submissionId;
    const step = formConfig!.steps[currentStep];
    const stepValues = formValues[step.id] || {};
    try {
      const response = await createMutation.mutateAsync({
        formConfigId: formConfig!._id,
        stepId: step.id,
        answers: stepValues,
      });
      setSubmissionId(response._id);
      return response._id;
    } catch {
      setToast({
        open: true,
        message:
          "Failed to create submission, check if all required fields are filled.",
        severity: "error",
      });
      return null;
    }
  };

  const saveCurrentStep = async (subId: string) => {
    const step = formConfig!.steps[currentStep];
    const stepValues = formValues[step.id] || {};
    await saveMutation.mutateAsync({
      submissionId: subId,
      payload: {
        stepId: step.id,
        answers: stepValues as Record<string, string>,
      },
    });
  };

  const handleSave = async () => {
    if (!formConfig) return;
    try {
      if (!submissionId) {
        const subId = await ensureSubmission();
        if (!subId) return;
      } else {
        await saveCurrentStep(submissionId);
      }
      markClean();
      setToast({
        open: true,
        message: "Draft saved successfully",
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "Failed to save, check if required fields are filled.",
        severity: "error",
      });
    }
  };

  const handleSaveAndNext = async () => {
    if (!formConfig) return;
    if (!validateStep(currentStep)) return;
    try {
      let subId = submissionId;
      if (!subId) {
        subId = await ensureSubmission();
        if (!subId) return;
      } else {
        await saveCurrentStep(subId);
      }
      markClean();
      markStepCompleted(currentStep);
      if (currentStep < formConfig.steps.length - 1)
        setCurrentStep(currentStep + 1);
      setToast({
        open: true,
        message: `${currentStepData.title} saved successfully`,
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "Failed to save step. Please try again.",
        severity: "error",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formConfig) return;
    if (!validateStep(currentStep)) return;
    try {
      let subId = submissionId;
      if (!subId) {
        subId = await ensureSubmission();
        if (!subId) return;
      } else {
        await saveCurrentStep(subId);
      }
      await completeMutation.mutateAsync(subId);
      markStepCompleted(currentStep);
      markClean();
      resetForm();
      setToast({
        open: true,
        message: "Form submitted successfully!",
        severity: "success",
      });
      onClose();
    } catch {
      setToast({
        open: true,
        message: "Failed to submit form. Please try again.",
        severity: "error",
      });
    }
  };

  const handleBackStep = () => {
    guardNavigation(() => {
      if (currentStep > 0) setCurrentStep(currentStep - 1);
    });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue <= currentStep || completedSteps[newValue]) {
      guardNavigation(() => setCurrentStep(newValue));
    }
  };

  const handleClose = () => {
    guardNavigation(() => {
      resetForm();
      onClose();
    });
  };

  if (!formConfig || isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography>Loading form...</Typography>
        </DialogTitle>
      </Dialog>
    );
  }

  const currentStepData = formConfig?.steps[currentStep];
  const stepValues = formValues[currentStepData.id] || {};
  const stepErrors = localErrors[currentStepData.id] || {};
  const isLastStep = currentStep === formConfig.steps.length - 1;
  const hasBackButton = currentStep > 0;

  return (
    <>
      <UnsavedWarningDialog
        open={warnDialog.open}
        onStay={handleWarnStay}
        onLeave={handleWarnLeave}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              margin: { xs: 1, sm: 4 },
              width: { xs: "100%", sm: "700px", md: "860px", lg: "1000px" },
              maxWidth: "none",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            pb: 1,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              {formattedDate}
            </Typography>
            <Typography variant="body2" sx={{ color: "#999", mt: 0.5 }}>
              {formConfig.title}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ p: 0 }}>
            <CloseIcon sx={{ color: "#999" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 3,
            minHeight: { xs: "auto", sm: "600px", lg: "650px" },
            px: { xs: 2, sm: 3, lg: 5 },
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={currentStep}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                mb: 3,
                "& .MuiTabs-flexContainer": { borderBottom: "none" },
              }}
            >
              {formConfig.steps.map((step, index) => (
                <Tab
                  key={step.id}
                  label={step.title}
                  sx={{
                    color: "#ccc",
                    fontWeight: 500,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    pb: 1.5,
                    pt: 0,
                    px: { xs: 1.5, sm: 3 },
                    "&.Mui-selected": { color: "#1a1a1a" },
                    position: "relative",
                    "&:after": completedSteps[index]
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          backgroundColor: "#4caf50",
                        }
                      : {},
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Stack spacing={3}>
            {currentStepData.fields.map((field) => (
              <DynamicFormField
                key={field.id}
                field={field}
                stepId={currentStepData.id}
                value={stepValues[field.id] || ""}
                error={stepErrors[field.id]}
              />
            ))}

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              sx={{
                mt: 3,
                justifyContent: {
                  sm: hasBackButton ? "space-between" : "flex-end",
                },
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              {hasBackButton && (
                <Button
                  variant="outlined"
                  onClick={handleBackStep}
                  sx={{
                    borderColor: "#ccc",
                    color: "#333",
                    borderRadius: "6px",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                      borderColor: "#333",
                    },
                  }}
                >
                  Back
                </Button>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
              >
                {isDirty && <UnsavedBadge />}

                {!isLastStep && (
                  <>
                    <Button
                      variant="outlined"
                      disabled={isSubmitting}
                      onClick={handleSave}
                      sx={{
                        borderColor: "#ccc",
                        color: "#2a8b8b",
                        borderRadius: "6px",
                        textTransform: "none",
                        fontSize: "0.95rem",
                        width: { xs: "100%", sm: "auto" },
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                          borderColor: "#2a8b8b",
                        },
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      disabled={isSubmitting}
                      onClick={handleSaveAndNext}
                      sx={{
                        backgroundColor: "#2a8b8b",
                        borderRadius: "6px",
                        textTransform: "none",
                        fontSize: "0.95rem",
                        width: { xs: "100%", sm: "auto" },
                        "&:hover": { backgroundColor: "#1f6b6b" },
                      }}
                    >
                      Save and Next
                    </Button>
                  </>
                )}

                {isLastStep && (
                  <Button
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    sx={{
                      backgroundColor: "#2a8b8b",
                      borderRadius: "6px",
                      textTransform: "none",
                      fontSize: "0.95rem",
                      width: { xs: "100%", sm: "auto" },
                      "&:hover": { backgroundColor: "#1f6b6b" },
                    }}
                  >
                    Submit
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
