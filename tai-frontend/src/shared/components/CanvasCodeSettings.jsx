import React, { useState } from "react";
import CanvasURLCourseID_Guide from "../images/CanvasURLCourseID_Guide.png";

export const CanvasCodeSettings = ({ onCanvasCodeChange }) => { 
    const [apiKey, setApiKey] = useState(""); 
    const [classId, setClassId] = useState("");
    const [domainName, setDomainName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleApiKeyChange = (key) => {
        setApiKey(key);
        updateCanvasData(key, classId, domainName);
    };

    const handleClassIdChange = (id) => {
        setClassId(id);
        updateCanvasData(apiKey, id, domainName);
    };

    const handleDomainNameChange = (domain) => {
        setDomainName(domain);
        updateCanvasData(apiKey, classId, domain);
    };

    const updateCanvasData = (key, id, domain) => {
        const canvasData = {
            api_key: key,
            class_id: id,
            domain_name: domain
        };
        onCanvasCodeChange(canvasData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div className="w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                Canvas Integration Settings
            </h3>
            <div className="space-y-4"> 
                {/* API Key Input */}
                <div className="space-y-2">
                    <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        API Key
                    </label>
                    <input
                        id="api-key-input"
                        type="text"
                        placeholder="Enter your Canvas API key"
                        value={apiKey}
                        onChange={(e) => handleApiKeyChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                    dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
                                    focus:ring-blue-500 focus:outline-none transition-all duration-200
                                    hover:border-gray-400 dark:hover:border-gray-500"
                    />
                </div>

                {/* Class ID Input */}
                <div className="space-y-2">
                    <label htmlFor="class-id-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Course ID
                    </label>
                    <input
                        id="class-id-input"
                        type="text"
                        placeholder="Enter Canvas Course ID"
                        value={classId}
                        onChange={(e) => handleClassIdChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                    dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
                                    focus:ring-blue-500 focus:outline-none transition-all duration-200
                                    hover:border-gray-400 dark:hover:border-gray-500"
                    />
                </div>

                {/* Domain Name Input */}
                <div className="space-y-2">
                    <label htmlFor="domain-name-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Course URL
                    </label>
                    <input
                        id="domain-name-input"
                        type="text"
                        placeholder="e.g., school.instructure.com"
                        value={domainName}
                        onChange={(e) => handleDomainNameChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                    dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
                                    focus:ring-blue-500 focus:outline-none transition-all duration-200
                                    hover:border-gray-400 dark:hover:border-gray-500"
                    />
                </div>

                
                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* TODO: I want to add image  CanvasURLCourseID_Guide.png */} 
                    <img src={CanvasURLCourseID_Guide} alt="Canvas URL Course ID Guide" />

                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    All Canvas fields are optional. Leave blank if not using Canvas integration.
                </p>
            </div>
        </div>
    );
}