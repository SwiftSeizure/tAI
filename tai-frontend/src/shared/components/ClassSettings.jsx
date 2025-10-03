import React, { useState } from "react";  

export const ClassSettings = () => { 

    { /* TODO: Add class name here and implement the functionality to make it change in the settings modal*/}
    const [formData, setFormData] = useState({
        name: "",
        settings: {}
    });  

    return (
        <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
            Class Name
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Enter a name for your class (if left blank, the class name will
            stay the same).
        </p>
        <input
            type="text"
            placeholder="New Class Name"
            value={formData.name}
            onChange={(e) =>
                setFormData((prev) => ({
                    ...prev,
                    name: e.target.value
                }))
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                        dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
                        focus:ring-blue-500 focus:outline-none"
        />
    </div>
    );
};