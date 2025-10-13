import React, { useState, useEffect, useRef } from 'react';

export default function AddModuleModal({ isOpen, onClose, onAddModule }) { 
    const [newModalName, setNewModalName] = useState(''); 
    const modalRef = useRef(null);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    // Reset the form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setNewModalName('');
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

    const handleAddModule = () => { 
        if (!newModalName.trim()) return; // Prevent empty module names
        onAddModule(newModalName.trim());
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddModule();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            id="add-module-modal"
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
                            Add Module
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
                        <div>
                            <label 
                                htmlFor="module-name" 
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Module Name
                            </label>
                            <input
                                type="text"
                                id="module-name"
                                placeholder="Enter module name"
                                value={newModalName}
                                onChange={(e) => setNewModalName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Modal footer */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            onClick={handleAddModule}
                            disabled={!newModalName.trim()}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Module
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