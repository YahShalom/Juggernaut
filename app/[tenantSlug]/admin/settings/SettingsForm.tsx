'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/app/hooks/useApi';

export default function SettingsForm({ skin, onSave, tenantSlug }: { skin: any, onSave: (brand_json: any, tenantSlug: string) => Promise<any>, tenantSlug: string }) {
  const [formData, setFormData] = useState(skin);
  const [isSaving, setIsSaving] = useState(false);
  const { apiFetch } = useApi();

  useEffect(() => {
    setFormData(skin);
  }, [skin]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // This action is just a placeholder and does not exist.
      // It is used to demonstrate the use of the useApi hook.
      await apiFetch(`/api/tenant/${tenantSlug}/settings`, {
          method: 'POST',
          body: JSON.stringify(formData),
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      // No alert here since the modal will handle it
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setFormData((prev: any) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 mt-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="primary_color"
            className="block text-lg mb-2"
          >
            Primary Color
          </label>
          <input
            type="color"
            id="primary_color"
            name="colors.primary"
            value={formData.colors.primary}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800/50"
          />
        </div>
        <div>
          <label
            htmlFor="secondary_color"
            className="block text-lg mb-2"
          >
            Secondary Color
          </label>
          <input
            type="color"
            id="secondary_color"
            name="colors.secondary"
            value={formData.colors.secondary}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-800/50"
          />
        </div>
      </div>
      {/* ... other form fields ... */}
      <button
        type="submit"
        disabled={isSaving}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
