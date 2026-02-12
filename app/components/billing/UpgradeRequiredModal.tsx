"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@saas/shared/components/ui";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade Required</DialogTitle>
          <DialogDescription>
            You have reached the request limit for your current plan. Please
            upgrade to continue.
          </DialogDescription>
        </DialogHeader>
        {billingSummary && (
          <div className="my-4 text-sm">
            <p>
              <strong>Current Plan:</strong> {billingSummary.plan_name}
            </p>
            <p>
              <strong>Usage:</strong> {billingSummary.total_requests} /{" "}
              {billingSummary.max_requests} requests
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onManageBilling}>Manage Billing</Button>
          <Button onClick={onUpgrade}>Upgrade Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};