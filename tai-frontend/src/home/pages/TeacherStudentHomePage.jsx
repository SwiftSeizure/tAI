import React, { useEffect, useState } from "react";   
import { useNavigate } from 'react-router-dom';   
import ClassCard from "../components/ClassCard"; 
import { NavBar } from "../../shared/components/NavBar";    
import "react-icons/fa"; 
import { useCurrentUser, useIsAuthenticated } from "../../store/user-store"; 
import { useClass, useAllClasses, useClassesLoading, useClassesError } from "../../store/class-store";
import { SettingsModal } from "../../shared/modals/SettingsModal";
import { deleteClass } from "../services/delete-class";  
import { getStudentsEnrolled } from "../services/get-students-enrolled";  
import { deleteStudentFromClass } from "../services/delete-student-from-class";  
import { postPublishClass } from "../services/post-publish-class";   
import { putUpdateClassSettings } from "../services/put-update-class-settings";

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
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  
    const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);  

    const [selectedClass, setSelectedClass] = useState(null);

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

    const handleOpenSettingsModal = async (classroom) => {  
        if (!classroom.id){ 
            return;
        } 
        setSelectedClass(classroom);
        setIsSettingsModalOpen(true);
    };   

    const handleOnSaveSettings = async (formData) => { 
        try { 
            //This is where updating logic will go  
            await putUpdateClassSettings(selectedClass.id, formData); 
            // Right now this handles both settings and name, now we need to update name then settings. 
            // refresh the classes here 
        }
        catch (error) { 
            console.error('Error saving settings:', error);
        } 
        setIsSettingsModalOpen(false);
    };    

    const handleCloseSettingsModal = () => { 
        setIsSettingsModalOpen(false);
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
            await postPublishClass(classroom.id); 
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
        if (isLoading) {
            return (
                <div className="col-span-full flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg text-gray-600 font-medium">Loading classes...</p>
                    </div>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="col-span-full flex items-center justify-center py-20">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Classes</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            );
        }
        
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
                            onClickSettings={handleOpenSettingsModal} 
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
    const title = `Welcome Home ${user?.name || ''}`; 
    console.log("user", user);

    return ( 
        <>   
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 bg-[length:200%_200%]" style={{animation: 'gradient-shift 15s ease-in-out infinite'}}>

                {/* NavBar */}
                <NavBar title={title} />

                {/* Main Content Container */}
                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    
                    {/* Section Header */}
                    <div className="mx-auto bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 w-fit">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {user?.role === 'teacher' ? 'Your Classes' : 'My Classes'}
                            </h2> 
                            <p className="text-gray-600">
                            {user?.role === 'teacher' 
                                ? 'Manage your classes and track student progress' 
                                : 'Access your enrolled classes and learning materials'}
                        </p>
                        </div>
                    </div>

                    {/* Grid container for class cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">      
                        {/* Render the fetched class cards */}
                        {populateClassCards()}   
                    </div>
                    
                    {/* Empty State - Only show if no classes and not loading */}
                    {!isLoading && !error && Array.isArray(classes) && classes.length === 0 && (
                        <div className="col-span-full mt-12 text-center py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {user?.role === 'teacher' ? 'No Classes Yet' : 'Not Enrolled in Any Classes'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {user?.role === 'teacher' 
                                    ? 'Create your first class to get started with teaching' 
                                    : 'Join a class to start learning'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        
            {/* Settings Modal */}
            {isSettingsModalOpen && user.role === 'teacher' && (
                <SettingsModal 
                    isOpen={isSettingsModalOpen}
                    onClose={handleCloseSettingsModal}
                    classroom={selectedClass} 
                    onSaveSettings={handleOnSaveSettings}
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