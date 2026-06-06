import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import type { FormConfig } from "../types/form.types";

interface Props {
  open: boolean;
  forms: FormConfig[];
  onSelect: (form: FormConfig) => void;
  onClose: () => void;
}

export default function FormSelectorDialog({
  open,
  forms,
  onSelect,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Form</DialogTitle>

      <DialogContent>
        <List>
          {forms.map((form) => (
            <ListItemButton key={form._id} onClick={() => onSelect(form)}>
              <ListItemText primary={form.title} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
