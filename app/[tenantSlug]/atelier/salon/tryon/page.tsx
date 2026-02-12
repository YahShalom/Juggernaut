'use client';

import React, { useState } from 'react';
import { PreferenceSnapshot, RecommendationScreen } from '@/components/atelier/RecommendationComponents';

const mockPreferences = {
    product_category: 'Jeans',
    size_value: '32/32',
    fit_preference: 'Slim Fit',
};

const AtelierPage: React.FC = () => {
    const [recommendation, setRecommendation] = useState<any>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [negativeFeedbackReason, setNegativeFeedbackReason] = useState('');
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const handleRun = async (isRevision = false) => {
        const body = isRevision
            ? { session_id: sessionId, feedback_reason: negativeFeedbackReason, ...mockPreferences }
            : mockPreferences;

        try {
            const response = await fetch('/api/atelier/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.status === 402) {
                setShowPaywall(true);
                return;
            }

            const data = await response.json();
            setRecommendation(data);
            setSessionId(data.session_id);
            setShowFeedbackForm(false);
            setNegativeFeedbackReason('');
        } catch (error) {
            console.error('Error running Atelier:', error);
        }
    };

    const handleFeedback = (feedback: 'positive' | 'negative') => {
        if (feedback === 'positive') {
            // Handle positive feedback (e.g., show a thank you message)
            alert('Thank you for your feedback!');
            setRecommendation(null); // Reset for a new run
        } else {
            setShowFeedbackForm(true);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Atelier</h1>
            {!recommendation && !showFeedbackForm && <PreferenceSnapshot preferences={mockPreferences} onRun={() => handleRun()} />}
            {recommendation && !showFeedbackForm && <RecommendationScreen recommendation={recommendation} onFeedback={handleFeedback} />}

            {showFeedbackForm && (
                <div className="p-4 border rounded-lg">
                    <h2 className="text-xl font-bold">Provide Feedback</h2>
                    <textarea
                        className="w-full p-2 border rounded mt-2"
                        value={negativeFeedbackReason}
                        onChange={(e) => setNegativeFeedbackReason(e.target.value)}
                        placeholder="What didn't you like?"
                    />
                    <button onClick={() => handleRun(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Submit Feedback & Revise</button>
                </div>
            )}

            {showPaywall && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold">Insufficient Credits</h2>
                        <p>You have insufficient credits to perform this action. Please upgrade your plan to continue.</p>
                        <button onClick={() => setShowPaywall(false)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AtelierPage;
