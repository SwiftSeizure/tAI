import React, { useState } from "react";  
import { useNavigate } from 'react-router-dom';   
import TeacherStudentUnitPage from "../pages/Universal/TeacherStudentUnitPage";
import "../CSS/CardLayouts.css";
import "../CSS/Buttons.css";

/**
 * ClassCard Component
 * This component represents a card for a class. It displays the class name
 * and allows navigation to different pages based on the user's role and actions.
 * Props:
 * - classID: Unique identifier for the class
 * - classname: Name of the class
 * - userID: ID of the current user
 * - role: Role of the user (e.g., "teacher" or "student")
 */
const ClassCard = ( {classID, classname, userID, role}  ) => {   


    // Logo for the class card 
    // TODO: change this to allow teacher to upload or select from a list of logos
    const logo = require("../images/example-class-logo.png");  

    // Hook to navigate to the UnitPage
    const navigate = useNavigate();   



    /**
     * goToUnitPage
     * Navigates to the unit page for the selected class.
     * Passes classID, userID, role, and classname as state to the next page.
     */
    const goToUnitPage = (e) => { 
        e.preventDefault();  
        navigate('/unitpage', {state: {classID, userID, role, classname}})
    }; 



    /**
     * goToNewClassPage
     * Navigates to the appropriate page for adding or creating a class.
     * - Teachers are redirected to the "create class" page.
     * - Students are redirected to the "join class" page.
     */
    const goToNewClassPage = (e) => { 
        e.preventDefault();  

        if (role === "teacher") { 
            // Go to CreateClass page for teacher  
            navigate('/createclass', {state: { userID, role}});
        } 
        else { 
            // Go to the JoinClass page for student 
            navigate('/joinclass', {state: { userID, role}});
        }

    };

 
    // Render the class card based on the classname prop
    if (classname !== "newClass") { 
        return(  
            <div className="card-button-outline">  
                <button 
                    className="card-button" 
                    onClick={ (e) => goToUnitPage(e) }
                    >   
                    {/* Display the class logo */}
                    <img  
                        className="card-image"
                        src={logo} />
    
                    {/* Display the class name */}
                    <div className="card-text-outline">  
                        {classname} 
                    </div> 
                    
                </button>
            </div>
            
        );
    }  
    // Create card for either adding or joining a class based on the role
    else { 
        return ( 
            <div className="card-button-outline"> 
                <button
                    className="card-button"
                    onClick={ (e) => goToNewClassPage(e) } 
                    > 
                    {/* Display the class logo */}
                    <img 
                        className="card-image" 
                        src={logo} />  
                    {/* Display a placeholder for the new class logo */}
                    <div className="card-text-outline"> 
                        Add New class
                    </div>
                </button> 

            </div>
        )
    }
} 

export default ClassCard;