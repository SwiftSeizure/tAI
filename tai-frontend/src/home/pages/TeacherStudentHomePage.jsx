import React, { useEffect, useState } from "react";   
import { useNavigate } from 'react-router-dom';   
import ClassCard from "../components/ClassCard"; 
import { TitleCard } from "../../shared/components/TitleCard";    
import "react-icons/fa"; 
import { useCurrentUser, useIsAuthenticated } from "../../store/user-store"; 
import { useClass, useAllClasses, useClassesLoading, useClassesError } from "../../store/class-store";
import { SettingsModal } from "../../shared/modals/SettingsModal";
import { useSettingsModal } from "../../shared/hooks/useSettingsModal"; 
import { deleteClass } from "../services/delete-class";  
import { getStudentsEnrolled } from "../services/get-students-enrolled";  
import { deleteStudentFromClass } from "../services/delete-student-from-class";  
import { postPublishClass } from "../services/post-publish-class";  

import DeleteModal from "../../shared/modals/DeleteModal"; 
import RosterModal from "../modals/RosterModal";

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
    const [, { setCurrentClass, fetchClasses }] = useClass();
    
    // State for managing settings modal
    const [currentSettingsClass, setCurrentSettingsClass] = useState(null); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    const [selectedClass, setSelectedClass] = useState(null);
    const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);  

    const [enrolledStudents, setEnrolledStudents] = useState({}); 
    
    const addClassClass = { 
        name: "newClass",
        id: null,
    }

    const handleSettingsSuccess = () => {
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


    //TODO Change this to make it so it is a method for selecing a class, and adding a new class
    const handleClassSelect = async (classroom) => { 
        try {  
            if (!classroom.id && user.role === 'teacher') {
                navigate('/createclass');
                return;
            }
            else if (!classroom.id && user.role === 'student') {
                navigate('/joinclass');
                return;
            }
            await setCurrentClass(classroom.id); 
            navigate('/unitpage');
        }
        catch (error) { 
            console.error('Error selecting class:', error);
        }
    }; 

    const handleClassSettings = async (classroom) => { 
        setCurrentSettingsClass({ id: classroom.id, name: classroom.name });
        settingsModal.openModal();
    };  

    const handleOpenDeleteModal = (classroom) => { 
        if (!classroom.id){ 
            return;
        } 
        setSelectedClass(classroom);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteClass = async () => {  
        try { 
            await deleteClass(selectedClass.id); 
            fetchClasses(user.id, user.role); 
        } 
        catch (error) { 
            console.error('Error deleting class:', error); 
        } 
    };  

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    }; 

    const handleOpenRosterModal = async (classroom) => {  
        console.log("classroom", classroom); 
        if (!classroom.id){ 
            return;
        } 
        setSelectedClass(classroom); 
        setIsRosterModalOpen(true);  

        //TODO: get students from the classroom 
        const serverResponse = await getStudentsEnrolled(classroom.id);  
        console.log("Students enrolled:", serverResponse.students);
        await setEnrolledStudents(serverResponse.students);
    };  

    const handleRemoveStudent = async (enrolledStudent) => { 
        try { 
           await deleteStudentFromClass(selectedClass.id, enrolledStudent.id);
        }
        catch (error) { 
            console.error('Error deleting student from class:', error); 
        } 
        setIsRosterModalOpen(false);
    }

    const handleCloseRosterModal = () => {
        setIsRosterModalOpen(false);
    }; 

    const handlePublishClass = async (classroom) => {   
        console.log("classroom", classroom); 
        try { 
            postPublishClass(classroom.id); 
            fetchClasses(user.id, user.role); 
        } 
        catch (error) { 
            console.error('Error publishing class:', error); 
        } 
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

                    user.role === 'student' && classroom.published ? ( 
                        <ClassCard   
                            key={classroom.id} 
                            classroom={classroom} 
                            onClick={handleClassSelect}   
                        /> 

                    ) : ( 
                        <ClassCard   
                            key={classroom.id} 
                            classroom={classroom} 
                            onClick={handleClassSelect}   
                            onClickSettings={() => handleClassSettings(classroom.id, classroom.name)}
                            admin={user.role === 'teacher'} 
                            onClickDelete={handleOpenDeleteModal} 
                            onClickRoster={handleOpenRosterModal} 
                            onPublishClass={handlePublishClass}
                        /> 
                    )
                ))}   

                {/* Add a "new class" card for creating or joining a class */}
                <ClassCard   
                    classroom={addClassClass}
                    onClick={handleClassSelect}
                />  
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

        {/* Delete Modal */}
        {isDeleteModalOpen && (
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirmDelete={handleDeleteClass}  
                itemToDelete={selectedClass.name}
            />
        )} 

        {/* Roster Modal */}
        {isRosterModalOpen && (
            <RosterModal
                isOpen={isRosterModalOpen}
                onClose={handleCloseRosterModal}
                onRemoveStudent={handleRemoveStudent}    
                classroom={selectedClass}
                enrolledStudents={enrolledStudents}
            />
        )} 
        </>
    );
};  

export default TeacherStudentHomePage;