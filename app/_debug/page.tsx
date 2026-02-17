'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

type OtpTestResult = { data: any; error: any } | null;

export default function DebugPage() {
  const [otpTestResult, setOtpTestResult] = useState<OtpTestResult>(null);
  const [isTestingOtp, setIsTestingOtp] = useState(false);
  const [locationInfo, setLocationInfo] = useState({ href: '', origin: '', hostname: '' });
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    const origin = window.location.origin;
    setLocationInfo({
      href: window.location.href,
      origin: origin,
      hostname: window.location.hostname,
    });
    setRedirectUrl(`${origin}/auth/callback`);
  }, []);

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }
    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  const handleOtpTest = async () => {
    if (!supabase) return;
    setIsTestingOtp(true);
    setOtpTestResult(null);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: 'test@example.com',
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      setOtpTestResult({ data, error });
    } catch (e: any) {
      setOtpTestResult({ data: null, error: { message: e.message, ...e } });
    } finally {
      setIsTestingOtp(false);
    }
  };

  const isCloudWorkstation = locationInfo.hostname.endsWith('cloudworkstations.dev');
  const isFirebaseStudio = locationInfo.hostname.endsWith('studio.firebase.google.com');

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Page</h1>
      <h2>Location Info</h2>
      <pre>{JSON.stringify(locationInfo, null, 2)}</pre>
      <h2>Environment</h2>
      <p>NODE_ENV: {process.env.NODE_ENV}</p>
      <p>isCloudWorkstation: {String(isCloudWorkstation)}</p>
      <p>isFirebaseStudio: {String(isFirebaseStudio)}</p>
      <h2>Supabase</h2>
      <p>NEXT_PUBLIC_SUPABASE_URL defined? {String(!!process.env.NEXT_PUBLIC_SUPABASE_URL)}</p>
      <p>NEXT_PUBLIC_SUPABASE_ANON_KEY defined? {String(!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}</p>
      <h2>OTP Test</h2>
        <p>Redirect URL: {redirectUrl}</p>
        <button onClick={() => navigator.clipboard.writeText(redirectUrl)}>Copy Redirect URL</button>
      <button onClick={handleOtpTest} disabled={isTestingOtp}>
        {isTestingOtp ? 'Testing...' : 'Test OTP'}
      </button>
      {otpTestResult && (
        <div>
          <h2>OTP Test Result</h2>
          <pre>{JSON.stringify({ ...otpTestResult, ...locationInfo}, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
