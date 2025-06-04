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
        
        <div style={{ width: '100%', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>User Profile</h2>
          <div style={{ backgroundColor: '#1F1F28', padding: '1rem', borderRadius: '0.5rem' }}>
            {user.data.email && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {user.data.email}
              </p>
            )}
            {user.data.name && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Name:</strong> {user.data.name}
              </p>
            )}
            {invitedBy && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Invited by:</strong> {invitedBy}
              </p>
            )}
            {user.data.sponsor && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Sponsor:</strong> {user.data.sponsor}
              </p>
            )}
            {user.data.interests && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Interests:</strong> {user.data.interests}
              </p>
            )}
            {user.data.signal_id && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Signal ID:</strong> {user.data.signal_id}
              </p>
            )}
            {user.data.organization && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Organization:</strong> {user.data.organization}
              </p>
            )}
          </div>
        </div>
        
        <div style={{ width: '100%', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Invite a User</h2>
          

          
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              Invitee Email
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  backgroundColor: '#1F1F28',
                  color: 'white',
                  border: '1px solid #374151'
                }}
              />
              <button
                onClick={createInvite}
                disabled={isCreatingInvite}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  backgroundColor: isCreatingInvite ? '#4B5563' : '#10B981',
                  color: 'white',
                  border: 'none',
                  cursor: isCreatingInvite ? 'not-allowed' : 'pointer'
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
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              marginTop: '0.5rem'
            }}>
              {errorMessage}
            </div>
          )}
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
