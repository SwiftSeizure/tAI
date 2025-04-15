import React, { useState } from "react";  
import { useNavigate } from 'react-router-dom';   
import TeacherStudentUnitPage from "../pages/Universal/TeacherStudentUnitPage"; 
import styles from './Components.css';

// Need to pass down props here about the name of the class 
const ClassCard = ( {classID, classname, userID, role}  ) => {  

    const navigate = useNavigate();   


    const goToPage = (e) => { 
        e.preventDefault();  

        // Navigate to the unit page and pass down the 
        navigate('/unitpage', {state: {classID, userID, role, classname}})
        // Navigate here 
    }; 



    return(  
        <div className="card-button-outline">  
            <button 
                className="card-button" 
                onClick={ (e) => goToPage(e) }
                >  

                <div> Some kind of image here </div>
                <div> {classname} </div> 
                
            </button>
        </div>
        
    );
} 

export default ClassCard;