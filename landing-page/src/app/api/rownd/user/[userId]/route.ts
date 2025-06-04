import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { userId: string } }) {
  try {
    // Properly await params before accessing its properties
    const params = await context.params;
    const userId = params.userId;
        
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
