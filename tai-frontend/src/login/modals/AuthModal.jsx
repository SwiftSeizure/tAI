import React, { useRef, useEffect } from "react";
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
    loginError,
    isLoginLoading,
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
}) => { 
    
    const modalRef = useRef(null);
    useClickOutside(modalRef, onClose);

    if (!isOpen) { 
        return null;
    }

    if (AUTH_TOGGLE) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div 
                    ref={modalRef}
                    className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
                >
                    <form className="space-y-6" onSubmit={onAuthEmailPasswordLogin}>
                        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                            Please Sign in to Continue Learning
                        </h5> 
            
                        {loginError && (
                            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                                {loginError}
                            </div>
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
                                Your password
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

                        <button
                            type="submit"
                            disabled={isLoginLoading}
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                        >
                            {isLoginLoading ? 'Signing in...' : 'Sign in to your account'}
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
                            onClick={onAuthGoogleLogin}
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
                            <span>Sign in with Google</span>
                        </button>

                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Not registered?{" "}
                            <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">
                                Create account
                            </a>
                        </div>
                    </form>
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