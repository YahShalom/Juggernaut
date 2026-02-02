'use client';

import { HairStyle } from '@/lib/db/schema';

interface HairStylesTableProps {
  styles: any[]; // Using any to accommodate joined data
  onEdit: (style: HairStyle) => void;
  onDelete: (formData: FormData) => void;
  isPending: boolean;
}

export default function HairStylesTable({ styles, onEdit, onDelete, isPending }: HairStylesTableProps) {

  const handleDelete = (id: number) => {
    const formData = new FormData();
    formData.append('id', id.toString());
    onDelete(formData);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {styles.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                No hair styles found. Add one to get started!
              </td>
            </tr>
          ) : (
            styles.map(style => (
              <tr key={style.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{style.style_name}</div>
                  <div className="text-sm text-gray-500">{style.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {style.hair_style_categories?.category_name || 'Uncategorized'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button 
                    onClick={() => onEdit(style)} 
                    className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400"
                    disabled={isPending}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(style.id)} 
                    className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                    disabled={isPending}
                  >
                    {isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
