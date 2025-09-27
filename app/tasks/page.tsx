'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskList from '../components/TaskList';

export default function TasksPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');
      
      if (!token || !storedUser) {
        // If no token or user data, redirect to login
        router.push('/login');
        return;
      }

      try {
        // Validate token with backend
        const { authApi } = await import('../services/api');
        const userData = await authApi.validateToken(token);
        setAuthToken(token);
      } catch (error) {
        console.error('Error validating token:', error);
        // Clear invalid data and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('userData');
        router.push('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleSignOut = () => {
    // Clear stored token and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userData');
    router.push('/login');
  };

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!authToken) {
    return null; // Will redirect to login
  }

  return <TaskList authToken={authToken} onSignOut={handleSignOut} />;
}
