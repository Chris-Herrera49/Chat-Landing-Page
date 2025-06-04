"use client";

import Image from 'next/image';
import { useEffect } from 'react';
import { useRownd } from '@rownd/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { is_authenticated, requestSignIn, is_initializing } = useRownd();
  const router = useRouter();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (is_authenticated && !is_initializing) {
      router.push('/dashboard');
    }
  }, [is_authenticated, is_initializing, router]);
  
  const handleSignIn = () => {
    requestSignIn();
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
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          Welcome to Irregular Chat
        </h1>
        
        <div style={{ width: '100%' }}>
          <button
            onClick={handleSignIn}
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
            Sign In
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Irregular Chat uses Rownd for secure authentication.
              Sign in with your email, phone, or social accounts.
              Registration is by invitation only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
