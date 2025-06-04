"use client";

import { useEffect, useState } from 'react';
import { useRownd } from '@rownd/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {
  const { is_authenticated, user, signOut, is_initializing } = useRownd();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!is_initializing && !is_authenticated) {
      router.push('/');
    } else if (!is_initializing) {
      setLoading(false);
    }
  }, [is_authenticated, is_initializing, router]);

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  const generateInviteLink = () => {
    // Generate a unique token for this invitation
    const inviteToken = uuidv4();
    
    // In a real application, you would save this token to a database with an expiration time
    // and associate it with the user who created it
    
    // For demo purposes, we're just creating the link with the token
    const baseUrl = window.location.origin;
    const newInviteLink = `${baseUrl}/register?invite=${inviteToken}`;
    
    setInviteLink(newInviteLink);
    setShowInviteLink(true);
    setCopySuccess(false);
  };
  
  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000); // Reset after 3 seconds
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  const closeInviteModal = () => {
    setShowInviteLink(false);
    setInviteLink(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
      }}>
        <p style={{ color: 'white' }}>Loading...</p>
      </div>
    );
  }

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
          Welcome to Your Dashboard
        </h1>
        
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#1F1F28', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Profile</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <strong>Email:</strong> {user.data.email || 'Not provided'}
            </p>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <strong>Name:</strong> {user.data.first_name ? `${user.data.first_name} ${user.data.last_name || ''}` : 'Not provided'}
            </p>
          </div>
        </div>
        
        <button
          onClick={generateInviteLink}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Invite New User
        </button>
        
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
        
        {/* Invite Link Modal */}
        {showInviteLink && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: '#121212',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              width: '90%',
              maxWidth: '28rem',
              padding: '1.5rem',
              color: 'white',
              position: 'relative'
            }}>
              <button 
                onClick={closeInviteModal}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                One-Time Registration Link
              </h2>
              
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: '#9CA3AF' }}>
                Share this link with the user you want to invite. This link can only be used once for registration.
              </p>
              
              <div style={{
                backgroundColor: '#1F1F28',
                padding: '0.75rem',
                borderRadius: '0.25rem',
                marginBottom: '1rem',
                wordBreak: 'break-all',
                fontSize: '0.75rem'
              }}>
                {inviteLink}
              </div>
              
              <button
                onClick={copyToClipboard}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  backgroundColor: copySuccess ? '#10B981' : '#7C3AED',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
