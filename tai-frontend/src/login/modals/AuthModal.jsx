import React, { useRef, useEffect, useState } from "react";
import { AUTH_TOGGLE } from "../../auth/auth-toggle";

// Custom hook to detect clicks outside the modal
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export const AuthModal = ({ 
    isOpen, 
    onClose, 
    onAuthEmailPasswordLogin,
    onAuthGoogleLogin,
    onAuthEmailPasswordSignup,
    onAuthGoogleSignup,
    loginError,
    isLoginLoading,
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    selectedRole,
    setSelectedRole,
    fullName,
    setFullName,
    username,
    setUsername,
}) => { 
    
    const modalRef = useRef(null);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    
    useClickOutside(modalRef, onClose);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) { 
        return null;
    }

    if (AUTH_TOGGLE) {
        return (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
                <div 
                    ref={modalRef}
                    className="relative w-full max-w-md max-h-[90vh] bg-white rounded-lg shadow-lg dark:bg-gray-800 overflow-hidden flex flex-col"
                >
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white z-10"
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    {/* Scrollable content */}
                    <div className="overflow-y-auto p-6 sm:p-8">
                        <form className="space-y-4" onSubmit={isSignupMode ? onAuthEmailPasswordSignup : onAuthEmailPasswordLogin}>
                            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                                {isSignupMode ? 'Create Your Account' : 'Please Sign in to Continue Learning'}
                            </h5> 
                
                            {loginError && (
                                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                                    {loginError}
                                </div>
                            )}

                            {/* Role Selection for Signup */}
                            {isSignupMode && (
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        I am a...
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Teacher', 'Student'].map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setSelectedRole(role.toLowerCase())}
                                                className={`p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                                                    selectedRole === role.toLowerCase()
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                        : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Full Name and Username for Signup */}
                            {isSignupMode && (
                                <>
                                    <div>
                                        <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="johndoe"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="name@school.edu"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    {isSignupMode ? 'Create Password' : 'Your password'}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Confirm Password for Signup */}
                            {isSignupMode && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        required
                                    />
                                </div>
                            )}

                            {!isSignupMode && (
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                        />
                                    </div>
                                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Remember me
                                    </label>
                                    <a href="#" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoginLoading || (isSignupMode && (!selectedRole || password !== confirmPassword))}
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                            >
                                {isLoginLoading ? (isSignupMode ? 'Creating Account...' : 'Signing in...') : (isSignupMode ? 'Create Account' : 'Sign in to your account')}
                            </button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500 dark:bg-gray-800">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={isSignupMode ? onAuthGoogleSignup : onAuthGoogleLogin}
                                disabled={isLoginLoading}
                                className="w-full flex items-center justify-center gap-3 py-2.5 px-5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                            >
                                <img 
                                    src="https://www.google.com/favicon.ico" 
                                    alt="Google" 
                                    className="w-5 h-5"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://www.google.com/favicon.ico';
                                    }}
                                />
                                <span>{isSignupMode ? 'Sign up with Google' : 'Sign in with Google'}</span>
                            </button>

                            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                {isSignupMode ? (
                                    <>
                                        Already have an account?{" "}
                                        <a 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsSignupMode(false);
                                                setSelectedRole('');
                                                setConfirmPassword('');
                                                setFullName('');
                                                setUsername('');
                                            }}
                                            className="text-blue-700 hover:underline dark:text-blue-500"
                                        >
                                            Sign in
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        Not registered?{" "}
                                        <a 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsSignupMode(true);
                                            }}
                                            className="text-blue-700 hover:underline dark:text-blue-500"
                                        >
                                            Create account
                                        </a>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // TODO: Remove Fallback for when AUTH_TOGGLE is false
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
            <div 
                ref={modalRef}
                className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800"
            >
                <h5 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                    Authentication Disabled
                </h5>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Authentication is currently disabled. Click below to continue.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAuthEmailPasswordLogin}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};