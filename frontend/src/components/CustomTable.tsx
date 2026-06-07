import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  IconButton,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from "@tanstack/react-query";
import { fetchSubmissions } from "../services/services";
import StatusChip from "./StatusChip";
import type { CustomTableRef } from "../types/table.types";
import type { SubmissionListItem } from "../types/services.types";

type StatusFilter = "all" | "completed" | "draft";

interface CustomTableProps {
  onEditSubmission?: (submissionId: string) => void;
  onDeleteSubmission?: (submissionId: string) => void;
}

const CustomTableComponent = forwardRef<CustomTableRef, CustomTableProps>(
  ({ onEditSubmission, onDeleteSubmission }, ref) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const {
      data: submissions = [],
      isLoading,
      refetch,
    } = useQuery<SubmissionListItem[]>({
      queryKey: ["submissions"],
      queryFn: fetchSubmissions,
      staleTime: 10000,
      gcTime: 300000,
      refetchOnWindowFocus: false,
    });

    useImperativeHandle(ref, () => ({
      refetch,
    }));

    if (isLoading) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography>Loading submissions...</Typography>
        </Box>
      );
    }

    const filteredSubmissions =
      statusFilter === "all"
        ? submissions
        : submissions.filter((s) => s.status.toLowerCase() === statusFilter);

    const paginatedRows = filteredSubmissions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <Box
        sx={{
          p: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Form Submissions
          </Typography>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="status-filter-label">
              <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                Status
              </Stack>
            </InputLabel>
            <Select
              labelId="status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter);
                setPage(0); // reset to page 1 on filter change
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No submissions match the selected filter.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.title}</TableCell>

                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>

                    <TableCell>{row.progress}</TableCell>

                    <TableCell align="center">
                      <Stack direction="row" sx={{ justifyContent: "center" }}>
                        <IconButton onClick={() => onEditSubmission?.(row._id)}>
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => onDeleteSubmission?.(row._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredSubmissions.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
        />
      </Box>
    );
  }
);

CustomTableComponent.displayName = "CustomTable";

export default CustomTableComponent;
