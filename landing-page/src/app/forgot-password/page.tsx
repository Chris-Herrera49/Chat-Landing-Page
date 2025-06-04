"use client";

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // This would be replaced with actual password reset logic
      const response = await fetch('http://localhost:9000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send password reset email');
      }
      
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {!success ? (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem', display: 'block' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#1F1F28',
                  border: 'none',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
                required
              />
            </div>
            
            {error && (
              <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                backgroundColor: '#7C3AED',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: '1rem'
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#10B981', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Password reset link sent! Check your email for instructions.
            </div>
            
            <Link href="/" style={{ color: '#7C3AED', textDecoration: 'none', fontSize: '0.875rem' }}>
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
