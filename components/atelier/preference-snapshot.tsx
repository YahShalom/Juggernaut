'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PreferenceSnapshotProps {
  product_category?: string;
  size_value?: string;
  fit_preference?: string;
  style_keywords?: string[];
  color_preferences?: string[];
  budget_min?: number;
  budget_max?: number;
}

export default function PreferenceSnapshot({ 
    product_category, 
    size_value, 
    fit_preference, 
    style_keywords, 
    color_preferences, 
    budget_min, 
    budget_max 
}: PreferenceSnapshotProps) {
    const missingFields: string[] = [];

    if (!product_category) missingFields.push('Category');
    if (!size_value) missingFields.push('Size');
    if (!fit_preference) missingFields.push('Fit');
    if (!style_keywords || style_keywords.length === 0) missingFields.push('Style');
    if (!color_preferences || color_preferences.length === 0) missingFields.push('Colors');
    if (budget_min === undefined || budget_max === undefined) missingFields.push('Budget');

    return (
        <Card className="w-full max-w-lg mx-auto my-4">
            <CardHeader>
                <CardTitle className="text-lg">Your Preference Snapshot</CardTitle>
            </CardHeader>
            <CardContent>
                {missingFields.length > 0 ? (
                    <p className="text-sm text-red-600 line-clamp-2">
                        Missing: {missingFields.join(', ')}
                    </p>
                ) : (
                    <p className="text-sm text-gray-700 line-clamp-2">
                        Got it: {product_category}, size {size_value}, fit {fit_preference}, style {style_keywords?.join('/')}, colors {color_preferences?.join('/')}, budget {budget_min}–{budget_max}.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}