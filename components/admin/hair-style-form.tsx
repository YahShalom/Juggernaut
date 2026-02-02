'use client';

import { HairStyle } from '@/lib/db/schema';

interface HairStyleFormProps {
  style: HairStyle | null;
  categories: any[];
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

export default function HairStyleForm({
  style,
  categories,
  onClose,
  onSubmit,
  isPending,
}: HairStyleFormProps) {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (style?.id) {
        formData.append('id', style.id.toString());
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{style ? 'Edit Hair Style' : 'Create New Hair Style'}</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="style_name">
          Style Name
        </label>
        <input
          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="style_name"
          name="style_name"
          type="text"
          placeholder="e.g., 'Classic Bob'"
          defaultValue={style?.style_name || ''}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="description"
          name="description"
          placeholder="Describe the style"
          defaultValue={style?.description || ''}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
            Category
        </label>
        <select
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="category_id"
            name="category_id"
            defaultValue={style?.category_id || ''}
            required
        >
            <option value="">Select a category</option>
            {categories.map(category => (
                <option key={category.id} value={category.id}>{category.category_name}</option>
            ))}
        </select>
      </div>
      
      <div className="flex items-center justify-end space-x-4">
        <button onClick={onClose} type="button" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200" disabled={isPending}>
          Cancel
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200" type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : (style ? 'Update Style' : 'Create Style')}
        </button>
      </div>
    </form>
  );
}
