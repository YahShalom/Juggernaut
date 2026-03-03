import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';

export default async function FashionProductPage({ params }: { params: { productId: string, tenantSlug: string } }) {
  const { supabase } = await createTenantedSupabaseServerClient();

  const { data: offering } = await supabase
    .from('offerings')
    .select('*, staff(*)')
    .eq('id', params.productId)
    .single();

  if (!offering) {
    return <div>Product not found</div>;
  }

  const variants = offering.variants || {};
  const sizes = variants.sizes || [];
  const fittings = variants.fittings || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{offering.name}</h1>
      <p className="text-lg mb-8">{offering.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Choose Your Options</h2>

          {sizes.length > 0 && (
            <div className="mb-4">
              <label htmlFor="size" className="block text-lg mb-2">
                Size
              </label>
              <select
                id="size"
                name="size"
                className="w-full p-2 rounded-lg bg-gray-800/50"
              >
                {sizes.map((s: any) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {fittings.length > 0 && (
            <div className="mb-4">
              <label htmlFor="fitting" className="block text-lg mb-2">
                Fitting
              </label>
              <select
                id="fitting"
                name="fitting"
                className="w-full p-2 rounded-lg bg-gray-800/50"
              >
                {fittings.map((f: any) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Booking</h2>
          <a
            href={`/${params.tenantSlug}/book/${offering.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Book a Fitting
          </a>
        </div>
      </div>
    </div>
  );
}
