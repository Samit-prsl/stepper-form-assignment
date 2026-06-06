import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Typography,
  Button,
  Stack,
  TextField,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FormStepEditor from "./FormStepEditor";
import { useBuilderState } from "../hooks/useFormConfigBuilder";
import type { CreateFormPayload } from "../types/formBuilder.types";
import { createFormConfig } from "../services/services";
import { formattedDate } from "../utils/component.utils";

interface FormBuilderProps {
  open: boolean;
  onClose: () => void;
}

export default function FormBuilder({ open, onClose }: FormBuilderProps) {
  const queryClient = useQueryClient();
  const state = useBuilderState();
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateFormPayload) => createFormConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formConfigs"] });
      setToast({
        open: true,
        message: "Form created successfully!",
        severity: "success",
      });
      state.reset();
      onClose();
    },
    onError: () => {
      setToast({
        open: true,
        message: "Failed to create form. Please try again.",
        severity: "error",
      });
    },
  });

  const handleClose = async() => {
    state.reset();
    await queryClient.invalidateQueries({
      queryKey: ["formConfigs"],
    });
    onClose();
  };

  const handleSubmit = () => {
    if (state.validate()) mutation.mutate(state.buildPayload());
  };


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { maxHeight: "90vh" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            pb: 1,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              {formattedDate}
            </Typography>
            <Typography variant="body2" sx={{ color: "#999", mt: 0.5 }}>
              Create New Form
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ p: 0 }}>
            <CloseIcon sx={{ color: "#999" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 3, mt: 3 }}>
          <Box sx={{ mb: 4 }}>
            <TextField
              label="Form Title"
              placeholder="e.g. Health Assessment Form"
              value={state.title}
              onChange={(e) => state.setTitle(e.target.value)}
              error={!!state.errors["title"]}
              helperText={state.errors["title"]}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "6px" },
              }}
            />
          </Box>

          <Stack spacing={3}>
            {state.steps.map((step, stepIdx) => (
              <FormStepEditor
                key={step._key}
                step={step}
                stepIndex={stepIdx}
                canRemove={state.steps.length > 1}
                errors={state.errors}
                onUpdateTitle={state.updateStepTitle}
                onRemoveStep={state.removeStep}
                onAddField={state.addField}
                onUpdateField={state.updateField}
                onUpdateFieldLabel={state.updateFieldLabel}
                onUpdateFieldType={state.updateFieldType}
                onRemoveField={state.removeField}
                onAddOption={state.addOption}
                onRemoveOption={state.removeOption}
                onUpdateOption={state.updateOption}
              />
            ))}
          </Stack>

          <Button
            startIcon={<AddIcon />}
            onClick={state.addStep}
            variant="outlined"
            sx={{
              mt: 3,
              borderColor: "#ccc",
              color: "#555",
              textTransform: "none",
              borderRadius: "6px",
              borderStyle: "dashed",
              width: "100%",
              py: 1,
              "&:hover": {
                borderColor: "#2a8b8b",
                color: "#2a8b8b",
                backgroundColor: "#e0f2f1",
              },
            }}
          >
            Add Step
          </Button>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderColor: "#ccc",
                color: "#333",
                borderRadius: "6px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#f0f0f0", borderColor: "#333" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={mutation.isPending}
              sx={{
                backgroundColor: "#2a8b8b",
                borderRadius: "6px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#1f6b6b" },
              }}
            >
              {mutation.isPending ? "Creating..." : "Create Form"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((p) => ({ ...p, open: false }))}
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


