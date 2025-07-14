import React, { useState, useEffect } from "react";   
import { useLocation } from 'react-router-dom';  
import ClassCard from "../components/ClassCard"; 
import TitleCard from "../../shared/components/TitleCard";    
import "react-icons/fa"; 
import { useClasses } from "../hooks/useClasses";

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
    
    // Retrieve user information from the location state
    const location = useLocation(); 
    const { userID, name, role } = location.state || {};  

    const { classes, isLoading, error } = useClasses(userID, role);  

    useEffect(() => {
        populateClassCards();
    }, [userID, role, isLoading])


    /**
     * populateClassCards
     * Generates a list of `ClassCard` components based on the fetched class data.
     * Each `ClassCard` represents a class the user is associated with.
     */
    const populateClassCards = () => {   
        console.log(classes); // Debugging: Log the fetched class data
        
        return ( 
            <>   
                {Array.isArray(classes) && classes.map(classroom => (
                    <ClassCard   
                        key={classroom.id} 
                        classID={classroom.id}
                        classname={classroom.name}  
                        userID={userID}
                        role={role}
                    />
                ))} 
            </>
        );
    }; 

    // Title for the page, personalized with the user's name
    const title = "Welcome " + name;

    return ( 
        <>   
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient"> 

        
            {/* Title card displaying a personalized welcome message */}
            <TitleCard title={title} />

            {/* Grid container for class cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-4">      
                {/* Render the fetched class cards */}
                {populateClassCards()}  

                {/* Add a "new class" card for creating or joining a class */}
                <ClassCard   
                    classID={null}
                    classname={"newClass"}  
                    userID={userID}
                    role={role}
                />   
                
            </div>  
        </div>
        </>
    );
};  

export default TeacherStudentHomePage;