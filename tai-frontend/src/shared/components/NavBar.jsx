import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import ProfileModal from "../modals/ProfileModal"; 
import { updateProfile, sendEmailVerification, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../auth/firebase'; 
import { useUser } from '../../store/user-store';
import VerificationModal from '../modals/VerificationModal';

import '../../App.css';
export const NavBar = ({ title, settings }) => { 

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);  
    const [{user}, { setUser }] = useUser();

    const [pendingEmail, setPendingEmail] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    const navigate = useNavigate();

    const goBackPage = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const handleOpenProfile = () => { 
        setIsProfileModalOpen(true); 
    }; 

    const handleCloseProfileModal = () => { 
        setIsProfileModalOpen(false);
    }  

    const handleCloseVerificationModal = () => { 
        setIsVerificationModalOpen(false);
    } 

    const handleOnSaveInformation = async (avatarFile, displayName, newEmail, password) => { 
        const user = auth.currentUser; 
    
        try { 
            // Update profile if needed
            if (displayName || avatarFile) {
                await updateProfile(user, { 
                    displayName: displayName || user.displayName, 
                    photoURL: avatarFile || user.photoURL 
                });
            }  
    
            // Handle email change
            if (newEmail && newEmail !== user.email) {
                // First re-authenticate
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
                
                // Send verification email first
                await sendEmailVerification(user);
                
                // Show verification modal with new email
                setPendingEmail(newEmail); 
                setIsVerificationModalOpen(true);
                
                // Don't update email yet - wait for verification then will update once they login
                return;
            }
    
            // If no email change, update local state and close modal
            await setUser({
                ...user, 
                name: displayName || user.displayName, 
                photoURL: avatarFile || user.photoURL,
            });
            
            setIsProfileModalOpen(false);
    
        } catch (error) {
            console.error("Error updating profile:", error);
            // Handle specific errors
            if (error.code === 'auth/requires-recent-login') {
                alert('Please log in again to update your email.');
            } else {
                alert(error.message);
            }
            throw error;
        }
    };

    
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

                    <button onClick={handleOpenProfile}>  
                        {/* {user.photoURL ? (
                            <img 
                                className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" 
                                src={user.photoURL} 
                                alt="Bordered avatar"
                            />
                        ) : ( */}
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" />
                                <div className="relative inline-flex items-center justify-center w-full h-full overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">
                                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        {/* )} */}
                    </button>
                </div>
            </nav> 

            <ProfileModal
                isOpen={isProfileModalOpen} 
                onClose={handleCloseProfileModal} 
                onSaveInformation={handleOnSaveInformation} 
                user={user}
            /> 

            <VerificationModal
                isOpen={isVerificationModalOpen}
                onClose={handleCloseVerificationModal}
                newEmail={pendingEmail}
            />
        </>
    );
};