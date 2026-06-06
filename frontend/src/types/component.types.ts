export interface SubmissionListItem {
  _id: string;
  title: string;
  status: "DRAFT" | "COMPLETED";
  progress: string;
}

export interface CustomTableRef {
  refetch: () => void;
}

