'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { validatePassword, getPasswordStrength } from '@/app/lib/password-policy';
import { signUpWithPassword } from '@/app/actions/auth';

// A simple UI component for the password strength meter
const StrengthMeter = ({ strength }: { strength: 'Weak' | 'Okay' | 'Strong' }) => {
    const strengthConfig = {
        Weak: { color: 'bg-red-500', label: 'Weak' },
        Okay: { color: 'bg-yellow-500', label: 'Okay' },
        Strong: { color: 'bg-green-500', label: 'Strong' },
    };
    const config = strengthConfig[strength];

    return (
        <div className="flex items-center space-x-2">
            <div className={`w-1/3 h-2 rounded-full ${strength === 'Weak' || strength === 'Okay' || strength === 'Strong' ? config.color : 'bg-gray-200'}`}></div>
            <div className={`w-1/3 h-2 rounded-full ${strength === 'Okay' || strength === 'Strong' ? config.color : 'bg-gray-200'}`}></div>
            <div className={`w-1/3 h-2 rounded-full ${strength === 'Strong' ? config.color : 'bg-gray-200'}`}></div>
            <span className="text-sm text-gray-600 font-medium">{config.label}</span>
        </div>
    );
};

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get('tenant');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { isValid, reasons } = useMemo(() => validatePassword(password, 'adminesa', tenantSlug || undefined), [password, tenantSlug]);
  const strength = getPasswordStrength(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError('For your security, please choose a stronger password.');
      return;
    }

    startTransition(async () => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('tenantSlug', tenantSlug || '');

        const result = await signUpWithPassword(formData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push(`/login?tenant=${tenantSlug}&signup=success`);
        }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Create Your Account</h1>
        <p className="text-center text-gray-600 mb-6">Workspace: <span className="font-semibold text-indigo-600">{tenantSlug}</span></p>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
             <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              aria-describedby="password-rules"
            />
            <p className="mt-2 text-sm text-gray-500">Use at least 12 characters. Mix letters, numbers, and symbols.</p>
          </div>

          {password.length > 0 && (
            <div id="password-rules" className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <StrengthMeter strength={strength} />
                <ul className="text-sm text-gray-700 space-y-1">
                    <li className={`flex items-center ${password.length >= 12 ? 'text-green-600' : 'text-gray-500'}`}>
                       {password.length >= 12 ? '✅' : '–'} 12+ characters
                    </li>
                    <li className={`flex items-center ${reasons.every(r => !r.includes('3 of')) ? 'text-green-600' : 'text-gray-500'}`}>
                        {reasons.every(r => !r.includes('3 of')) ? '✅' : '–'} At least 3 of: uppercase, lowercase, number, symbol
                    </li>
                    <li className={`flex items-center ${reasons.every(r => !r.includes('common')) ? 'text-green-600' : 'text-gray-500'}`}>
                        {reasons.every(r => !r.includes('common')) ? '✅' : '–'} Avoid common passwords
                    </li>
                </ul>
            </div>
          )}

          {error && (
            <div role="alert" aria-live="assertive" className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
                {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !isValid}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
