import { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import DynamicForm from "../components/DynamicForm";
import CustomTable from "../components/CustomTable";
import { useFormConfig, useFormConfigList } from "../hooks/useFormConfig";
import type { CustomTableRef } from "../types/table.types";
import { deleteSubmission, getSubmissionById } from "../services/services";
import FormBuilder from "../components/FormBuilder";

interface SubmissionData {
  _id: string;
  formConfigId: string;
  status: "DRAFT" | "COMPLETED";
  currentStep: number;
  completedSteps: string[];
  answers: Record<string, unknown>;
}

export default function SubmissionsPage() {
  const queryClient = useQueryClient();
  const tableRef = useRef<CustomTableRef>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openSelector, setOpenSelector] = useState(false);
  const [openFormBuilder, setOpenFormBuilder] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [editingSubmission, setEditingSubmission] =
    useState<SubmissionData | null>(null);
  const [toast, setToast] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "",
  });
  const { data: formConfigList = [] } = useFormConfigList();
  const { data: activeFormConfig, isLoading } = useFormConfig(selectedFormId);


  const handleFormClose = () => {
    setOpenForm(false);

    setEditingSubmission(null);

    setSelectedFormId("");

    tableRef.current?.refetch();

    queryClient.invalidateQueries({
      queryKey: ["submissions"],
    });
  };

  const handleOpenNewSubmission = async () => {
    setEditingSubmission(null);

    setSelectedFormId("");

    setOpenSelector(true);
  };

  const handleContinueForm = () => {
    if (!selectedFormId) return;

    setOpenSelector(false);

    setOpenForm(true);
  };

  const handleEditSubmission = async (submissionId: string) => {
    try {
      const submission = await getSubmissionById(submissionId);

      setEditingSubmission(submission);

      setSelectedFormId(submission.formConfigId);

      setOpenForm(true);
    } catch {
      setToast({
        open: true,
        severity: "error",
        message: "Failed to load submission",
      });
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      await deleteSubmission(submissionId);

      await queryClient.invalidateQueries({
        queryKey: ["submissions"],
      });

      setToast({
        open: true,
        severity: "success",
        message: "Submission deleted successfully",
      });
    } catch {
      setToast({
        open: true,
        severity: "error",
        message: "Failed to delete submission",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap:1.5
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setOpenFormBuilder(true)}
                sx={{
                  borderColor: "#2a8b8b",
                  color: "#2a8b8b",
                  borderRadius: "6px",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    backgroundColor: "#e0f2f1",
                    borderColor: "#1f6b6b",
                  },
                }}
              >
                Create Form
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenNewSubmission}
                sx={{
                  backgroundColor: "#2a8b8b",
                  "&:hover": {
                    backgroundColor: "#1f6b6b",
                  },
                }}
              >
                Add New Submission
              </Button>
            </Box>

            <CustomTable
              ref={tableRef}
              onEditSubmission={handleEditSubmission}
              onDeleteSubmission={handleDeleteSubmission}
            />
          </Stack>
        </Container>
      </Box>
      <FormBuilder
        open={openFormBuilder}
        onClose={() => {setOpenFormBuilder(false)}}
      />
      <Dialog
        open={openSelector}
        onClose={() => setOpenSelector(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Form</DialogTitle>

        <DialogContent>
          <FormControl
            fullWidth
            sx={{
              mt: 2,
            }}
          >
            <InputLabel>Select Form</InputLabel>

            <Select
              value={selectedFormId}
              label="Select Form"
              onChange={(e) => setSelectedFormId(e.target.value)}
            >
              {formConfigList.map((form) => (
                <MenuItem key={form._id} value={form._id}>
                  {form.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenSelector(false)}>Cancel</Button>

          <Button
            variant="contained"
            disabled={!selectedFormId}
            onClick={handleContinueForm}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {activeFormConfig && (
        <DynamicForm
          open={openForm}
          onClose={handleFormClose}
          formConfig={activeFormConfig}
          isLoading={isLoading}
          editingSubmission={editingSubmission}
        />
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
