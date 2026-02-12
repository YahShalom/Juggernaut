
import React from 'react';

export default function ShadowAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-red-600 text-white text-center p-2 font-bold">
        WARNING: SHADOW TENANT ADMINISTRATION
      </div>
      {children}
    </div>
  );
}
