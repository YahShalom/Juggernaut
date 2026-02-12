'use client';

import React from 'react';
import RecommendationView from './recommendation-view';
import { FeedbackControls } from './feedback-controls';

// --- Type Definitions ---
interface Recommendation {
    type: "recommendation";
    session_id: string;
    recommendation_id: string;
    primary_text: string;
    alt_text: string;
    why_bullets: string[];
    fit_confidence: number;
    risk_note?: string;
}

interface RecommendationDisplayProps {
    recommendation: Recommendation;
    onRevision: (feedbackReason: string, originalRecommendation: Recommendation) => Promise<void>;
}

// --- Main Component ---
export default function RecommendationDisplay({ recommendation, onRevision }: RecommendationDisplayProps) {
    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <RecommendationView
                primary_text={recommendation.primary_text}
                alt_text={recommendation.alt_text}
                why_bullets={recommendation.why_bullets}
                fit_confidence={recommendation.fit_confidence}
                risk_note={recommendation.risk_note}
            />
            <FeedbackControls 
                onRevision={(reason) => onRevision(reason, recommendation)}
            />
        </div>
    );
}
