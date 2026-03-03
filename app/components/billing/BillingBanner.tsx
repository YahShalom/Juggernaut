'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Entitlements {
  plan_name: string;
  requests_last_30_days: number;
  max_requests_per_month: number;
  warn_at_percent: number;
  hard_stop_enabled: boolean;
  usage_percentage: number;
}

export const BillingBanner: React.FC = () => {
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;

  useEffect(() => {
    if (!tenantSlug) return;

    const fetchEntitlements = async () => {
      try {
        const response = await fetch(`/api/tenant/${tenantSlug}/entitlements`);
        if (!response.ok) {
          throw new Error('Failed to fetch entitlements');
        }
        const data = await response.json();
        setEntitlements(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchEntitlements();
  }, [tenantSlug]);

  if (error) {
    return <div className="bg-red-500/20 text-red-300 p-4 rounded-md text-center">Error: {error}</div>;
  }

  if (!entitlements) {
    return null; // Or a loading state
  }

  const { 
    requests_last_30_days,
    max_requests_per_month,
    usage_percentage,
    warn_at_percent,
    hard_stop_enabled
  } = entitlements;

  const isWarning = usage_percentage >= warn_at_percent;
  const isHardStopped = hard_stop_enabled && usage_percentage >= 100;

  if (isHardStopped) {
    return (
      <div className="bg-red-600 text-white p-4 rounded-md text-center font-bold mb-4">
        You have reached your plan limit. Operations are suspended. Please upgrade your plan.
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-md p-3 rounded-lg mb-4 text-sm flex justify-center items-center gap-4">
      <span>
        Usage: {requests_last_30_days.toLocaleString()} / {max_requests_per_month.toLocaleString()} requests
      </span>
      {isWarning && (
         <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
           High Usage
         </span>
      )}
    </div>
  );
};
