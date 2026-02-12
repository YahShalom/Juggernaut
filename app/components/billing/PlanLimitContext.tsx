"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { UpgradeRequiredModal } from "@/app/components/billing/UpgradeRequiredModal";
import { useParams, useRouter } from 'next/navigation';

interface PlanLimitContextType {
  triggerLimitModal: (failedRequest: () => Promise<any>) => void;
}

const PlanLimitContext = createContext<PlanLimitContextType | undefined>(
  undefined
);

export const usePlanLimit = () => {
  const context = useContext(PlanLimitContext);
  if (!context) {
    throw new Error("usePlanLimit must be used within a PlanLimitProvider");
  }
  return context;
};

interface PlanLimitProviderProps {
  children: ReactNode;
}

export const PlanLimitProvider: React.FC<PlanLimitProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingSummary, setBillingSummary] = useState(null);
  const [failedRequest, setFailedRequest] = useState<(() => Promise<any>) | null>(null);
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as string;

  const fetchBillingSummary = useCallback(async () => {
    if (!tenantId) return;
    try {
      const response = await fetch(`/api/tenant/${tenantId}/billing-summary`);
      if (response.ok) {
        const data = await response.json();
        setBillingSummary(data);
      }
    } catch (error) {
      console.error("Failed to fetch billing summary:", error);
    }
  }, [tenantId]);

  const triggerLimitModal = useCallback((request: () => Promise<any>) => {
    setFailedRequest(() => request);
    fetchBillingSummary();
    setIsModalOpen(true);
  }, [fetchBillingSummary]);

  const handleClose = () => {
    setIsModalOpen(false);
    setFailedRequest(null);
  };

  const handleUpgrade = async () => {
    // Redirect to Stripe Checkout
    const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
    });
    const { url } = await res.json();
    if (url) {
        router.push(url);
    }
  };

  const handleManageBilling = async () => {
    // Redirect to Stripe Customer Portal
    const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
    });
    const { url } = await res.json();
    if (url) {
        router.push(url);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromBilling = url.searchParams.get('from_billing');
    if (fromBilling && failedRequest) {
      // User returned from a billing page, refresh state and retry
      fetchBillingSummary().then(() => {
        failedRequest();
        // Clean up the URL
        url.searchParams.delete('from_billing');
        window.history.replaceState({}, '', url.toString());
      });
      setIsModalOpen(false);
    }
  }, [failedRequest, fetchBillingSummary]);

  return (
    <PlanLimitContext.Provider value={{ triggerLimitModal }}>
      {children}
      <UpgradeRequiredModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onUpgrade={handleUpgrade}
        onManageBilling={handleManageBilling}
        billingSummary={billingSummary}
      />
    </PlanLimitContext.Provider>
  );
};