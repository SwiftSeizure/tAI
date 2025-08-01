import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';

import '../../App.css';
import TitleHeading from "../animations/TitleHeading";
import { useSettingsModal } from "../hooks/useSettingsModal";
import { SettingsModal } from "../modals/SettingsModal";
import { putUpdateClassSettings } from "../services/put-update-class-settings";

/**
 * TitleCard Component
 * This component displays a title card with an optional back button.
 * If no title is provided, it displays a default welcome message.
 * 
 * Props:
 * - title: The title to display on the card. If empty, a default message is shown.
 * - intro: Boolean for intro animation
 * - settings: Boolean to show settings button
 * - classID: ID of the class for settings updates
 */
export const TitleCard = ({ title, intro, settings, classID }) => {
    const navigate = useNavigate();

    // Callbacks for settings operations
    const handleSettingsSuccess = (responseData, settingsData) => {
        console.log('Settings saved successfully:', responseData); 
        putUpdateClassSettings(classID, settingsData); 
        
        // You could add a toast notification here
        // You could update local state here if needed
    };

    const handleSettingsError = (error) => {
        console.error('Settings save failed:', error);
        // You could add error toast notification here
        // You could show an error modal here
    };

    const { 
        isOpen, 
        isLoading, 
        openModal, 
        closeModal, 
        saveSettings 
    } = useSettingsModal(classID, handleSettingsSuccess, handleSettingsError);

    /**
     * goBackPage
     * Navigates the user to the previous page when the back button is clicked.
     * @param {Event} e - The click event
     */
    const goBackPage = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <>
            <div className="relative flex items-center justify-center h-fit px-4 w-90">
                {/* If no title is provided, show a default welcome message */}
                {title === "" ? (
                    <div className="flex justify-center w-full">
                        <TitleHeading 
                            title={'Welcome to TAi!'} 
                            transitionTime={100} 
                            intro={true}
                        />
                    </div>
                ) : (
                    <>
                        <div className="absolute left-2">
                            <button
                                className="flex w-10 h-10 cursor-pointer rounded-md p-4 m-2 font-medium text-[1.1rem] text-gray-800 justify-center items-center hover:shadow-2xl active:shadow-sm focus:outline-offset-2"
                                onClick={(e) => goBackPage(e)}
                            >
                                <ArrowBackIcon className="transform scale-100 transition-transform duration-300 ease-in hover:scale-150" />
                            </button>
                        </div>

                        <div className="flex-grow flex justify-center">
                            <TitleHeading 
                                title={title} 
                                intro={intro} 
                                transitionTime={10} 
                            />
                        </div>

                        {settings && (
                            <div className="absolute right-2">
                                <button 
                                    className="flex w-10 h-10 cursor-pointer rounded-md p-4 m-2 font-medium text-[1.1rem] text-gray-800 justify-center items-center hover:shadow-2xl active:shadow-sm focus:outline-offset-2"
                                    onClick={openModal}
                                    disabled={isLoading}
                                >
                                    <SettingsIcon />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isOpen && (
                <SettingsModal 
                    onSave={saveSettings}
                    onCancel={closeModal}
                    isLoading={isLoading}
                />
            )}
        </>
    );
};