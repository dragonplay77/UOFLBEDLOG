
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in the root component will handle successful login
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setInfo('');
    if (!email) {
      setError('Enter your email, then click “Forgot password?”.');
      return;
    }
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}`,
        handleCodeInApp: false,
      } as const;
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setInfo('If an account exists, a reset link was sent. Check your email (and spam).');
    } catch (err) {
      setError('Could not send reset email. Verify the address or try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700">
              Hospital Bed Log
            </h1>
            <p className="text-gray-600 mt-2">Please sign in to continue</p>
          </header>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="mt-1 block w-full pr-16 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute inset-y-0 right-0 mt-1 mr-1 px-3 flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-900 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>
            )}
            {info && (
              <p className="text-sm text-green-700 bg-green-100 p-3 rounded-md text-center">{info}</p>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full text-sm text-indigo-700 hover:text-indigo-900 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
         <footer className="text-center mt-12 pb-4">
          <p className="text-sm text-gray-600">Created by Shekib Kohistani.</p>
          <p className="text-sm text-gray-600">For support, contact: <a href="mailto:skbedlog@gmail.com" className="text-indigo-600 hover:text-indigo-800 hover:underline">skbedlog@gmail.com</a></p>
          <p className="text-xs text-gray-500 mt-2">&copy; {new Date().getFullYear()} Hospital Bed Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};