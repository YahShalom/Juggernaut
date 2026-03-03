'use client';

import { useState } from 'react';

// Re-usable Form Component
const OfferingForm = ({ offering, onSave, tenantSlug }: { offering?: any, onSave: (data: any, slug: string) => void, tenantSlug: string }) => {
  const [formData, setFormData] = useState(offering || {});
  const variants = formData?.variants || { sizes: [], fittings: [] };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const data = {
      id: formData.id,
      name: form.get('name'),
      description: form.get('description'),
      price: form.get('price'),
      variants: {
        sizes: (form.get('sizes') as string).split(',').map(s => s.trim()),
        fittings: (form.get('fittings') as string).split(',').map(f => f.trim()),
      },
    };
    onSave(data, tenantSlug);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel mt-4 p-6">
      {/* Form fields... */}
      <button type="submit" className="btn-primary-gradient rounded-lg px-4 py-2">Save</button>
    </form>
  );
};


export default function OfferingsClient({ initialOfferings, saveAction, deleteAction, tenantSlug }: { initialOfferings: any[], saveAction: any, deleteAction: any, tenantSlug: string }) {
  const [offerings, setOfferings] = useState(initialOfferings);

  const handleSave = async (offeringData: any, slug: string) => {
    const result = await saveAction(offeringData, slug);
    if (result.success) {
      // This is a simple way to refresh. A more robust solution might involve
      // re-fetching or optimistic updates.
      window.location.reload(); 
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDelete = async (offeringId: any, slug: string) => {
    if (confirm('Are you sure you want to delete this offering?')) {
      const result = await deleteAction(offeringId, slug);
      if (result.success) {
        setOfferings(offerings.filter(o => o.id !== offeringId));
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  return (
    <div className="glass-panel p-8">
      <h1 className="mb-8 text-3xl font-bold text-[var(--foreground)]">Manage Fashion Offerings</h1>

      <h2 className="mb-4 mt-8 text-2xl font-bold text-[var(--foreground)]">Add New Offering</h2>
      <OfferingForm onSave={handleSave} tenantSlug={tenantSlug} />

      <h2 className="mb-4 mt-8 text-2xl font-bold text-[var(--foreground)]">Existing Offerings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offerings.map((offering) => (
          <div key={offering.id} className="glass-panel p-6">
            <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)]">{offering.name}</h2>
            <p className="mb-4 text-lg text-[var(--muted-foreground)]">{offering.description}</p>
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold text-[var(--foreground)]">${offering.price}</p>
              <button onClick={() => handleDelete(offering.id, tenantSlug)} className="rounded-lg bg-red-500 px-4 py-2 text-white">Delete</button>
            </div>
            <OfferingForm offering={offering} onSave={handleSave} tenantSlug={tenantSlug} />
          </div>
        ))}
      </div>
    </div>
  );
}
