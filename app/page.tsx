'use client';

import { useActionState } from 'react';
import { signInWithEmail } from '@/app/auth/actions';

const initialState = { success: false, errors: {} };

export default function LoginPage() {
  const [state, formAction] = useActionState(signInWithEmail, initialState);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center mb-8">
          <div className="text-base sm:text-lg font-semibold tracking-wide text-gray-800 dark:text-zinc-100">
            Carai Agency | Caribbean AI Agency
          </div>
          <div className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
            Where Caribbean Spirit Meets Intelligence
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50 mt-5">Admin ESA</h1>
          <p className="text-gray-600 dark:text-zinc-300 mt-2">Sign in to your workspace</p>
        </div>
        
        <form action={formAction} className="bg-white/90 dark:bg-zinc-900/70 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 space-y-6">
          <div>
            <label htmlFor="workspace" className="block text-sm font-medium text-gray-700 dark:text-zinc-200">Workspace</label>
            <input
              id="workspace"
              name="workspace"
              type="text"
              placeholder="your-workspace-name"
              className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-describedby="workspace-error"
            />
            {state?.errors?.workspace && (
              <p id="workspace-error" className="text-sm text-red-600 mt-1">{state.errors.workspace[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-200">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-describedby="email-error"
              required
            />
            {state?.errors?.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-zinc-950 disabled:opacity-50 transition-colors"
          >
            Sign In with Email
          </button>
          
          {state?.errors?._general && (
            <p className="text-sm text-red-600 text-center pt-2">{state.errors._general[0]}</p>
          )}
        </form>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md text-sm text-yellow-800">
            <strong>Development Hint:</strong> Use workspace <code>perrydbeauty</code> to sign in to the demo account.
          </div>
        )}
      </div>
    </div>
  );
}
