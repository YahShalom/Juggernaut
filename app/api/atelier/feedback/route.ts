import { NextResponse } from 'next/server';
import { z } from 'zod';

const feedbackSchema = z.object({
  recommendation_id: z.string(),
  feedback: z.enum(['nailed_it', 'not_quite']),
  details: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFeedback = feedbackSchema.safeParse(body);

    if (!validatedFeedback.success) {
      return NextResponse.json({ error: 'Invalid feedback payload', details: validatedFeedback.error.flatten() }, { status: 400 });
    }

    // TODO: Store feedback in the database
    console.log('Received feedback:', validatedFeedback.data);

    return NextResponse.json({ success: true, message: 'Feedback received' });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}