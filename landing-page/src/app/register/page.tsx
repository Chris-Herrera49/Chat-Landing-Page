"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRownd } from '@rownd/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const { is_authenticated, requestSignIn, is_initializing } = useRownd();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invitationToken, setInvitationToken] = useState<string | null>(null);

  // Get invitation token from URL
  useEffect(() => {
    const token = searchParams.get('invite');
    if (token) {
      setInvitationToken(token);
    }
  }, [searchParams]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (is_authenticated && !is_initializing) {
      router.push('/dashboard');
    }
  }, [is_authenticated, is_initializing, router]);
  
  const handleSignIn = () => {
    // Create sign-up options with type assertion to match Rownd's expected types
    const signUpOptions = {
      intent: "sign_up" as any // Using type assertion to avoid TypeScript errors
    };
    
    // Add invitation token if available
    if (invitationToken) {
      // In a real application, you would validate this token against your database
      // and only proceed if it's valid and hasn't been used before
      
      // Note: Rownd doesn't have a built-in invitation token system,
      // so in a real app you would need to implement this on your backend
      // For now, we're just logging the token
      console.log(`Using invitation token: ${invitationToken}`);
      
      // You could pass this as custom data to Rownd
      // signUpOptions.init_data = { inviteToken: invitationToken };
    }
    
    requestSignIn(signUpOptions);
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
          Create a New Account
        </h1>
        
        <div style={{ width: '100%' }}>
          {invitationToken && (
            <div style={{ 
              backgroundColor: '#10B981', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '0.25rem', 
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              <p>You have been invited to create an account!</p>
            </div>
          )}
          
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
            {invitationToken ? 'Accept Invitation & Sign Up' : 'Sign Up with Rownd'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Create an account with your email, phone, or social accounts.
              Your profile information will be securely stored with Rownd.
            </p>
            
            <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
