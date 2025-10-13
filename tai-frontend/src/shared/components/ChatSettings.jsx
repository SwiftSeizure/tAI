import React, { useState } from "react";
import { presetChatSettings } from "../constants/preset-chat-settings";

export const ChatSettings = ({ className, onSettingsChange }) => {
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
        <div className="w-full max-w-2xl"> 
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
				Chat Settings
			</h3>
            <div className="space-y-3">
                {/* Optional: Display class name if provided */}
                {className && (
                    <p className="text-sm text-gray-600">
                        Settings for <span className="font-semibold text-gray-900">"{className}"</span>
                    </p>
                )}

                {/* Settings Options */}
                <div className="space-y-2">
                    {presetChatSettings.map((setting) => (
                        <label
                            key={setting.name}
                            htmlFor={setting.name}
                            className={`group relative flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedSetting === setting.name
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            {/* Radio Button */}
                            <div className="flex items-center h-5">
                                <input
                                    type="radio"
                                    id={setting.name}
                                    name="chat-setting"
                                    value={setting.name}
                                    checked={selectedSetting === setting.name}
                                    onChange={handleSettingChange}
                                    className="appearance-none"
                                />
                            </div>

                            {/* Content */}
                            <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-semibold ${
                                        selectedSetting === setting.name
                                            ? 'text-blue-900'
                                            : 'text-gray-900'
                                    }`}>
                                        {setting.name}
                                    </span>

                                    {/* Selected Badge */}
                                    {selectedSetting === setting.name && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                                            Selected
                                        </span>
                                    )}
                                </div>
                                
                                <p className={`text-sm leading-relaxed ${
                                    selectedSetting === setting.name
                                        ? 'text-blue-800'
                                        : 'text-gray-600'
                                }`}>
                                    {setting.description}
                                </p>
                            </div>
                        </label>
                    ))}
                </div>
            </div> 
        </div>
    );
};