import { useState } from 'react';
import { putUpdateClassSettings } from '../services/put-update-class-settings';

export const useSettingsModal = (classID) => { 

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => setIsOpen(true);
    
    const closeModal = async (settingsData = null) => {
        if (settingsData) {
            setIsLoading(true);
                try {
                    await putUpdateClassSettings(classID, settingsData);
                } catch (error) {
                    console.error('Failed to save settings:', error);
                    return; 
                } finally {
                    setIsLoading(false);
                }
            }
        setIsOpen(false);
    };  

    return {
        isOpen,
        isLoading,
        openModal,
        closeModal
    };
};