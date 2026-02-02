import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Regular expression to validate the tenant slug
const SLUG_REGEX = /^[a-z0-9-]+$/;

/**
 * A development-only endpoint to bootstrap a new tenant.
 * This endpoint is locked down and should not be exposed in production.
 */
export async function POST(req: Request) {
  // 1. Environment and Header Check
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 404 }
    );
  }

  const requestHeaders = await headers();
  const secret = requestHeaders.get('x-dev-secret');
  if (!secret || secret !== process.env.DEV_BOOTSTRAP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse and Validate Body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { slug, name } = body;

  if (!slug || typeof slug !== 'string' || !SLUG_REGEX.test(slug)) {
    return NextResponse.json(
      {
        error:
          'Invalid slug. Must be a lowercase string with numbers and hyphens only.',
      },
      { status: 400 }
    );
  }

  try {
    // 3. Check if Tenant Already Exists (Idempotent)
    const { data: existingTenant, error: selectError } = await supabaseAdmin
      .from('tenants')
      .select('id, slug, status, plan, brand_json')
      .eq('slug', slug)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking for existing tenant:', selectError);
      return NextResponse.json(
        { error: 'Database error while checking for tenant' },
        { status: 500 }
      );
    }

    if (existingTenant) {
      return NextResponse.json(existingTenant, { status: 200 });
    }

    // 4. Get Column Information to Build Insert Payload
    const { data: columns, error: columnsError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, column_default, is_nullable')
      .eq('table_name', 'tenants');

    if (columnsError) {
      console.error('Error fetching tenant schema:', columnsError);
      return NextResponse.json(
        { error: 'Could not fetch tenant schema' },
        { status: 500 }
      );
    }

    // Construct the payload, satisfying required columns
    const insertPayload: { [key: string]: unknown } = { slug };
    if (name) {
        insertPayload.name = name;
    }

    if (columns) {
        for (const col of columns) {
            const key = col.column_name;
            if (!insertPayload.hasOwnProperty(key) && col.is_nullable === 'NO' && col.column_default === null) {
                // If a column is NOT NULLABLE and has NO DEFAULT, we must provide a value.
                // This is a safety net. For this project, 'plan' and 'status' have defaults.
                // You might need to add specific logic here if your schema changes.
                 switch (key) {
                    case 'plan':
                        insertPayload[key] = 'free'; // Default plan
                        break;
                    case 'status':
                        insertPayload[key] = 'active'; // Default status
                        break;
                    default:
                        // Add other required fields if necessary.
                        // For now, we will let the insert fail if we are missing a required field we don't know about.
                        break;
                }
            }
        }
    }

    // 5. Insert the New Tenant
    const { data: newTenant, error: insertError } = await supabaseAdmin
      .from('tenants')
      .insert([insertPayload])
      .select('id, slug, status, plan, brand_json')
      .single();

    if (insertError) {
      console.error('Error creating new tenant:', insertError);
      return NextResponse.json(
        { error: `Database error: ${insertError.message}` },
        { status: 500 }
      );
    }

    // 6. Return the Result
    return NextResponse.json(newTenant, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in /api/dev/create-tenant:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: message },
      { status: 500 }
    );
  }
}
