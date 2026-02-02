'use client';

import { useState } from 'react';

interface CategoryManagerProps {
  categories: any[];
  onCreate: (formData: FormData) => void;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
}

export default function CategoryManager({ categories, onCreate, onDelete, isPending }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreate = () => {
    if (!newCategoryName.trim()) return;
    const formData = new FormData();
    formData.append('name', newCategoryName);
    onCreate(formData);
    setNewCategoryName('');
  };

  const handleDelete = (id: number) => {
    const formData = new FormData();
    formData.append('id', id.toString());
    onDelete(formData);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Categories</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="border p-2 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleCreate} 
          disabled={isPending || !newCategoryName.trim()} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors duration-200"
        >
          {isPending ? 'Adding...' : 'Add'}
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {categories.map(category => (
          <li key={category.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-700">{category.category_name}</span>
            <button 
              onClick={() => handleDelete(category.id)} 
              className="text-red-500 hover:text-red-700 disabled:text-gray-400 font-semibold"
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
