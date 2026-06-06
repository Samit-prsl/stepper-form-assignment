import { useQuery } from "@tanstack/react-query";
import type { FormConfig } from "../types/form.types";
import { getFormConfigById, getFormConfigs } from "../services/services";

export function useFormConfig(formId?: string) {
  return useQuery<FormConfig>({
    queryKey: ["formConfig", formId],
    queryFn: () => getFormConfigById(formId!),
    enabled: !!formId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

export function useFormConfigList() {
  return useQuery<FormConfig[], Error>({
    queryKey: ["formConfig"],
    queryFn: getFormConfigs,
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60 * 24,
  });
}
