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
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 mt-4">
      {/* Form fields... */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Fashion Offerings</h1>

      <h2 className="text-2xl font-bold mt-8 mb-4">Add New Offering</h2>
      <OfferingForm onSave={handleSave} tenantSlug={tenantSlug} />

      <h2 className="text-2xl font-bold mt-8 mb-4">Existing Offerings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offerings.map((offering) => (
          <div key={offering.id} className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-2">{offering.name}</h2>
            <p className="text-lg mb-4">{offering.description}</p>
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">${offering.price}</p>
              <button onClick={() => handleDelete(offering.id, tenantSlug)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
            </div>
            <OfferingForm offering={offering} onSave={handleSave} tenantSlug={tenantSlug} />
          </div>
        ))}
      </div>
    </div>
  );
}
