import React from "react";  
import { useNavigate } from 'react-router-dom';   
import TeacherStudentUnitPage from "../pages/Universal/TeacherStudentUnitPage";

// Need to pass down information here about the name of the class 
const ClassCard = ( { stateData }) => {  

    const navigate = useNavigate();  

    const goToPage = (e) => { 
        e.preventDefault(); 
        navigate('/UnitPage', {stateData})
        // Navigate here 
    };

    return(  
        <div>  
            <button onClick={ (e) => goToPage(e) }> 
                This is a class card  
                <h4> Some kind of image here </h4>
                <h5> Class name here </h5> 
            </button>
        </div>
        
    );
} 

export default ClassCard;