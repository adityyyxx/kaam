/**
 * Get the backend API URL
 * Uses NEXT_PUBLIC_BACKEND_URL environment variable or defaults to localhost for development
 */
export function getBackendUrl(): string {
  // In browser/client-side, use the environment variable
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  }
  // Server-side fallback
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
}

/**
 * Get the full backend API endpoint URL
 * @param endpoint - API endpoint path (e.g., '/api/v1/auth/google')
 * @returns Full URL to the backend endpoint
 */
export function getBackendApiUrl(endpoint: string): string {
  const backendUrl = getBackendUrl();
  // Remove leading slash from endpoint if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${backendUrl}${cleanEndpoint}`;
}




