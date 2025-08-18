import React, { useEffect } from "react";   
import { useNavigate } from 'react-router-dom';
import ClassCard from "../components/ClassCard"; 
import { TitleCard } from "../../shared/components/TitleCard";    
import "react-icons/fa"; 
import { useClasses } from "../hooks/useClasses";
import { useCurrentUser, useIsAuthenticated } from "../../store/store";

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
    const { user }  = useCurrentUser();
    const isAuthenticated = useIsAuthenticated();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const { classes, isLoading, error } = useClasses(user.id, user.role);  

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
                        userID={user?.id}
                        role={user?.role}
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
                    userID={user?.id}
                    role={user?.role}
                />   
                
            </div>  
        </div>
        </>
    );
};  

export default TeacherStudentHomePage;