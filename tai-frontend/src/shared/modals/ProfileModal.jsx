import React, { useRef, useEffect, useState } from "react"; 

export default function ProfileModal({ isOpen, onClose, onSaveInformation, user }) {
    const modalRef = useRef(null);  

    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [newEmail, setNewEmail] = useState(user?.email || "");
    const [profilePictureURL, setProfilePictureURL] = useState(user?.photoURL || ""); 
    const [password, setPassword] = useState("");

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
            setDisplayName(user?.displayName || "");
            setNewEmail(user?.email || "");
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, user]);

    const handleSave = async () => {
        if (onSaveInformation) {
            await onSaveInformation(profilePictureURL, displayName, newEmail, password);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            id="profile-modal"
            tabIndex="-1"
            aria-hidden={!isOpen}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4"
        >
            <div 
                ref={modalRef}
                className="relative w-full max-w-2xl bg-white rounded-lg shadow dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-600">
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
                    <div className="space-y-4">
                        {/* Avatar */}  

                        {/* TODO: Add avatar upload */} 
                        <div className="flex justify-center"> 
                            <div className="relative w-24 h-24">
                                {user?.photoURL ? (
                                    <div className="w-full h-full p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500">
                                        <img 
                                            src={user.photoURL} 
                                            alt="Profile" 
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full">
                                        <div className="absolute inset-0 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" />
                                        <div className="relative flex items-center justify-center w-full h-full overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                            <span className="text-4xl font-medium text-gray-600 dark:text-gray-300">
                                                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}
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

                        {/* Email*/}
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
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    {newEmail !== user.email && (
                        <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-200 dark:border-red-800">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full mr-2">
                                    <svg
                                        className="w-5 h-5 text-red-600 dark:text-red-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-medium">Security Verification Required</span>
                            </div>
                            <div className="mt-2 ">
                                <div className="space-y-2">
                                    <div>
                                        <label 
                                            htmlFor="password" 
                                            className="block text-sm font-medium text-red-700 dark:text-red-400"
                                        >
                                            Enter your current password to confirm email change
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">

                                            <input
                                                type="password"
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)} 
                                                placeholder="••••••••"
                                                className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            For security reasons, please verify your identity to change your email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal footer */}
                    <div className="flex items-center pt-4 border-t border-gray-200 dark:border-gray-600">
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