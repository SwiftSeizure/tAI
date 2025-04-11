import React, { useState } from "react";  
import { useNavigate } from 'react-router-dom';   
import TeacherStudentUnitPage from "../pages/Universal/TeacherStudentUnitPage";

// Need to pass down props here about the name of the class 
const ClassCard = ( {key, classname, userID, role}  ) => {  

    const navigate = useNavigate();   


    const goToPage = (e) => { 
        e.preventDefault();  

        // Navigate to the unit page and pass down the 
        navigate('/unitpage', {state: {key, userID, role}})
        // Navigate here 
    }; 

    // <h5> {singleClassData.name} </h5> 

    return(  
        <div>  
            <button onClick={ (e) => goToPage(e) }> 
                This is a class card   
                <h5> {classname} </h5> 
                <h4> Some kind of image here </h4>
                
            </button>
        </div>
        
    );
} 

export default ClassCard;