-- === ATELIER_SALON_DEMO_SEED_SQL ===
DO $$
DECLARE
    v_tenant_id UUID;
    v_cat_braids_id UUID;
    v_cat_locs_id UUID;
    v_cat_natural_id UUID;
BEGIN
    -- 1. Resolve tenant_id from slug
    SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'perrydbeauty' LIMIT 1;

    -- 2. If tenant not found, raise notice and exit
    IF v_tenant_id IS NULL THEN
        RAISE NOTICE 'Tenant with slug ''perrydbeauty'' not found. Aborting seed script.';
        RETURN;
    END IF;

    -- 3. Insert categories if they are missing
    INSERT INTO public.hair_style_categories (tenant_id, name, sort_order) VALUES
        (v_tenant_id, 'Braids', 10),
        (v_tenant_id, 'Locs', 20),
        (v_tenant_id, 'Natural', 30)
    ON CONFLICT (tenant_id, name) DO NOTHING;

    -- Get category IDs for the next step
    SELECT id INTO v_cat_braids_id FROM public.hair_style_categories WHERE tenant_id = v_tenant_id AND name = 'Braids';
    SELECT id INTO v_cat_locs_id FROM public.hair_style_categories WHERE tenant_id = v_tenant_id AND name = 'Locs';
    SELECT id INTO v_cat_natural_id FROM public.hair_style_categories WHERE tenant_id = v_tenant_id AND name = 'Natural';

    -- 4. Insert demo hair styles with realistic defaults
    INSERT INTO public.hair_styles (tenant_id, category_id, name, description, status, overlay_image_path, preview_image_path, default_scale, default_offset_x, default_offset_y, default_rotation, default_opacity) VALUES
        (v_tenant_id, v_cat_braids_id, 'Classic Box Braids', 'Timeless and versatile box braids.', 'active', 'hair-overlays/perrydbeauty/overlays/classic-box-braids.png', 'hair-overlays/perrydbeauty/previews/classic-box-braids.jpg', 1.1, -10, -90, 0, 0.95),
        (v_tenant_id, v_cat_braids_id, 'Jumbo Knotless Braids', 'Large, lightweight braids for a bold look.', 'active', 'hair-overlays/perrydbeauty/overlays/jumbo-knotless-braids.png', 'hair-overlays/perrydbeauty/previews/jumbo-knotless-braids.jpg', 1.2, 5, -110, 0, 1.0),
        (v_tenant_id, v_cat_locs_id, 'Shoulder Length Locs', 'Elegant and mature shoulder-length locs.', 'active', 'hair-overlays/perrydbeauty/overlays/shoulder-length-locs.png', 'hair-overlays/perrydbeauty/previews/shoulder-length-locs.jpg', 0.9, 0, -60, 0, 1.0),
        (v_tenant_id, v_cat_locs_id, 'Butterfly Locs', 'Distressed, looped locs with a bohemian vibe.', 'active', 'hair-overlays/perrydbeauty/overlays/butterfly-locs.png', NULL, 1.4, -25, -120, 5, 0.85),
        (v_tenant_id, v_cat_natural_id, 'Defined Tapered Cut', 'A chic tapered cut with defined curls on top.', 'active', 'hair-overlays/perrydbeauty/overlays/defined-tapered-cut.png', NULL, 1.0, 15, -20, 6, 1.0),
        (v_tenant_id, v_cat_natural_id, 'High Puff Afro', 'A classic high puff that showcases natural volume.', 'active', 'hair-overlays/perrydbeauty/overlays/high-puff-afro.png', 'hair-overlays/perrydbeauty/previews/high-puff-afro.jpg', 1.25, 0, -50, 0, 0.80)
    ON CONFLICT (tenant_id, name) DO NOTHING;

    RAISE NOTICE 'Atelier Salon seed script for tenant ''perrydbeauty'' completed successfully.';
END $$;