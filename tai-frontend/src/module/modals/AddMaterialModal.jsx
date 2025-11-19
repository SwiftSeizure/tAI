import React, { useState, useEffect, useRef } from 'react';   

export default function AddMaterialModal({ isOpen, onClose, onAddMaterial }) {    

    const [newMaterialName, setNewMaterialName] = useState('');  
    const [selectedFile, setSelectedFile] = useState(null);
    const modalRef = useRef(null);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            setNewMaterialName('');
            setSelectedFile(null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Optionally set the material name from the filename
            if (!newMaterialName) {
                setNewMaterialName(file.name.split('.')[0]);
            }
        }
    };

    const handleAddMaterial = () => { 
        if (!newMaterialName.trim()) return;
        
        const materialData = {
            name: newMaterialName.trim(),
            file: selectedFile
        }; 
        
        onAddMaterial(materialData);
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && selectedFile) {
            handleAddMaterial();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            id="add-material-modal"
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
                            Add Material
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
                        {/* Material Name Input */}
                        <div>
                            <label 
                                htmlFor="material-name" 
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Material Name
                            </label>
                            <input
                                type="text"
                                id="material-name"
                                placeholder="Enter material name"
                                value={newMaterialName}
                                onChange={(e) => setNewMaterialName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                autoFocus
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label 
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Upload File
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="material-file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="material-file"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:border-blue-500"
                                >
                                    <svg 
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                        />
                                    </svg>
                                    <span>{selectedFile ? 'Change File' : 'Choose File'}</span>
                                </label>
                            </div>
                            {selectedFile && (
                                <div className="mt-3 flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800">
                                    <svg 
                                        className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                        />
                                    </svg>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium truncate">
                                        {selectedFile.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal footer */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            onClick={handleAddMaterial}
                            disabled={!selectedFile}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Upload Material
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