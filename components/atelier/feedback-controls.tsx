'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface FeedbackControlsProps {
  onRevision: (reason: string) => Promise<void>;
}

const NEGATIVE_FEEDBACK_REASONS = [
  'Too tight',
  'Too loose',
  'Too expensive',
  'Not my style',
  'Other',
];

export function FeedbackControls({ onRevision }: FeedbackControlsProps) {
  const [feedbackState, setFeedbackState] = useState<'initial' | 'positive' | 'negative_prompt'>('initial');
  const [selectedReason, setSelectedReason] = useState<string>('');

  const handlePositiveFeedback = async () => {
    try {
      await fetch('/api/atelier/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 'positive' }),
      });
      alert("Noted.");
      setFeedbackState('positive');
    } catch (error) {
      console.error('Error submitting positive feedback:', error);
      alert("Failed to submit feedback.");
    }
  };

  const handleNegativeFeedbackSubmit = async () => {
    if (!selectedReason) {
        alert("Please select a reason.");
        return
    };

    try {
      await fetch('/api/atelier/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 'negative', reason: selectedReason }),
      });

      await onRevision(selectedReason);

      setFeedbackState('initial');
      setSelectedReason('');
    } catch (error) {
      console.error('Error submitting negative feedback:', error);
      alert("Failed to submit feedback and revise.");
    }
  };

  if (feedbackState === 'initial') {
    return (
      <div className="flex items-center gap-4 mt-6">
        <Button variant="outline" onClick={handlePositiveFeedback}>
          ✅ Nailed it
        </Button>
        <Button variant="outline" onClick={() => setFeedbackState('negative_prompt')}>
          ❌ Not quite
        </Button>
      </div>
    );
  }

  if (feedbackState === 'positive') {
    return (
      <div className="flex items-center gap-4 mt-6">
        <p className="text-sm text-muted-foreground">Thanks! What's next?</p>
        <Button variant="default" onClick={() => onRevision('bolder')}>
          Bolder option
        </Button>
        <Button variant="outline" onClick={() => onRevision('classic')}>
          Keep it classic
        </Button>
      </div>
    );
  }

  if (feedbackState === 'negative_prompt') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="w-[350px]">
              <CardHeader>
                  <CardTitle>What wasn't quite right?</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex flex-wrap gap-2">
                      {NEGATIVE_FEEDBACK_REASONS.map((reason) => (
                          <Button
                              key={reason}
                              variant={selectedReason === reason ? 'default' : 'outline'}
                              onClick={() => setSelectedReason(reason)}
                          >
                              {reason}
                          </Button>
                      ))}
                  </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                  <Button variant="ghost" onClick={() => setFeedbackState('initial')}>Cancel</Button>
                  <Button onClick={handleNegativeFeedbackSubmit}>Submit & Revise</Button>
              </CardFooter>
          </Card>
      </div>
    );
  }

  return null;
}