"use client";

import { useEffect, useState } from 'react';
import { useRownd } from '@rownd/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Dashboard() {
  const { is_authenticated, user, signOut, is_initializing, getAccessToken } = useRownd();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [invitedBy, setInvitedBy] = useState<string | null>(null);
  // Using the specific group ID provided
  const groupId = 'group_fym0bz1znnk0uiwjrc7zhk94';

  // Function to check if user is in the verified group
  const checkUserVerification = async () => {
    try {
      const accessToken = await getAccessToken();
      
      // Fetch user's groups
      const response = await fetch('https://api.rownd.io/me/groups', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch groups`);
      }
      
      const data = await response.json();
      
      // Check if user is in the verified group AND has active status (not pending)
      let isVerified = false;
      let inviterInfo = null;
      
      if (data.results && data.results.length > 0) {
        for (const result of data.results) {
          if (result.group && 
              result.group.id === groupId && 
              result.member && 
              result.member.state === 'active') {
            
            isVerified = true;
            
            // Try to get inviter information
            if (result.member.invited_by) {
              inviterInfo = result.member.invited_by;
            }
            
            break;
          }
        }
      }
      
      if (!isVerified) {
        // Redirect to unverified page
        router.push('/unverified');
      } else {
        // If we have inviter info, extract just the user_ part and fetch the details
        if (inviterInfo && typeof inviterInfo === 'string') {
          // Format can be either "app_{appID}:user:user_{userId}" or just "user_{userId}"
          // First, try to extract from the complex format
          let extractedUserId = null;
          
          // Try to match the full format first
          const fullFormatMatch = inviterInfo.match(/app_[\w]+:user:user_([\w]+)/);
          if (fullFormatMatch && fullFormatMatch.length > 1) {
            extractedUserId = `user_${fullFormatMatch[1]}`;
          } else {
            // Try to match just the user_ID format
            const simpleFormatMatch = inviterInfo.match(/user_([\w]+)/);
            if (simpleFormatMatch && simpleFormatMatch.length > 1) {
              extractedUserId = `user_${simpleFormatMatch[1]}`;
            }
          }
          
          if (extractedUserId) {
            fetchInviterDetails(extractedUserId);
          } else {
            // If we can't extract the user ID, just use the original string
            setInvitedBy(`User ID: ${inviterInfo}`);
          }
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      // On error, assume not verified
      router.push('/unverified');
    }
  };
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!is_authenticated && !is_initializing) {
      router.push('/');
    } else if (is_authenticated && !is_initializing) {
      // Check if user is verified
      checkUserVerification();
    }
  }, [is_authenticated, is_initializing, router]);

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  const createInvite = async () => {
    if (!inviteEmail) {
      alert('Please enter an email address');
      return;
    }
    
    setIsCreatingInvite(true);
    setErrorMessage(null);
    
    try {
      // Get the user's access token
      const accessToken = await getAccessToken();
      
      // Make API request to create an invite
      const response = await fetch(`https://api.rownd.io/me/groups/${groupId}/invites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roles: ['owner'],
          email: inviteEmail,
          redirect_url: `${window.location.origin}/register`
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMsg = `Error ${response.status}: `;
        
        if (response.status === 403) {
          errorMsg += "You don't have permission to create invites for this group. ";
          errorMsg += "Please check if the group exists and if you have the necessary permissions.";
        } else if (errorData && errorData.message) {
          errorMsg += errorData.message;
        } else {
          errorMsg += "Failed to create invite.";
        }
        
        setErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      
      // Show the invite link
      setInviteLink(data.link);
      setShowInviteLink(true);
      setInviteEmail('');
    } catch (error) {
      console.error('Error creating invite:', error);
      if (!errorMessage) {
        setErrorMessage('Failed to create invite. Please try again.');
      }
    } finally {
      setIsCreatingInvite(false);
    }
  };
  
  const closeInviteModal = () => {
    setShowInviteLink(false);
    setInviteLink(null);
  };
  
  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Function to fetch inviter details using our API route
  const fetchInviterDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/rownd/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch user details`);
      }
      
      const data = await response.json();
      
      // Extract email from user data
      if (data && data.data && data.data.email) {
        setInvitedBy(data.data.email);
      } else {
        // Fallback to user ID if email not available
        setInvitedBy(`${userId}`);
      }
    } catch (error) {
      console.error('Error fetching inviter details:', error);
      // Fallback to user ID on error
      setInvitedBy(`${userId}`);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#121212',
      }}>
        <p style={{ color: 'white' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#121212',
      color: 'white',
    }}>
      {/* App Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#1F1F28',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        {/* Logo */}
        <div style={{ height: '40px', width: '40px', position: 'relative' }}>
          <Image 
            src="/irregular_chat_logo.png" 
            alt="Logo" 
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        {/* User Profile and Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Settings Button with Material UI style settings icon */}
          <button style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            padding: 0,
            borderRadius: '50%',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          
          {/* Sign Out Button with Material UI style logout icon */}
          <button 
            onClick={handleSignOut}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              padding: 0,
              borderRadius: '50%',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
          
          {/* User Email */}
          <span style={{ fontWeight: '500' }}>
            {user.data.email || 'User'}
          </span>
          
          {/* Profile Picture - using first letter of name as placeholder */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}>
            {user.data.name ? user.data.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ padding: '2rem', flex: 1 }}>
        {/* Knowledge Management Section */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Knowledge Management
        </h2>
        
        {/* Knowledge Management Apps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {/* Forum App */}
          <div style={{
            backgroundColor: '#1F1F28',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#2D2D3A',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1rem',
            }}>
              F
            </div>
            <span style={{ fontWeight: '500' }}>Forum</span>
          </div>
        </div>
        
        {/* Communication Section */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem' }}>
          Communication
        </h2>
        
        {/* Communication Apps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {/* Signal App */}
          <div style={{
            backgroundColor: '#1F1F28',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#2D2D3A',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1rem',
            }}>
              S
            </div>
            <span style={{ fontWeight: '500' }}>Signal</span>
          </div>
          
          {/* Matrix App */}
          <div style={{
            backgroundColor: '#1F1F28',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#2D2D3A',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1rem',
            }}>
              M
            </div>
            <span style={{ fontWeight: '500' }}>Matrix</span>
          </div>
        </div>
        
        {/* User Profile Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>User Profile</h2>
          <div style={{ 
            backgroundColor: '#1F1F28', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            maxWidth: '600px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {user.data.email && (
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</p>
                  <p>{user.data.email}</p>
                </div>
              )}
              {user.data.name && (
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Name</p>
                  <p>{user.data.name}</p>
                </div>
              )}
              {invitedBy && (
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Invited by</p>
                  <p>{invitedBy}</p>
                </div>
              )}
              {user.data.organization && (
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Organization</p>
                  <p>{user.data.organization}</p>
                </div>
              )}
              {user.data.signal_id && (
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Signal ID</p>
                  <p>{user.data.signal_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Invite Section */}
        <div style={{ marginBottom: '2rem', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Invite a User</h2>
          <div style={{ 
            backgroundColor: '#1F1F28', 
            padding: '1.5rem', 
            borderRadius: '0.5rem' 
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Invitee Email
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    backgroundColor: '#2D2D3A',
                    color: 'white',
                    border: '1px solid #374151'
                  }}
                />
                <button
                  onClick={createInvite}
                  disabled={isCreatingInvite}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: isCreatingInvite ? '#4B5563' : '#7C3AED',
                    color: 'white',
                    border: 'none',
                    cursor: isCreatingInvite ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                  }}
                >
                  {isCreatingInvite ? 'Creating...' : 'Create Invite'}
                </button>
              </div>
            </div>
            
            {errorMessage && (
              <div style={{
                backgroundColor: '#7F1D1D',
                color: '#FCA5A5',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                marginTop: '1rem'
              }}>
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
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
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: '#1F1F28',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            width: '90%',
            maxWidth: '500px',
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Group Invite Link</h2>
            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
              Share this link with the person you want to invite to the group.
            </p>
            
            <div style={{
              backgroundColor: '#111827',
              borderRadius: '0.25rem',
              padding: '0.75rem',
              marginBottom: '1rem',
              wordBreak: 'break-all',
              fontSize: '0.875rem'
            }}>
              {inviteLink}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={copyToClipboard}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              
              <button
                onClick={closeInviteModal}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
