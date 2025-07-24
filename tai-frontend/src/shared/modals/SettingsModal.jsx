import React, { useState } from "react";
import { ChatSettings } from "../components/ChatSettings";

export const SettingsModal = ({ onClose, isLoading }) => { 


    const [formData, setFormData] = useState({ name: "", settings: {} });

    const handleSettingsChange = (selectedSetting) => {
        setFormData(prev => ({
            ...prev,
            settings: selectedSetting
        }));
    };

    const handleSave = () => { 
        // TODO: Add Error here 
        onClose(formData); // Pass data back to hook
    };

    const handleCancel = () => {
        onClose(); // Close without saving
    };

    return (
        <div className="settings-modal">
            <div className="settings-modal-content">
                <h2>Settings</h2>

                <input 
                  type="text" 
                  placeholder="Setting Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />

                <ChatSettings onSettingsChange={handleSettingsChange} />

                <div>
                    <button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={handleCancel} disabled={isLoading}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
