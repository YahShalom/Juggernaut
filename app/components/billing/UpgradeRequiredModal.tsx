"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface UpgradeRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onManageBilling: () => void;
  billingSummary: {
    plan_name: string;
    total_requests: number;
    max_requests: number;
  } | null;
}

export const UpgradeRequiredModal: React.FC<UpgradeRequiredModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  onManageBilling,
  billingSummary,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-gray-900">Upgrade Required</h2>
        <p className="mt-2 text-sm text-gray-700">
          You have reached the request limit for your current plan. Please
          upgrade to continue.
        </p>
        {billingSummary && (
          <div className="my-4 text-sm text-gray-800">
            <p>
              <strong>Current Plan:</strong> {billingSummary.plan_name}
            </p>
            <p>
              <strong>Usage:</strong> {billingSummary.total_requests} /{" "}
              {billingSummary.max_requests} requests
            </p>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onManageBilling}>Manage Billing</Button>
          <Button onClick={onUpgrade}>Upgrade Plan</Button>
        </div>
      </div>
    </div>
  );
};
