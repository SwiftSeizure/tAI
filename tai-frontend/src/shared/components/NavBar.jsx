import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import '../../App.css';
import { useSettingsModal } from "../hooks/useSettingsModal";
import { useCurrentClass } from "../../store/class-store";

export const NavBar = ({ title, settings }) => {
    const navigate = useNavigate();
    const { currentClass } = useCurrentClass();

    const handleSettingsSuccess = (responseData) => {
        console.log('Settings saved successfully:', responseData);
    };

    const handleSettingsError = (error) => {
        console.error('Settings save failed:', error);
    };

    const {
        isLoading,
        openModal,
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
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 w-full sticky top-0 z-50 shadow-sm">
                <div className="max-w-screen-xl flex items-center justify-between mx-auto px-6 py-3">
                    {/* Left side: Back button */}
                    <div className="flex items-center min-w-[120px]">
                        {title !== "" && (
                            <button
                                className="group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:bg-gray-100 hover:shadow-sm active:scale-95"
                                onClick={(e) => goBackPage(e)}
                                title="Go Back"
                            >
                                <ArrowBackIcon 
                                    className="text-gray-600 group-hover:text-gray-900 transition-colors" 
                                    fontSize="medium"
                                />
                            </button>
                        )}
                    </div>

                    {/* Center: Title */}
                    <div className="flex-1 flex justify-center">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {title}
                        </h1>
                    </div>

                    {/* Right side: Settings + Edit Profile */}
                    <div className="flex items-center gap-3 min-w-[120px] justify-end">
                        {settings && (
                            <button
                                className="group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:bg-gray-100 hover:shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={openModal}
                                disabled={isLoading}
                                title="Settings"
                            >
                                <SettingsIcon 
                                    className="text-gray-600 group-hover:text-gray-900 transition-colors group-hover:rotate-90 duration-300" 
                                    fontSize="medium"
                                />
                            </button>
                        )}

                        <button
                            className="group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                            onClick={handleEditProfile}
                            title="Edit Profile"
                        >
                            <AccountCircleIcon fontSize="small" />
                            <span className="hidden sm:inline">Profile</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};