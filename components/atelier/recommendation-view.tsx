
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecommendationViewProps {
  primary_text: string;
  alt_text: string;
  why_bullets: string[];
  fit_confidence: number;
  risk_note?: string | null;
}

const RecommendationView: React.FC<RecommendationViewProps> = ({
  primary_text,
  alt_text,
  why_bullets,
  fit_confidence,
  risk_note,
}) => {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Your Style Recommendation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Primary Recommendation</h3>
          <p className="text-muted-foreground">{primary_text}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight">Safe Alternative</h3>
          <p className="text-muted-foreground">{alt_text}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight">Why This Works</h3>
          <ul className="list-disc list-inside text-muted-foreground pl-4 space-y-1">
            {why_bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Fit Confidence</h3>
            <Badge variant="secondary">
                {(fit_confidence * 100).toFixed(0)}%
            </Badge>
        </div>

        {risk_note && (
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Return-Risk Note</h3>
            <p className="text-sm text-amber-600 dark:text-amber-500 italic">{risk_note}</p>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default RecommendationView;
