'use client';

import { useState, useRef, useEffect } from 'react';
import InsufficientCreditsModal from '@/app/components/billing/InsufficientCreditsModal';
import PreferenceSnapshot from '@/components/atelier/preference-snapshot';
import RecommendationDisplay from '@/components/atelier/recommendation-display';

// --- Type Definitions ---
interface Tenant { id: string; name: string | null; slug: string; }
interface HairStyle {
    id: string;
    name: string;
    overlay_image_path: string | null;
    default_scale: number | null;
    default_offset_x: number | null;
    default_offset_y: number | null;
    default_rotation: number | null;
    default_opacity: number | null;
}
interface TryonClientPageProps {
    tenant: Tenant;
    initialHairStyles: HairStyle[];
}
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
interface RunInputs {
    product_category: string;
    size_value: string;
    fit_preference: string;
    style_keywords: string[];
    color_preferences: string[];
    budget_min: number;
    budget_max: number;
}

// --- Main Component ---
export default function TryonClientPage({ tenant, initialHairStyles }: TryonClientPageProps) {
    // --- State Management ---
    const [selfie, setSelfie] = useState<string | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [activeStyle, setActiveStyle] = useState<HairStyle | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isInsufficientCreditsModalOpen, setIsInsufficientCreditsModalOpen] = useState(false);
    const [view, setView] = useState<'form' | 'snapshot' | 'recommendation'>('form');
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const [lastInputs, setLastInputs] = useState<RunInputs | null>(null);

    // Adjustment state
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [opacity, setOpacity] = useState(1);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Effects ---
    useEffect(() => {
        if (activeStyle) {
            setScale(activeStyle.default_scale ?? 1);
            setOffsetX(activeStyle.default_offset_x ?? 0);
            setOffsetY(activeStyle.default_offset_y ?? 0);
            setRotation(activeStyle.default_rotation ?? 0);
            setOpacity(activeStyle.default_opacity ?? 1);
        } else {
            setScale(1); setOffsetX(0); setOffsetY(0); setRotation(0); setOpacity(1);
        }
    }, [activeStyle]);

    // --- Handlers ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelfieFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setSelfie(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleInitialRun = async () => {
        if (!selfieFile || !activeStyle) {
            alert('Please upload a selfie and select a hair style first.');
            return;
        }
        setView('snapshot');

        const inputs: RunInputs = {
            product_category: 'hair',
            size_value: 'one-size',
            fit_preference: 'none',
            style_keywords: [activeStyle.name],
            color_preferences: ['any'],
            budget_min: 0,
            budget_max: 1000
        };
        setLastInputs(inputs);

        setTimeout(async () => {
            setIsProcessing(true);
            try {
                const response = await fetch('/api/atelier/run', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputs),
                });

                const result = await response.json();

                if (response.status === 402 && result.code === 'INSUFFICIENT_CREDITS') {
                    setIsInsufficientCreditsModalOpen(true);
                    setView('form'); // Revert view if paywall is shown
                } else if (!response.ok) {
                    throw new Error(result.error || 'An unknown error occurred.');
                } else {
                    setRecommendation(result);
                    setView('recommendation');
                }
            } catch (error) {
                console.error(error);
                alert(`Error: ${(error as Error).message}`);
                setView('form');
            } finally {
                setIsProcessing(false);
            }
        }, 2000); // Show snapshot for 2 seconds
    };

    const handleRevision = async (feedbackReason: string, originalRecommendation: Recommendation) => {
        if (!lastInputs) return;

        setIsProcessing(true);
        try {
            const response = await fetch('/api/atelier/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...lastInputs,
                    session_id: originalRecommendation.session_id,
                    feedback_reason: feedbackReason,
                }),
            });

            const result = await response.json();

            if (response.status === 402 && result.code === 'INSUFFICIENT_CREDITS') {
                setIsInsufficientCreditsModalOpen(true);
            } else if (!response.ok) {
                throw new Error(result.error || 'An unknown error occurred.');
            } else {
                setRecommendation(result); // Update the recommendation with the revised result
            }
        } catch (error) {
            console.error('Revision Error:', error);
            alert(`Error during revision: ${(error as Error).message}`);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const getSupabaseImageUrl = (path: string) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        return `${supabaseUrl}/storage/v1/object/public/${path}`;
    }

    // --- Render Logic ---
    if (view === 'recommendation' && recommendation) {
        return <RecommendationDisplay recommendation={recommendation} onRevision={handleRevision} />
    }

    return (
        <div className="flex flex-col md:flex-row p-4 gap-8 max-w-7xl mx-auto">
            <InsufficientCreditsModal 
                isOpen={isInsufficientCreditsModalOpen} 
                onClose={() => setIsInsufficientCreditsModalOpen(false)} 
            />

            {/* Left Column: Hair Style Catalog */}
            <div className="w-full md:w-1/4">
                <h2 className="text-xl font-bold mb-4">Select a Style</h2>
                <div className="space-y-2">
                    {initialHairStyles.map(style => (
                        <button key={style.id} onClick={() => setActiveStyle(style)} className={`w-full text-left p-2 rounded ${activeStyle?.id === style.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                            {style.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Center Column: Image Preview & Snapshot */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-2 text-center">Virtual Hair Try-On</h1>
                <p className="text-gray-600 mb-4 text-center">Upload a selfie and see how you look!</p>
                <div 
                    className="relative w-full max-w-md aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {selfie ? <img src={selfie} alt="User selfie" className="w-full h-full object-cover" /> : <span className="text-gray-500">Click to upload your photo</span>}
                    {selfie && activeStyle && activeStyle.overlay_image_path && (
                        <img
                            src={getSupabaseImageUrl(activeStyle.overlay_image_path)}
                            alt="Hair overlay"
                            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                            style={{
                                transform: `translateX(${offsetX}px) translateY(${offsetY}px) scale(${scale}) rotate(${rotation}deg)`,
                                opacity: opacity,
                                transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                            }}
                        />
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                 {view === 'snapshot' && activeStyle && (
                    <PreferenceSnapshot 
                        product_category='hair'
                        size_value='one-size'
                        fit_preference='none'
                        style_keywords={[activeStyle.name]}
                        color_preferences={['any']}
                        budget_min={0}
                        budget_max={1000}
                    />
                )}
            </div>

            {/* Right Column: Controls */}
            <div className="w-full md:w-1/4">
                <h2 className="text-xl font-bold mb-4">Adjust Fit</h2>
                <div className="space-y-4">
                    <div>
                        <label>Scale: {scale.toFixed(2)}</label>
                        <input type="range" min="0.5" max="2" step="0.01" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full" disabled={!activeStyle} />
                    </div>
                    {/* Other sliders... */}
                    <button 
                        onClick={handleInitialRun}
                        disabled={!selfie || !activeStyle || isProcessing}
                        className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
                    >
                        {isProcessing ? 'Generating...' : 'Get Recommendation'}
                    </button>
                </div>
            </div>
        </div>
    );
}
