import {
  Box,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Button,
  IconButton,
  type SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  FIELD_TYPE_LABELS,
  FIELD_TYPES,
  slugify,
  type BuilderField,
  type FieldType,
} from "../types/formBuilder.types";

interface FormFieldEditorProps {
  stepKey: string;
  field: BuilderField;
  canRemove: boolean;
  errors: Record<string, string>;
  onUpdate: (
    stepKey: string,
    fieldKey: string,
    patch: Partial<BuilderField>
  ) => void;
  onUpdateLabel: (stepKey: string, fieldKey: string, label: string) => void;
  onUpdateType: (stepKey: string, fieldKey: string, type: FieldType) => void;
  onRemove: (stepKey: string, fieldKey: string) => void;
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

export default function FormFieldEditor({
  stepKey,
  field,
  canRemove,
  errors,
  onUpdate,
  onUpdateLabel,
  onUpdateType,
  onRemove,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
}: FormFieldEditorProps) {
  const hasOptions = field.type === "SELECT" || field.type === "RADIO";
  const hasPlaceholder = field.type === "TEXT" || field.type === "TEXTAREA";

  return (
    <Box
      sx={{
        border: "1px solid #f0f0f0",
        borderRadius: "6px",
        p: { xs: 1.5, sm: 2 },
        backgroundColor: "#fff",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ alignItems: "flex-start" }}
      >
        <TextField
          label="Field Label"
          placeholder="e.g. Full Name"
          value={field.label}
          onChange={(e) => onUpdateLabel(stepKey, field._key, e.target.value)}
          error={!!errors[`field_${field._key}_label`]}
          helperText={errors[`field_${field._key}_label`]}
          size="small"
          sx={{
            flex: 2,
            width: { xs: "100%", sm: "auto" },
            "& .MuiOutlinedInput-root": { borderRadius: "6px" },
          }}
        />
        <FormControl
          size="small"
          sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}
        >
          <InputLabel>Type</InputLabel>
          <Select
            value={field.type}
            label="Type"
            onChange={(e: SelectChangeEvent) =>
              onUpdateType(stepKey, field._key, e.target.value as FieldType)
            }
            sx={{ borderRadius: "6px" }}
          >
            {FIELD_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {FIELD_TYPE_LABELS[t]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            pt: { xs: 0, sm: 0.5 },
            justifyContent: "space-between",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={field.required}
                onChange={(e) =>
                  onUpdate(stepKey, field._key, { required: e.target.checked })
                }
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#2a8b8b" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#2a8b8b",
                  },
                }}
              />
            }
            label={
              <Typography
                variant="caption"
                sx={{ color: "#666", whiteSpace: "nowrap" }}
              >
                Required
              </Typography>
            }
            sx={{ m: 0 }}
          />
          {canRemove && (
            <IconButton
              size="small"
              onClick={() => onRemove(stepKey, field._key)}
              sx={{
                color: "#ccc",
                "&:hover": { color: "#e57373" },
                display: { xs: "inline-flex", sm: "none" }, // mobile only
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        {canRemove && (
          <IconButton
            size="small"
            onClick={() => onRemove(stepKey, field._key)}
            sx={{
              color: "#ccc",
              "&:hover": { color: "#e57373" },
              mt: 0.25,
              display: { xs: "none", sm: "inline-flex" }, // desktop only
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
      {hasPlaceholder && (
        <Box sx={{ mt: 1.5 }}>
          <TextField
            label="Placeholder text (optional)"
            value={field.placeholder || ""}
            onChange={(e) =>
              onUpdate(stepKey, field._key, { placeholder: e.target.value })
            }
            size="small"
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
          />
        </Box>
      )}

      {hasOptions && (
        <Box sx={{ mt: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ color: "#666", fontWeight: 600, display: "block", mb: 1 }}
          >
            Options
          </Typography>
          {errors[`field_${field._key}_options`] && (
            <Typography
              variant="caption"
              sx={{ color: "#d32f2f", display: "block", mb: 0.5 }}
            >
              {errors[`field_${field._key}_options`]}
            </Typography>
          )}
          <Stack spacing={1}>
            {(field.options || []).map((opt, oi) => (
              <Stack
                key={oi}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
              >
                <TextField
                  placeholder="Label (e.g. Male)"
                  value={opt.label}
                  onChange={(e) => {
                    onUpdateOption(
                      stepKey,
                      field._key,
                      oi,
                      "label",
                      e.target.value
                    );
                    if (!field.options![oi].value) {
                      onUpdateOption(
                        stepKey,
                        field._key,
                        oi,
                        "value",
                        slugify(e.target.value)
                      );
                    }
                  }}
                  error={!!errors[`opt_${field._key}_${oi}_label`]}
                  size="small"
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": { borderRadius: "6px" },
                  }}
                />
                <TextField
                  placeholder="Value (e.g. male)"
                  value={opt.value}
                  onChange={(e) =>
                    onUpdateOption(
                      stepKey,
                      field._key,
                      oi,
                      "value",
                      e.target.value
                    )
                  }
                  size="small"
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": { borderRadius: "6px" },
                  }}
                />
                {(field.options || []).length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => onRemoveOption(stepKey, field._key, oi)}
                    sx={{
                      color: "#ccc",
                      "&:hover": { color: "#e57373" },
                      alignSelf: { xs: "flex-end", sm: "center" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ))}
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => onAddOption(stepKey, field._key)}
              sx={{
                color: "#2a8b8b",
                textTransform: "none",
                alignSelf: "flex-start",
                fontSize: "0.8rem",
                p: 0,
                "&:hover": { backgroundColor: "transparent", opacity: 0.7 },
              }}
            >
              Add option
            </Button>
          </Stack>
        </Box>
      )}
      <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
        <TextField
          label="Min length"
          type="number"
          value={field.minLength ?? ""}
          onChange={(e) =>
            onUpdate(stepKey, field._key, {
              minLength: e.target.value
                ? parseInt(e.target.value, 10)
                : undefined,
            })
          }
          size="small"
          sx={{
            width: { xs: "100%", sm: 120 },
            "& .MuiOutlinedInput-root": { borderRadius: "6px" },
          }}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Max length"
          type="number"
          value={field.maxLength ?? ""}
          onChange={(e) =>
            onUpdate(stepKey, field._key, {
              maxLength: e.target.value
                ? parseInt(e.target.value, 10)
                : undefined,
            })
          }
          size="small"
          sx={{
            width: { xs: "100%", sm: 120 },
            "& .MuiOutlinedInput-root": { borderRadius: "6px" },
          }}
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Stack>
    </Box>
  );
}
