"use client";

import { usePlanLimit } from "@/app/components/billing/PlanLimitContext";
import { useCallback } from "react";

export const useApi = () => {
  const { triggerLimitModal } = usePlanLimit();

  const apiFetch = useCallback(
    async (url: string, options?: RequestInit) => {
      const executeRequest = async () => {
        const response = await fetch(url, options);

        if (response.status === 402) {
          const data = await response.json();
          if (data.error === "PLAN_LIMIT_REACHED") {
            triggerLimitModal(() => executeRequest());
            // Prevent further processing of the failed request
            return new Promise(() => {}); // Return a promise that never resolves
          }
        }

        return response;
      };

      return executeRequest();
    },
    [triggerLimitModal]
  );

  return { apiFetch };
};