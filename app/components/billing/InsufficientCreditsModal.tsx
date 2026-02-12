'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InsufficientCreditsModal({ isOpen, onClose }: InsufficientCreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Out of credits</h2>
        <p className="mb-6">Top up to generate new recommendations.</p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Not now</Button>
          <Button>Top up</Button>
        </div>
      </div>
    </div>
  );
}
