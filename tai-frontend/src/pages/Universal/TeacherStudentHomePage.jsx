import React, { useState, useEffect } from "react";   
import { useLocation } from 'react-router-dom';  
import ClassCard from "../../components/ClassCard"; 
import { getRequest } from "../../API";
import TitleCard from "../../components/TitleCard";    
import "react-icons/fa";

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

    // State to track loading status
    const [loading, setLoading] = useState(true); 

    // State to track errors during data fetching
    const [error, setError] = useState(null);  

    // State to store the list of classes fetched from the backend
    const [data, setData] = useState([]);
    
    // Retrieve user information from the location state
    const location = useLocation(); 
    const { userID, name, role } = location.state || {}; 



    /**
     * useEffect Hook
     * Fetches class data from the backend when the component mounts or when `userID` or `role` changes.
     */
    useEffect(() => {  
        const loadClassCards = async () => {  
            try {  

                setLoading(true); 
            
                // Get the class data from the backend based on userID and role
                const url = `/home/${role}/${userID}`; 
                const response = await getRequest(url);  
                setData(response.data.classes); 
            
                // Populate the class cards with the fetched data
                populateClassCards();
            } 
            catch (error) { 
                setError(error);
            }  
             
            finally { 
                setLoading(false); 
            }
        };

        // Call the function to load class cards
        loadClassCards(); 

        // Dependencies: Reload data when `userID`, `role`, or `data` changes
    }, [userID, role]); 



    /**
     * populateClassCards
     * Generates a list of `ClassCard` components based on the fetched class data.
     * Each `ClassCard` represents a class the user is associated with.
     */
    const populateClassCards = () => {   
        console.log(data); // Debugging: Log the fetched class data
        
        return ( 
            <>   
                {Array.isArray(data) && data.map(classroom => (
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