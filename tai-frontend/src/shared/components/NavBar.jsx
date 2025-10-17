import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import ProfileModal from "../modals/ProfileModal";

import '../../App.css';
export const NavBar = ({ title, settings }) => { 

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); 


    const navigate = useNavigate();

    const goBackPage = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const handleOpenProfile = () => { 

        console.log("Edit Profile clicked");
        // Add navigation or modal opening here  
        setIsProfileModalOpen(true); 
    }; 

    const handleCloseProfileModal = () => { 
        setIsProfileModalOpen(false);
    } 

    const handleOnChangeDisplayName = () => { 
        // call the api to change the users display name here 
        console.log("changing the display name to: " )
    }

    return (
        <>
            <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 w-full sticky top-0 z-50 shadow-sm">
                <div className="max-w-screen-2xl flex items-center justify-between mx-auto px-8 py-4">
                    {/* Left side: Back button */}
                    <div className="flex items-center min-w-[140px]">
                        {title !== "" && (
                            <button
                                className="group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 hover:bg-gray-50 hover:shadow-md active:scale-95 border border-gray-200/50 hover:border-gray-300"
                                onClick={(e) => goBackPage(e)}
                                title="Go Back"
                            >
                                <ArrowBackIcon 
                                    className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300" 
                                    fontSize="medium"
                                />
                            </button>
                        )}
                    </div>

                    {/* Center: Title */}
                    <div className="flex-1 flex justify-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                            {title}
                        </h1>
                    </div>

                    {/* Right side: Profile */}
                    <div className="flex items-center gap-4 min-w-[140px] justify-end">
                        <button
                            className="group flex items-center gap-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 border border-blue-500/20"
                            onClick={handleOpenProfile}
                            title="Edit Profile"
                        >
                            <AccountCircleIcon fontSize="small" className="group-hover:scale-110 transition-transform duration-300" />
                            <span className="hidden sm:inline font-medium">Profile</span>
                        </button>
                    </div>
                </div>
            </nav> 

            <ProfileModal
                isOpen={isProfileModalOpen} 
                onClose={handleCloseProfileModal} 
                onChangeDisplayName={handleOnChangeDisplayName}
            />
        </>
    );
};