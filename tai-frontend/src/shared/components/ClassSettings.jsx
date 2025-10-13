import React, { useState } from "react";  

export const ClassSettings = ({ onClassNameChange }) => {  

    const [newClassName, setNewClassName] = useState(""); 

    const handleClassNameChange = (newName) => {
        setNewClassName(newName);  
        if (onClassNameChange) {
            onClassNameChange(newName);
        }
    };

    return (
        <div className="w-full max-w-2xl"> 
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                Class Settings
            </h3>
            
            <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter a name for your class (if left blank, the class name will
                    stay the same).
                </p>
                
                <div className="space-y-2">
                    <label
                        htmlFor="class-name-input"
                        className="block text-sm font-semibold text-gray-900 dark:text-white mb-1"
                    >
                        Class Name
                    </label>
                    <input
                        id="class-name-input"
                        type="text"
                        placeholder="New Class Name"
                        value={newClassName}
                        onChange={(e) => handleClassNameChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                    dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
                                    focus:ring-blue-500 focus:outline-none transition-all duration-200
                                    hover:border-gray-400 dark:hover:border-gray-500"
                    />
                </div>
            </div>
        </div>
    );
};