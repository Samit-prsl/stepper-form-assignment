import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface Props {
  completed: boolean;
}

export default function CompletionIcon({ completed }: Props) {
  return completed ? (
    <CheckCircleIcon
      sx={{
        color: "#4caf50",
      }}
    />
  ) : (
    <RadioButtonUncheckedIcon
      sx={{
        color: "#ccc",
      }}
    />
  );
}
