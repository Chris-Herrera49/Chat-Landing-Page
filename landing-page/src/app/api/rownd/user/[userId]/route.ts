import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get userId from params - no need to await params.userId in Next.js 14+
    const { userId } = params;
    const appKey = process.env.NEXT_PUBLIC_ROWND_APP_KEY;
    const appSecret = process.env.ROWND_APP_SECRET;
    const appId = process.env.NEXT_PUBLIC_ROWND_APP_ID;
    
    if (!appKey || !appSecret || !appId) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }
    
    console.log(`Fetching user details for: ${userId}`);
    console.log(`Using app ID: ${appId}`);
    
    // Use the correct headers as shown in the example
    const response = await fetch(`https://api.rownd.io/applications/${appId}/users/${userId}/data`, {
      method: 'GET',
      headers: {
        'x-rownd-app-key': appKey,
        'x-rownd-app-secret': appSecret
      }
    });
    
    if (!response.ok) {
      const status = response.status;
      console.error(`API error ${status} when fetching user details`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return NextResponse.json(
        { error: `Failed to fetch user details (${status})` }, 
        { status }
      );
    }
    
    const data = await response.json();
    console.log('Successfully fetched user data');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' }, 
      { status: 500 }
    );
  }
}
