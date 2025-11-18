// src/shared/modals/VerificationModal.jsx
import React, { useRef, useEffect } from 'react';

export default function VerificationModal({ isOpen, onClose, newEmail }) { 

    const modalRef = useRef(null);

    const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
              onClose();
          }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    
    if (!isOpen) return null;

    return ( 
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
            <div 
                ref={modalRef} 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 md:p-8 border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="space-y-6">
                        {/* Title - Centered */}
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                Verify Your Email
                            </h3>
        
                            {/* Message Content */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                We've sent a verification email to{' '}
                                <span className="font-medium text-gray-900 dark:text-white">{newEmail}</span>.
                                Please check your inbox and follow the instructions to verify your new email address.
                            </p>
        
                            {/* Button - Centered */}
                            <div className="flex justify-center">
                                <button
                                    onClick={onClose}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Got it
                                </button>
                            </div>
                    </div>
                </div>
            </div> 
        </div>
    );
}