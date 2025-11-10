import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="text-center max-w-md space-y-6">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-blue-700 dark:text-blue-600">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Page Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="pt-4">
                    <Link to="/">
                        <button 
                            type="button"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl 
                                       shadow-md hover:shadow-lg transition-all duration-200 focus:ring-4 
                                       focus:ring-blue-300 focus:outline-none"
                        >
                            Back to Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
