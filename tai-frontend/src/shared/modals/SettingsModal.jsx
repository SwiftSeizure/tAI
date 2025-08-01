import React, { useState } from "react";
import { ChatSettings } from "../components/ChatSettings";

export const SettingsModal = ({ onSave, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({ 
        name: "", 
        settings: {} 
    });

    const handleSettingsChange = (selectedSetting) => {
        setFormData(prev => ({
            ...prev,
            settings: selectedSetting
        }));
    };

    const handleSave = () => {
        // Validate form data if needed
        if (!formData.name.trim() && Object.keys(formData.settings).length === 0) {
            // Could add error handling here
            return;
        }
        
        onSave(formData);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="settings-modal">
            <div className="settings-modal-content">
                <h1>Settings</h1>
                
                <h2>Class Name</h2>
                <p>Enter a name for your class (if left blank class name will stay the same as before)</p>
                <input
                    type="text"
                    placeholder="New Class Name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        name: e.target.value 
                    }))}
                />
                
                <ChatSettings onSettingsChange={handleSettingsChange} />
                
                <div>
                    <button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={handleCancel} disabled={isLoading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};