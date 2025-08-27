import React, { useEffect, useState } from "react";   
import { useNavigate } from 'react-router-dom';   
import ClassCard from "../components/ClassCard"; 
import { TitleCard } from "../../shared/components/TitleCard";    
import "react-icons/fa"; 
import { useCurrentUser, useIsAuthenticated } from "../../store/user-store"; 
import { useClass, useAllClasses, useClassesLoading, useClassesError } from "../../store/class-store";
import { SettingsModal } from "../../shared/modals/SettingsModal";
import { useSettingsModal } from "../../shared/hooks/useSettingsModal";

/**
 * TeacherStudentHomePage Component
 * This page serves as the home page for both teachers and students.
 * It displays a welcome message and a grid of class cards, which represent the classes the user is associated with.
 * 
 * Features:
 * - Fetches class data from the backend based on the user's role and ID.
 * - Displays a list of `ClassCard` components for each class.
 * - Includes a "new class" card for creating or joining a class.
 */

const TeacherStudentHomePage = () => {   
    const navigate = useNavigate();
    const { user } = useCurrentUser();
    const isAuthenticated = useIsAuthenticated();
    const { classes } = useAllClasses();
    const { isLoading } = useClassesLoading();
    const { error } = useClassesError();
    const [state, { setCurrentClass, fetchClasses }] = useClass();
    
    // State for managing settings modal
    const [currentSettingsClass, setCurrentSettingsClass] = useState(null);
    

    const handleSettingsSuccess = (response, settingsData) => {
        console.log('Settings saved successfully:', response);
        // Optionally refresh classes or update local state
        if (user.id && user.role) {
            fetchClasses(user.id, user.role);
        }
    };

    const handleSettingsError = (error) => {
        console.error('Settings save failed:', error);
        // Could add toast notification or error display here
    };   

    
    // Settings modal hook with handlers
    const settingsModal = useSettingsModal(
        currentSettingsClass?.id,
        handleSettingsSuccess,
        handleSettingsError
    );

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Fetch classes when component mounts or user changes
    useEffect(() => {
        if (user.id && user.role) {
            fetchClasses(user.id, user.role);
        }
    }, [user, fetchClasses]); 

    const handleClassSelect = async (classID) => { 
        try {  
            console.log("hANDLE CLASS SELECT CALLED"); 
            if (!classID) {
                navigate('/createclass');
                return;
            }
            await setCurrentClass(classID); 
            navigate('/unitpage');
        }
        catch (error) { 
            console.error('Error selecting class:', error);
        }
    }; 

    const handleClassSettings = async (classID, classname) => { 
        console.log("Handle class settings called for:", classID, classname);
        setCurrentSettingsClass({ id: classID, name: classname });
        settingsModal.openModal();
    };
 

    /**
     * populateClassCards
     * Generates a list of `ClassCard` components based on the fetched class data.
     * Each `ClassCard` represents a class the user is associated with.
     */
    const populateClassCards = () => {
        if (isLoading) return <div>Loading classes...</div>;
        if (error) return <div>Error loading classes: {error}</div>; 
        
        return ( 
            <>   
                {Array.isArray(classes) && classes.map(classroom => (
                    <ClassCard   
                        key={classroom.id} 
                        classID={classroom.id}
                        classname={classroom.name}  
                        onClick={handleClassSelect} 
                        onClickSettings={() => handleClassSettings(classroom.id, classroom.name)}
                    />
                ))} 
            </>
        );
    }; 

    // Title for the page, personalized with the user's name
    const title = `Welcome ${user?.name || ''}`;

    return ( 
        <>   
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient"> 

        
            {/* Title card displaying a personalized welcome message */}
            <TitleCard title={title}  />

            {/* Grid container for class cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-4">      
                {/* Render the fetched class cards */}
                {populateClassCards()}  

                {/* Add a "new class" card for creating or joining a class */}
                <ClassCard   
                    classID={null}
                    classname={"newClass"}  
                    onClick={handleClassSelect}
                />   
                
            </div>  
            
        </div>
        
        {/* Settings Modal */}
        {settingsModal.isOpen && user.role === 'teacher' && (
            <SettingsModal
                onSave={settingsModal.saveSettings}
                onCancel={settingsModal.closeModal}
                isLoading={settingsModal.isLoading}
            />
        )}
        </>
    );
};  

export default TeacherStudentHomePage;