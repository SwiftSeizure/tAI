import React, { useState } from "react";  
import { presetChatSettings } from "../constants/preset-chat-settings"

const ChatSettings = ({ className, onSettingsChange }) => { 
    const [selectedSetting, setSelectedSetting] = useState(null);

    const handleSettingChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedSetting(selectedValue);
        
        const selectedSettingObj = presetChatSettings.find(setting => setting.name === selectedValue);
        
        if (onSettingsChange) {
            onSettingsChange(selectedSettingObj);
        }
    };

    return (
        <div>
            <h1>Chat Settings {className && `for "${className}"`}</h1>
            <ul>
                {presetChatSettings.map((setting) => (
                    <li key={setting.name}>
                        <input
                            type="radio"
                            id={setting.name}
                            name="chat-setting"
                            value={setting.name}
                            checked={selectedSetting === setting.name}
                            onChange={handleSettingChange}
                        />
                        <label htmlFor={setting.name}>
                            <strong>{setting.name}</strong>
                            <br />
                            {setting.description}
                        </label>
                    </li>
                  ))}
            </ul>
        </div>
    );
} 

export default ChatSettings;