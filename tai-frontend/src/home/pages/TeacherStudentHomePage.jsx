import React, { useEffect } from "react";   
import { useNavigate } from 'react-router-dom';   
import ClassCard from "../components/ClassCard"; 
import { TitleCard } from "../../shared/components/TitleCard";    
import "react-icons/fa"; 
import { useCurrentUser, useIsAuthenticated } from "../../store/user-store"; 
import { useClass, useAllClasses, useClassesLoading, useClassesError } from "../../store/class-store";

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

    const handleClassSelect = async (classID, classname) => { 
        try {  
            console.log("hANDLE CLASS SELECT CALLED");
            await setCurrentClass(classID); 
            console.log("CURRENT CLASS SET", state.currentClass);
            navigate('/unitpage');
        }
        catch (error) { 
            console.error('Error selecting class:', error);
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

        console.log(classes);
        
        return ( 
            <>   
                {Array.isArray(classes) && classes.map(classroom => (
                    <ClassCard   
                        key={classroom.id} 
                        classID={classroom.id}
                        classname={classroom.name}  
                        onClick={handleClassSelect}
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
        </>
    );
};  

export default TeacherStudentHomePage;