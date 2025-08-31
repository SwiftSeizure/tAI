import React from 'react'; 
import { useNavigate } from 'react-router-dom';

const TeacherCreateModulePage = () => {  

    const navigate = useNavigate();
    const handleOnCreateModule = () => {  

        navigate('/modulepage');

    };


    return ( 
        <div> 
            <h1>Teacher Create Module Page</h1>     
            <h2> 
                Create a Module 
            </h2> 

            <input type="text" placeholder="Module Name" />

            <button> 
                Create Module 
            </button>
 

        </div> 
    ); 
}; 

export default TeacherCreateModulePage;
