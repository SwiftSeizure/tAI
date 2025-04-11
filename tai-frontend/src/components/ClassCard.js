import React from "react";  
import { useNavigate } from 'react-router-dom';   
import TeacherStudentUnitPage from "../pages/Universal/TeacherStudentUnitPage";

// Need to pass down props here about the name of the class 
const ClassCard = ( {classroom, userID, role}  ) => {  

    const navigate = useNavigate();  

    const goToPage = (e) => { 
        e.preventDefault();  

        // Navigate to the unit page and pass down the 
        // navigate('/UnitPage', {state: {singleClassData.classID, userID, role}})
        // Navigate here 
    }; 

    // <h5> {singleClassData.name} </h5> 

    return(  
        <div>  
            <button onClick={ (e) => goToPage(e) }> 
                This is a class card  
                <h4> Some kind of image here </h4>
                
            </button>
        </div>
        
    );
} 

export default ClassCard;