'use client';

import { useState, useTransition } from 'react';
import { HairStyle } from '@/lib/db/schema';
import HairStylesTable from '@/components/admin/hair-styles-table';
import HairStyleForm from '@/components/admin/hair-style-form';
import CategoryManager from '@/components/admin/category-manager';
import { createCategory, deleteCategory, saveHairStyle, deleteHairStyle } from './actions';

export default function HairStylesClientPage({
  tenantSlug,
  hairStyles: initialHairStyles,
  categories: initialCategories,
}: {
  tenantSlug: string;
  hairStyles: any[];
  categories: any[];
}) {
  const [selectedStyle, setSelectedStyle] = useState<HairStyle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (style: HairStyle) => {
    setSelectedStyle(style);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedStyle(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedStyle(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    startTransition(async () => {
        formData.append('tenantSlug', tenantSlug);
        const result = await saveHairStyle(formData);
        if (result.success) {
            handleFormClose();
        } else {
            // TODO: Handle error display
            console.error(result.error);
        }
    });
  };

  const handleDelete = async (formData: FormData) => {
    startTransition(async () => {
        formData.append('tenantSlug', tenantSlug);
        if (confirm('Are you sure you want to delete this hair style?')) {
            const result = await deleteHairStyle(formData);
            if (!result.success) {
                // TODO: Handle error display
                console.error(result.error);
            }
        }
    });
  };

  const handleCategoryCreate = async (formData: FormData) => {
    startTransition(async () => {
      formData.append('tenantSlug', tenantSlug);
      const result = await createCategory(formData);
      if (!result.success) {
        console.error(result.error);
      }
    });
  };
  
  const handleCategoryDelete = async (formData: FormData) => {
    startTransition(async () => {
      formData.append('tenantSlug', tenantSlug);
      if (confirm('Are you sure you want to delete this category?')) {
        const result = await deleteCategory(formData);
        if (!result.success) {
          console.error(result.error);
        }
      }
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Hair Styles</h1>
        <button 
          onClick={handleCreateNew} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out"
          disabled={isPending}
        >
          {isPending ? 'Loading...' : 'Add New Style'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isFormOpen ? (
            <HairStyleForm
              key={selectedStyle ? selectedStyle.id : 'new'}
              style={selectedStyle}
              categories={initialCategories}
              onClose={handleFormClose}
              onSubmit={handleFormSubmit}
              isPending={isPending}
            />
          ) : (
            <HairStylesTable 
              styles={initialHairStyles} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              isPending={isPending}
            />
          )}
        </div>
        <div>
          <CategoryManager
            categories={initialCategories}
            onCreate={handleCategoryCreate}
            onDelete={handleCategoryDelete}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
}
