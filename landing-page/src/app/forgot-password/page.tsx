"use client";

import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRownd } from '@rownd/react';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const { requestSignIn, is_authenticated, is_initializing } = useRownd();
  const router = useRouter();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (is_authenticated && !is_initializing) {
      router.push('/dashboard');
    }
  }, [is_authenticated, is_initializing, router]);
  
  const handleResetPassword = () => {
    requestSignIn({
      // Using string literal for intent as Rownd expects
      intent: "reset_password" as any // Type assertion to avoid TypeScript error
    });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#121212',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '28rem',
        padding: '1.5rem',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ marginBottom: '1rem', width: '120px', height: '80px', position: 'relative' }}>
          <Image 
            src="/irregular_chat_logo.png" 
            alt="Irregular Chat Logo" 
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          Reset Your Password
        </h1>
        
        <p style={{ color: '#9CA3AF', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Click the button below to reset your password with Rownd.
        </p>
        
        <div style={{ width: '100%' }}>
          <button
            onClick={handleResetPassword}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              backgroundColor: '#7C3AED',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Reset Password
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
