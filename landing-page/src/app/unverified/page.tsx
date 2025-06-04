"use client";

import Image from 'next/image';
import { useRownd } from '@rownd/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Unverified() {
  const { signOut } = useRownd();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push('/');
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
          Account Not Verified
        </h1>
        
        <div style={{ 
          backgroundColor: '#1F1F28', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          width: '100%'
        }}>
          <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Your account does not have access to the verified group.
          </p>
          <p style={{ textAlign: 'center' }}>
            Please contact your sponsor to send you an invitation link.
          </p>
        </div>
        
        <button
          onClick={handleSignOut}
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
          Sign Out
        </button>
        
        <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
