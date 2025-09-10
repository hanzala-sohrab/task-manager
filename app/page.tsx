'use client';

import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import TaskList from './components/TaskList';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');
      
      if (token && storedUser) {
        try {
          // Validate token with backend
          const validateResponse = await fetch('http://localhost:8000/users/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (validateResponse.ok) {
            // Token is valid, restore user session
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid or expired, clear stored data
            console.log('Token validation failed, clearing stored data');
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenType');
            localStorage.removeItem('userData');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          // Clear invalid data on network error or parsing error
          localStorage.removeItem('authToken');
          localStorage.removeItem('tokenType');
          localStorage.removeItem('userData');
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuthStatus();
  }, []);

  const handleAuth = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    
    try {
      if (name) {
        // Sign up flow - you may need to adjust this endpoint based on your backend
        const signupResponse = await fetch('http://localhost:8000/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        });

        if (!signupResponse.ok) {
          const errorData = await signupResponse.json();
          throw new Error(errorData.message || 'Failed to create account');
        }

        const signupData = await signupResponse.json();
        console.log('Signup successful:', signupData);
      }

      // Login flow
      const loginResponse = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: email,
          password: password,
          scope: '',
          client_id: 'string',
          client_secret: '',
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const loginData = await loginResponse.json();
      console.log('Login successful:', loginData);

      // Store user data and token if provided
      const userData = {
        email,
        name: loginData.user?.name || name,
      };

      // Store access token in localStorage if provided by backend
      if (loginData.access_token) {
        localStorage.setItem('authToken', loginData.access_token);
        localStorage.setItem('tokenType', loginData.token_type || 'bearer');
        localStorage.setItem('userData', JSON.stringify(userData));
      }

      setUser(userData);
      setIsAuthenticated(true);
      
      alert(`${name ? 'Account created and signed in' : 'Signed in'} successfully! Welcome${userData.name ? ` ${userData.name}` : ''}!`);
      
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Clear stored token and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userData');
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

  if (isAuthenticated && user) {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      // If no token, sign out
      handleSignOut();
      return null;
    }

    return <TaskList authToken={authToken} onSignOut={handleSignOut} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <AuthForm onSubmit={handleAuth} isLoading={isLoading} />
    </div>
  );
}
