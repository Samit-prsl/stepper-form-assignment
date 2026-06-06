import {
  TextField,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Typography,
} from "@mui/material";
import type { FormField } from "../types/form.types";
import { useFormStore } from "../store/form.store";

interface DynamicFormFieldProps {
  field: FormField;
  stepId: string;
  value: string | string[];
  error?: string;
}

export default function DynamicFormField({
  field,
  stepId,
  value,
  error,
}: DynamicFormFieldProps) {
  const setFieldValue = useFormStore((state) => state.setFieldValue);

  const handleChange = (newValue: string | string[]) => {
    setFieldValue(stepId, field.id, newValue);
  };

  const requiredIndicator = field.required ? " *" : "";

  switch (field.type) {
    case "TEXT":
      return (
        <TextField
          fullWidth
          label={field.label + requiredIndicator}
          placeholder={field.placeholder}
          type={field.id === "age" ? "number" : "text"}
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          error={!!error}
          helperText={error}
          slotProps={{
            htmlInput: {
              maxLength: field.maxLength,
              minLength: field.minLength,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            },
          }}
        />
      );

    case "SELECT":
      return (
        <TextField
          fullWidth
          select
          label={field.label + requiredIndicator}
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            },
          }}
        >
          <MenuItem value="">Select an option</MenuItem>
          {field.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );

    case "RADIO":
      return (
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "#666", mb: 1.5, fontWeight: 500 }}
          >
            {field.label}
            {requiredIndicator}
          </Typography>
          <RadioGroup
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            row
            sx={{ gap: 3 }}
          >
            {field.options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{ m: 0 }}
              />
            ))}
          </RadioGroup>
          {error && (
            <Typography
              variant="caption"
              sx={{ color: "#d32f2f", display: "block", mt: 1 }}
            >
              {error}
            </Typography>
          )}
        </Box>
      );

    case "TEXTAREA":
      return (
        <TextField
          fullWidth
          label={field.label + requiredIndicator}
          placeholder={field.placeholder}
          multiline
          rows={4}
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          error={!!error}
          helperText={error}
          slotProps={{
            htmlInput: {
              maxLength: field.maxLength,
              minLength: field.minLength,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            },
          }}
        />
      );

    default:
      return null;
  }
}
