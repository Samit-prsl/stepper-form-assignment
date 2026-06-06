import { Chip } from "@mui/material";

export default function StatusChip({ status }: { status: string }) {
  const isDraft = status === "DRAFT";

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: isDraft ? "#fff3cd" : "#d4edda",

        color: isDraft ? "#856404" : "#155724",

        fontWeight: 600,
      }}
    />
  );
}
