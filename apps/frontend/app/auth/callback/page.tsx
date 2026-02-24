'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getBackendApiUrl } from '@/lib/api-config';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Google sign-in failed. Please try again.');
        router.push('/signin');
        return;
      }

      if (!token) {
        toast.error('No authentication token received.');
        router.push('/signin');
        return;
      }

      // Decode URL-encoded token if needed
      const decodedToken = decodeURIComponent(token);
      
      // Save token
      localStorage.setItem('token', decodedToken);
      setStatus('Getting your workspace ready...');
      
      // Debug: Log token (first 20 chars only for security)
      console.log('Token received (first 20 chars):', decodedToken.substring(0, 20) + '...');
      console.log('Decoded token:', decodedToken);
      try {
        // Get or create a chat room
        const roomResp = await fetch(getBackendApiUrl('/api/v1/getRooms'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': decodedToken
          }
        });

        if (!roomResp.ok) {
          let errorData;
          const contentType = roomResp.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            try {
              errorData = await roomResp.json();
            } catch {
              errorData = { error: `HTTP ${roomResp.status}: ${roomResp.statusText}` };
            }
          } else {
            const text = await roomResp.text();
            errorData = { error: text || `HTTP ${roomResp.status}: ${roomResp.statusText}` };
          }
          console.error('Failed to get rooms:', {
            status: roomResp.status,
            statusText: roomResp.statusText,
            errorData
          });
          throw new Error(errorData.error || `Failed to get rooms: ${roomResp.status} ${roomResp.statusText}`);
        }

        const roomData = await roomResp.json();
        let roomId = roomData.roomId;
        console.log("roomId: ", roomId);

        // If no room exists, create one
        if (!roomId) {
          setStatus('Creating your first workspace...');
          const createResp = await fetch(getBackendApiUrl('/api/v1/createChatRoom'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': decodedToken
            }
          });

          if (!createResp.ok) {
            let errorData;
            const contentType = createResp.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              try {
                errorData = await createResp.json();
              } catch {
                errorData = { error: `HTTP ${createResp.status}: ${createResp.statusText}` };
              }
            } else {
              const text = await createResp.text();
              errorData = { error: text || `HTTP ${createResp.status}: ${createResp.statusText}` };
            }
            console.error('Failed to create room:', {
              status: createResp.status,
              statusText: createResp.statusText,
              errorData
            });
            throw new Error(errorData.error || `Failed to create room: ${createResp.status} ${createResp.statusText}`);
          }

          const createData = await createResp.json();
          roomId = createData.chatRoomId;
        }

        toast.success('Signed in successfully!');
        router.push(`/dashboard/c/${roomId}`);
      } catch (err) {
        console.error('Auth callback error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to complete sign in. Please try again.';
        toast.error(errorMessage);
        router.push('/signin');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{status}</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}