import React, { useRef, useEffect, useState } from "react";

export default function ProfileModal({ isOpen, onClose, onChangeDisplayName, currentUser }) {
    const modalRef = useRef(null);
    const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
    const [email, setEmail] = useState(currentUser?.email || "");

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
            // Update local state when modal opens
            setDisplayName(currentUser?.displayName || "");
            setEmail(currentUser?.email || "");
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, currentUser]);

    const handleSave = () => {
        if (onChangeDisplayName) {
            onChangeDisplayName(displayName);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            id="profile-modal"
            tabIndex="-1"
            aria-hidden={!isOpen}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
        >
            <div 
                ref={modalRef}
                className="relative p-4 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Profile Settings
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-200"
                            aria-label="Close modal"
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
                    </div>
                    
                    {/* Modal body */}
                    <div className="p-4 md:p-5 space-y-4">
                        {/* Avatar */} 
                        {/* TODO: Add avatar upload */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                    {currentUser?.photoURL ? (
                                        <img 
                                            src={currentUser.photoURL} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg
                                            className="w-12 h-12 text-gray-400 dark:text-gray-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Display Name */}
                        <div>
                            <label 
                                htmlFor="display-name" 
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="display-name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Enter your display name"
                            />
                        </div>

                        {/* Email (read-only at the moment) */}
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                readOnly
                                className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Email cannot be changed yet
                            </p>
                        </div>
                    </div>

                    {/* Modal footer */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            onClick={handleSave}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={onClose}
                            type="button"
                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}