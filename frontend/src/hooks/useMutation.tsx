import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeSubmission, createSubmission, saveStep } from "../services/services";
import type { SaveStepPayload } from "../types/services.types";

// export function useCreateSubmission() {
//   return useMutation<CreateSubmissionResponse, Error, string>({
//     mutationFn: (formConfigId: string) => createSubmission(formConfigId),
//   });
// }

export const useCreateSubmission = () => {
  return useMutation({
    mutationFn: (payload: {
      formConfigId: string;
      stepId: string;
      answers: Record<string, unknown>;
    }) => createSubmission(payload),
  });
};

export function useSaveStep() {
  return useMutation<
    unknown,
    Error,
    { submissionId: string; payload: SaveStepPayload }
  >({
    mutationFn: ({ submissionId, payload }) => saveStep(submissionId, payload),
  });
}

export function useCompleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (submissionId: string) => completeSubmission(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
