import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

const TeacherCreateModulePage = () => {   

    const [days, setDays] = useState(1); 

    const navigate = useNavigate();  


    const handleAddDay = () => { 
        setDays(days + 1); 
    }; 

    const handleCancel = () => { 
        navigate('/modulepage');
    };  


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

            <button onClick={handleAddDay}> 
                Add Day 
            </button>  

            <div> 
                {Array.from({ length: days }, (_, index) => (
                    <div key={index}>
                        <input type="text" placeholder="Day Name" /> 
                        {/* Add other day-specific fields here */}
                    </div>
                ))}
            </div>


            <button onClick={handleOnCreateModule}> 
                Create Module 
            </button> 
            <button onClick={handleCancel}> 
                Cancel 
            </button>
 

        </div> 
    ); 
}; 

export default TeacherCreateModulePage;
