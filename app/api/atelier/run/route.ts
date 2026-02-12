import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const runSchema = z.object({
  product_category: z.string(),
  size_value: z.string(),
  fit_preference: z.string(),
  style_keywords: z.array(z.string()).optional(),
  color_preferences: z.array(z.string()).optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  session_id: z.string().optional(), // For revisions
  feedback_reason: z.string().optional(), // For revisions
});

const mockInitialRecommendation = {
    primary_text: "We recommend the Classic Denim Jacket.",
    alt_text: "A versatile and timeless piece for your wardrobe.",
    why_bullets: [
        "Made from high-quality, durable denim.",
        "Classic design that never goes out of style.",
        "Pairs well with a wide range of outfits.",
    ],
    fit_confidence: 0.85,
    risk_note: null,
};

const mockRevisedRecommendation = {
    primary_text: "Based on your feedback, we suggest the Comfort-Fit Jeans.",
    alt_text: "For a looser fit, the Relaxed Style Chinos are a great choice.",
    why_bullets: [
        "Engineered for a more generous fit.",
        "Uses a stretch fabric for added comfort.",
        "Excellent reviews for fit and style.",
    ],
    fit_confidence: 0.92,
    risk_note: "Standard return policy applies."
};

export async function POST(req: Request) {
  const supabase = createClient();
  let current_session_id: string | undefined;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedInputs = runSchema.safeParse(body);

    if (!validatedInputs.success) {
      return NextResponse.json({ error: 'Invalid input payload', details: validatedInputs.error.flatten() }, { status: 400 });
    }

    const { session_id, feedback_reason, ...inputs } = validatedInputs.data;
    current_session_id = session_id;
    
    // @ts-ignore
    const tenantId = user.user_metadata.tenant_id;
    if (!tenantId) {
        return NextResponse.json({ error: "Tenant ID not found for user" }, { status: 400 });
    }

    if (current_session_id && feedback_reason) {
        // This is a revision request
        console.log(`Revising session ${current_session_id} with feedback: ${feedback_reason}`);
        await supabase.from('atelier_sessions').update({ updated_at: new Date().toISOString() }).eq('id', current_session_id);

        const { data: recommendation, error: recommendationError } = await supabase
            .from('atelier_recommendations')
            .insert({
                session_id: current_session_id,
                ...mockRevisedRecommendation,
            })
            .select()
            .single();
        
        if (recommendationError) throw recommendationError;

        return NextResponse.json({
            type: "recommendation",
            session_id: current_session_id,
            recommendation_id: recommendation.id,
            ...mockRevisedRecommendation,
        });

    } else {
        // This is a new recommendation request
        console.log('Creating new recommendation');
        
        const { data: newSession, error: sessionError } = await supabase
            .from('atelier_sessions')
            .insert({ tenant_id: tenantId, user_id: user.id })
            .select()
            .single();

        if (sessionError) throw sessionError;
        current_session_id = newSession.id;

        const { error: inputError } = await supabase.from('atelier_inputs').insert({
            session_id: current_session_id,
            ...inputs,
            style_keywords: inputs.style_keywords ? JSON.stringify(inputs.style_keywords) : undefined,
            color_preferences: inputs.color_preferences ? JSON.stringify(inputs.color_preferences) : undefined,
        });

        if (inputError) throw inputError;

        const { data: recommendation, error: recommendationError } = await supabase
            .from('atelier_recommendations')
            .insert({
                session_id: current_session_id,
                ...mockInitialRecommendation,
            })
            .select()
            .single();

        if (recommendationError) throw recommendationError;

        return NextResponse.json({
            type: "recommendation",
            session_id: current_session_id,
            recommendation_id: recommendation.id,
            ...mockInitialRecommendation,
        });
    }

  } catch (error: any) {
      if (error.message && error.message.includes('insufficient credits')) {
          return NextResponse.json({ 
            type: "error",
            code: 'INSUFFICIENT_CREDITS', 
            message: 'You’re out of credits.',
            session_id: current_session_id
          }, { status: 402 });
      }
      console.error('Run endpoint error:', error);
      return NextResponse.json({ 
        type: "error",
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again.'
       }, { status: 500 });
  }
}
