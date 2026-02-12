import React from 'react';

interface Recommendation {
    primary_text: string;
    alt_text: string;
    why_bullets: string[];
    fit_confidence: number;
    risk_note: string | null;
}

interface RecommendationScreenProps {
    recommendation: Recommendation;
    onFeedback: (feedback: 'positive' | 'negative') => void;
}

export const RecommendationScreen: React.FC<RecommendationScreenProps> = ({ recommendation, onFeedback }) => {
    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold">Your Recommendation</h2>
            <p>{recommendation.primary_text}</p>
            <p className="text-sm text-gray-500">{recommendation.alt_text}</p>
            <ul className="list-disc list-inside my-4">
                {recommendation.why_bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                ))}
            </ul>
            <div>
                <span className="font-bold">Fit Confidence:</span> {recommendation.fit_confidence * 100}%
                {recommendation.risk_note && (
                    <p className="text-sm text-yellow-500">Risk Note: {recommendation.risk_note}</p>
                )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => onFeedback('positive')} className="px-4 py-2 bg-green-500 text-white rounded">✅</button>
                <button onClick={() => onFeedback('negative')} className="px-4 py-2 bg-red-500 text-white rounded">❌</button>
            </div>
        </div>
    );
};

interface PreferenceSnapshotProps {
    preferences: {
        product_category: string;
        size_value: string;
        fit_preference: string;
    };
    onRun: () => void;
}

export const PreferenceSnapshot: React.FC<PreferenceSnapshotProps> = ({ preferences, onRun }) => {
    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold">Your Preferences</h2>
            <p>Product Category: {preferences.product_category}</p>
            <p>Size: {preferences.size_value}</p>
            <p>Fit: {preferences.fit_preference}</p>
            <button onClick={onRun} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Run Atelier</button>
        </div>
    );
};
