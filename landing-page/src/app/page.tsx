"use client";

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // This would be replaced with actual authentication logic
      const response = await fetch('http://localhost:9000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      
      // Redirect to dashboard or home page after successful login
      window.location.href = '/dashboard';
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
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          Welcome to Irregular Chat
        </h1>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem', display: 'block' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem', display: 'block' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
          
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <Link href="/forgot-password" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>
              Forgot Password?
            </Link>
          </div>
          
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: '#7C3AED', textDecoration: 'none' }}>
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
