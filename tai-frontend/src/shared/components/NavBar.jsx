import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import '../../App.css';
import TitleHeading from "../animations/TitleHeading";
import { useSettingsModal } from "../hooks/useSettingsModal";
import { SettingsModal } from "../modals/SettingsModal";
import { useCurrentClass } from "../../store/class-store";

export const NavBar = ({ title, intro, settings }) => {
    const navigate = useNavigate();
    const { currentClass } = useCurrentClass();

    const handleSettingsSuccess = (responseData) => {
        console.log('Settings saved successfully:', responseData);
    };

    const handleSettingsError = (error) => {
        console.error('Settings save failed:', error);
    };

    const {
        isOpen,
        isLoading,
        openModal,
        closeModal,
        saveSettings
    } = useSettingsModal(currentClass?.id, handleSettingsSuccess, handleSettingsError);

    const goBackPage = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const handleEditProfile = () => {
        console.log("Edit Profile clicked");
        // Add navigation or modal opening here
    };

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full shadow-sm">
                <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                    {/* Left side: Back button and Title */}
                    <div className="flex items-center space-x-3">
                        {title !== "" && (
                            <button
                                className="flex w-10 h-10 cursor-pointer rounded-md p-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={(e) => goBackPage(e)}
                            >
                                <ArrowBackIcon className="text-gray-700 dark:text-gray-300" />
                            </button>
                        )}

                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                                {title}
                            </h1>
                        </div>

                    </div>

                    {/* Right side: Settings + Edit Profile */}
                    <div className="flex items-center space-x-4">
                        {settings && (
                            <button
                                className="flex w-10 h-10 cursor-pointer rounded-md p-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={openModal}
                                disabled={isLoading}
                            >
                                <SettingsIcon className="text-gray-700 dark:text-gray-300" />
                            </button>
                        )}

                        <button
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                            onClick={handleEditProfile}
                        >
                            <AccountCircleIcon className="mr-2" fontSize="small" />
                             
                        </button>
                    </div>
                </div>
            </nav>

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
