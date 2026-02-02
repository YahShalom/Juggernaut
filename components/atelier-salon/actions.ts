'use server';

import { z } from 'zod';

const schema = z.object({
    tenantSlug: z.string(),
    hairStyleId: z.string(),
    selfieFile: z.any(),
    appliedScale: z.string(),
    appliedOffsetX: z.string(),
    appliedOffsetY: z.string(),
    appliedRotation: z.string(),
    appliedOpacity: z.string(),
});

export const saveHairTryon = async (formData: FormData) => {
    const validatedFields = schema.safeParse({
        tenantSlug: formData.get('tenantSlug'),
        hairStyleId: formData.get('hairStyleId'),
        selfieFile: formData.get('selfieFile'),
        appliedScale: formData.get('appliedScale'),
        appliedOffsetX: formData.get('appliedOffsetX'),
        appliedOffsetY: formData.get('appliedOffsetY'),
        appliedRotation: formData.get('appliedRotation'),
        appliedOpacity: formData.get('appliedOpacity'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // TODO: Implement the actual logic to save the hair try-on data.
    console.log('Saving hair try-on data:', validatedFields.data);

    return {
        success: true,
    };
};