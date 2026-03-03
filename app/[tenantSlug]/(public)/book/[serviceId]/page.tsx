import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';

export default async function BookServicePage({ params }: { params: { serviceId: string } }) {
  const { supabase, tenantId } = await createTenantedSupabaseServerClient();

  const { data: offering } = await supabase
    .from('offerings')
    .select('*, staff(*)')
    .eq('id', params.serviceId)
    .single();

  if (!offering) {
    return <div>Service not found</div>;
  }

  // Assume get_available_slots is a Supabase RPC function
  // const { data: availableSlots } = await supabase.rpc('get_available_slots', { offering_id: offering.id });

  const staff = offering.staff;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{offering.name}</h1>
      <p className="text-lg mb-8">{offering.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Select a Date & Time</h2>
          {/* Calendar and time slot selection will go here */}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Your Details</h2>

          {staff && staff.length > 1 && (
            <div className="mb-4">
              <label htmlFor="staff" className="block text-lg mb-2">
                Select Staff
              </label>
              <select
                id="staff"
                name="staff"
                className="w-full p-2 rounded-lg bg-gray-800/50"
              >
                {staff.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <form>{/* Booking form will go here */}</form>
        </div>
      </div>
    </div>
  );
}
