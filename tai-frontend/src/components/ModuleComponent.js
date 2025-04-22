import React, { useState } from "react";  
import DayComponent from "./DayComponent"; 
import { FaChevronDown, FaChevronUp, FaBookOpen } from "react-icons/fa"; 
import "../CSS/ModulePage.css"

// Devide what we need to pass down to the module here maybe the entire module 
// then do all the conditionals to map it in here if the things exist 
const ModuleComponent = ( { module, onDaySelect, onMaterialSelect, onAssignmentSelect } ) => {   
 
    const [isExpanded, setIsExpanded] = useState(false); 

    const toggleExpand = () => { 
        setIsExpanded(!isExpanded);
    };


    return ( 
        <>
        <div > 
            <div  
                className="module-header"
                onClick={toggleExpand}
            > 
                <div className="module-header-content"> 

                    <h3 className="module-title-text"> 
                        {module.name}  
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </h3>   

                </div> 
        
            </div> 
            {isExpanded && module.days && ( 
                <div className="individual-day-div">   
                    <ul className="day-list">              
                        {Array.isArray(module.days) && module.days.map(day => ( 
                            <DayComponent 
                                key={day.id} 
                                day={day} 
                                onDaySelect={() => onDaySelect(module.id, day.id)} 
                                onMaterialSelect={onMaterialSelect}  
                                onAssignmentSelect={onAssignmentSelect}
                            />
                        ))} 
                    </ul>
                </div>
            )}
        </div>
        </>
    )

}; 

export default ModuleComponent;