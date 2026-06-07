import {
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  Chip,
  Paper,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import FormFieldEditor from "./FormFieldEditor";
import type {
  BuilderField,
  BuilderStep,
  FieldType,
} from "../types/formBuilder.types";

interface FormStepEditorProps {
  step: BuilderStep;
  stepIndex: number;
  canRemove: boolean;
  errors: Record<string, string>;
  onUpdateTitle: (stepKey: string, value: string) => void;
  onRemoveStep: (stepKey: string) => void;
  onAddField: (stepKey: string) => void;
  onUpdateField: (
    stepKey: string,
    fieldKey: string,
    patch: Partial<BuilderField>
  ) => void;
  onUpdateFieldLabel: (
    stepKey: string,
    fieldKey: string,
    label: string
  ) => void;
  onUpdateFieldType: (
    stepKey: string,
    fieldKey: string,
    type: FieldType
  ) => void;
  onRemoveField: (stepKey: string, fieldKey: string) => void;
  onAddOption: (stepKey: string, fieldKey: string) => void;
  onRemoveOption: (stepKey: string, fieldKey: string, optIdx: number) => void;
  onUpdateOption: (
    stepKey: string,
    fieldKey: string,
    optIdx: number,
    key: "label" | "value",
    val: string
  ) => void;
}

export default function FormStepEditor({
  step,
  stepIndex,
  canRemove,
  errors,
  onUpdateTitle,
  onRemoveStep,
  onAddField,
  onUpdateField,
  onUpdateFieldLabel,
  onUpdateFieldType,
  onRemoveField,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
}: FormStepEditorProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: "8px", borderColor: "#e8e8e8", overflow: "hidden" }}
    >
      <Box
        sx={{
          px: { xs: 1.5, sm: 2.5 },
          py: 1.5,
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <DragIndicatorIcon sx={{ color: "#ccc", fontSize: "1.2rem" }} />
        <Chip
          label={`Step ${stepIndex + 1}`}
          size="small"
          sx={{
            backgroundColor: "#e0f2f1",
            color: "#2a8b8b",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
        <TextField
          placeholder="Step title (e.g. Personal Information)"
          value={step.title}
          onChange={(e) => onUpdateTitle(step._key, e.target.value)}
          error={!!errors[`step_${step._key}_title`]}
          helperText={errors[`step_${step._key}_title`]}
          size="small"
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: 0 },
            order: { xs: 3, sm: 0 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
              backgroundColor: "#fff",
            },
          }}
        />
        {canRemove && (
          <Tooltip title="Remove step">
            <IconButton
              size="small"
              onClick={() => onRemoveStep(step._key)}
              sx={{ color: "#ccc", "&:hover": { color: "#e57373" } }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ px: { xs: 1.5, sm: 2.5 }, py: 2 }}>
        <Stack spacing={2}>
          {step.fields.map((field) => (
            <FormFieldEditor
              key={field._key}
              stepKey={step._key}
              field={field}
              canRemove={step.fields.length > 1}
              errors={errors}
              onUpdate={onUpdateField}
              onUpdateLabel={onUpdateFieldLabel}
              onUpdateType={onUpdateFieldType}
              onRemove={onRemoveField}
              onAddOption={onAddOption}
              onRemoveOption={onRemoveOption}
              onUpdateOption={onUpdateOption}
            />
          ))}
        </Stack>

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => onAddField(step._key)}
          variant="outlined"
          sx={{
            mt: 2,
            color: "#2a8b8b",
            borderColor: "#2a8b8b",
            textTransform: "none",
            borderRadius: "6px",
            fontSize: "0.85rem",
            "&:hover": { backgroundColor: "#e0f2f1", borderColor: "#2a8b8b" },
          }}
        >
          Add Field
        </Button>
      </Box>
    </Paper>
  );
}
