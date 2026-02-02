import { verifyInvite } from '@/lib/auth/verifyInvite';

export default async function InvitePage({ params }: { params: { token: string } }) {
  const result = await verifyInvite(params.token);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {result.success ? (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">Welcome!</h1>
            <p className="text-gray-700 mb-6">You have successfully joined the tenant: <strong>{result.tenantName}</strong>.</p>
            <a 
              href={`/${result.tenantSlug}/dashboard`}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Go to Dashboard
            </a>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invite Invalid or Expired</h1>
            <p className="text-gray-700">This invite link is no longer valid. Please request a new one.</p>
          </>
        )}
      </div>
    </div>
  );
}
