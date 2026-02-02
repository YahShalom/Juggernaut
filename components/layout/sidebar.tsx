'use client'

import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-800 text-white p-4">
            <nav>
                <ul>
                    <li>
                        <Link href="/esa/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
                    </li>
                    {/* Add more links here as needed */}
                </ul>
            </nav>
        </div>
    );
}
