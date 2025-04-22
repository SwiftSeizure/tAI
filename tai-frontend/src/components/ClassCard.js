import React, { useState } from "react";  
import { useNavigate } from 'react-router-dom';   
import TeacherStudentUnitPage from "../pages/Universal/TeacherStudentUnitPage";

// Need to pass down props here about the name of the class 
const ClassCard = ( {classID, classname, userID, role}  ) => {   



    const logo = require("../images/example-class-logo.png"); 
    const navigate = useNavigate();   


    const goToUnitPage = (e) => { 
        e.preventDefault();  

        // Navigate to the unit page and pass down the 
        navigate('/unitpage', {state: {classID, userID, role, classname}})
        // Navigate here 
    }; 

    const goToNewClassPage = (e) => { 
        e.preventDefault();  

        if (role === "teacher") { 
            // Go to create the class page for teacher  
            navigate('/createclass', {state: { userID, role}})
        } 
        else { 
            // Go to the add the class page for student 
        }

    };


    if (classname !== "newClass") { 
        return(  
            <div className="card-button-outline">  
                <button 
                    className="card-button" 
                    onClick={ (e) => goToUnitPage(e) }
                    >  
                    <img  
                        className="card-image"
                        src={logo} />
    
                    <div className="card-text-outline"> 
                        {classname} 
                    </div> 
                    
                </button>
            </div>
            
        );
    } 
    else { 
        return ( 
            <div className="card-button-outline"> 
                <button
                    className="card-button"
                    onClick={ (e) => goToNewClassPage(e) } 
                    >
                    <img 
                        className="card-image" 
                        src={logo} /> 
                    <div className="card-text-outline"> 
                        Add New class
                    </div>
                    
                </button> 

            </div>
        )
    }
} 

export default ClassCard;