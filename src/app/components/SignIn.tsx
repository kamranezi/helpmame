'use client';

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

// Google SVG Icon component
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.307 9.87C34.666 6.556 29.63 4.5 24 4.5 13.438 4.5 4.5 13.438 4.5 24S13.438 43.5 24 43.5c10.025 0 18.23-7.524 19.611-17.417z"></path>
        <path fill="#FF3D00" d="M43.611 20.083L43.595 20.083C43.595 20.083 43.611 20.083 43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.494 6.494C42.373 36.545 44 32.227 44 27.5c0-3.316-.168-6.446-.389-9.417L43.611 20.083z"></path>
        <path fill="#4CAF50" d="M24 43.5c5.166 0 9.776-1.789 13.04-4.787l-6.494-6.494c-2.008 1.521-4.542 2.453-7.546 2.453-4.522 0-8.38-2.731-9.94-6.522l-6.57 6.57C7.942 39.544 15.336 43.5 24 43.5z"></path>
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.494 6.494C42.373 36.545 44 32.227 44 27.5c0-3.316-.168-6.446-.389-9.417L43.611 20.083z"></path>
    </svg>
);

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phoneAuthInProgress, setPhoneAuthInProgress] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handlePhoneSignIn = async () => {
    setError(null);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
      });
      const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      setConfirmationResult(result);
      setPhoneAuthInProgress(true);
    } catch (error: any) {
        setError(error.message);
    }
  };

  const handleVerifyCode = async () => {
    if (confirmationResult) {
      try {
        await confirmationResult.confirm(code);
        router.push('/');
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      {/* Email/Password Sign In */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-400">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Google Sign In */}
      <button onClick={handleGoogleSignIn} className="w-full p-2 mb-4 border border-gray-300 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-50">
          <GoogleIcon />
          Sign In with Google
      </button>

      {/* Phone Sign In */}
      <div>
        {!phoneAuthInProgress ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="+1 650-555-3434"
              />
            </div>
            <button id="sign-in-with-phone-button" onClick={handlePhoneSignIn} className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Send Verification Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button onClick={handleVerifyCode} className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Verify Code and Sign In
            </button>
          </div>
        )}
      </div>

      <div id="recaptcha-container" className="mt-4"></div>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
