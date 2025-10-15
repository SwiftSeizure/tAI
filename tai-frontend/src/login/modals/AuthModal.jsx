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

    if (!isOpen) { 
        return null;
    }

    if (AUTH_TOGGLE) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div 
                    ref={modalRef}
                    className="w-full max-w-md p-4 bg-white/95 backdrop-blur-md border border-gray-200/20 rounded-2xl shadow-2xl sm:p-6 md:p-8 dark:bg-gray-800/95 dark:border-gray-700/20 relative overflow-hidden"
                >
                    {/* FANG Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-green-50/30 to-purple-50/30 animate-gradient-shift pointer-events-none"></div>
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
                    
                    <div className="relative z-10">
                    <form className="space-y-6" onSubmit={isSignupMode ? onAuthEmailPasswordSignup : onAuthEmailPasswordLogin}>
                        <div className="text-center">
                            <h5 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {isSignupMode ? 'Create Your Account' : 'Welcome Back'}
                            </h5>
                            <p className="text-sm text-gray-600 mt-2">
                                {isSignupMode ? 'Join the future of education' : 'Please sign in to continue learning'}
                            </p>
                        </div> 
            
                        {loginError && (
                            <div className="p-3 text-sm text-red-700 bg-red-100/80 backdrop-blur-sm rounded-lg border border-red-200 dark:bg-red-200/80 dark:text-red-800">
                                {loginError}
                            </div>
                        )}

                        {/* Role Selection for Signup */}
                        {isSignupMode && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                    I am a...
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Teacher', 'Student'].map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setSelectedRole(role.toLowerCase())}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                                                selectedRole === role.toLowerCase()
                                                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-md transform scale-105'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className={`text-xl ${
                                                    selectedRole === role.toLowerCase() ? 'text-blue-600' : 'text-gray-500'
                                                }`}>
                                                    {role === 'Teacher' ? '👨‍🏫' : '👨‍🎓'}
                                                </div>
                                                <span>{role}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Full Name for Signup */}
                        {isSignupMode && (
                            <div>
                                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-3 transition-all duration-200 dark:bg-gray-600/70 dark:border-gray-500/50 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        )}

                        {/* Username for Signup */}
                        {isSignupMode && (
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-3 transition-all duration-200 dark:bg-gray-600/70 dark:border-gray-500/50 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                {isSignupMode ? 'Email Address' : 'Your email'}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-3 transition-all duration-200 dark:bg-gray-600/70 dark:border-gray-500/50 dark:placeholder-gray-400 dark:text-white"
                                placeholder={isSignupMode ? "your@email.com" : "name@school.edu"}
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
                                className="bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-3 transition-all duration-200 dark:bg-gray-600/70 dark:border-gray-500/50 dark:placeholder-gray-400 dark:text-white"
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
                                    className="bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 block w-full p-3 transition-all duration-200 dark:bg-gray-600/70 dark:border-gray-500/50 dark:placeholder-gray-400 dark:text-white"
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
                            className="w-full text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300/50 font-semibold rounded-xl text-sm px-5 py-3.5 text-center shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                        >
                            {isLoginLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{isSignupMode ? 'Creating Account...' : 'Signing in...'}</span>
                                </div>
                            ) : (
                                isSignupMode ? 'Create Account' : 'Sign in to your account'
                            )}
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
                            className="w-full flex items-center justify-center gap-3 py-3 px-5 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-300/50 hover:bg-white/90 hover:border-gray-400/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 disabled:opacity-50 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
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

                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
                            {isSignupMode ? (
                                <>
                                    Already have an account?{" "}
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsSignupMode(false);
                                            setSelectedRole('');
                                            setConfirmPassword('');
                                            setFullName('');
                                            setUsername('');
                                        }}
                                        className="text-blue-700 hover:text-blue-800 font-semibold hover:underline dark:text-blue-500 transition-colors duration-200"
                                    >
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>
                                    Not registered?{" "}
                                    <button 
                                        type="button"
                                        onClick={() => setIsSignupMode(true)}
                                        className="text-blue-700 hover:text-blue-800 font-semibold hover:underline dark:text-blue-500 transition-colors duration-200"
                                    >
                                        Create account
                                    </button>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div 
            ref={modalRef}
            className="w-full max-w-sm p-6 bg-white rounded-lg shadow dark:bg-gray-800"
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