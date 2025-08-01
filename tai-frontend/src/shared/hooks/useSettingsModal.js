import { useState } from 'react';
import { putUpdateClassSettings } from '../services/put-update-class-settings';

export const useSettingsModal = (classID, onSuccess, onError) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => setIsOpen(true);

    const closeModal = () => setIsOpen(false);

    const saveSettings = async (settingsData) => {
        if (!settingsData) {
            closeModal();
            return;
        }

        setIsLoading(true);
        try {
            const response = await putUpdateClassSettings(classID, settingsData);
            
            // Call success callback if provided
            if (onSuccess) {
                onSuccess(response.data, settingsData);
            }
            
            closeModal();
        } catch (error) {
            console.error('Failed to save settings:', error);
            
            // Call error callback if provided
            if (onError) {
                onError(error);
            }
            
            // Don't close modal on error so user can retry
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isOpen,
        isLoading,
        openModal,
        closeModal,
        saveSettings
    };
};