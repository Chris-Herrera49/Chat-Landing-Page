"use client";

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    signalId: '',
    intro: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:9000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          full_name: formData.name,
          email: formData.email,
          attributes: {
            signal_id: formData.signalId,
            intro: formData.intro,
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      signalId: '',
      intro: ''
    });
    setError('');
    setSuccess(false);
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
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem', display: 'block' }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem', display: 'block' }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
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
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem', display: 'block' }}>
              Signal ID
            </label>
            <input
              type="text"
              name="signalId"
              value={formData.signalId}
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
          
          {/* Sponsor Signal ID field removed */}
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.25rem', display: 'block' }}>
              Intro
            </label>
            <textarea
              name="intro"
              value={formData.intro}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#1F1F28',
                border: 'none',
                borderRadius: '0.25rem',
                color: 'white',
                minHeight: '5rem',
                resize: 'vertical'
              }}
            />
          </div>
          
          {error && (
            <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ color: '#10B981', marginBottom: '1rem', fontSize: '0.875rem' }}>
              Account created successfully!
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>
              Back to Login
            </Link>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  backgroundColor: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
