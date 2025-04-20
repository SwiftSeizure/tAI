import React, { useState } from "react";  
import DayComponent from "./DayComponent";

// Devide what we need to pass down to the module here maybe the entire module 
// then do all the conditionals to map it in here if the things exist 
const ModuleComponent = ( { module, onDaySelect, onMaterialSelect } ) => {   
 
    const [isExpanded, setIsExpanded] = useState(false); 

    const toggleExpand = () => { 
        setIsExpanded(!isExpanded);
    };

    console.log("This is the data that is being passed into the module component: ", module)

    return ( 
        <>
        <div className="individual-module-componet-div"> 
            <div 
                onClick={toggleExpand}
            > 
                <h3 className="module-title-text"> 
                    {module.name} 
                    <span>{isExpanded ? "▲" : "▼"}</span> 
                </h3>  
               
            </div> 
            {isExpanded && module.days && ( 
                <div className="individual-day-div">  
                    {Array.isArray(module.days) && module.days.map(day => ( 
                        // could put day component here when more dropdown functionality
                        <DayComponent 
                            key={day.id} 
                            day={day} 
                            onDaySelect={() => onDaySelect(module.id, day.id)} 
                            onMaterialSelect={onMaterialSelect} 
                        />
                    ))}
                </div>
            )}
        </div>
        </>
    )

}; 

export default ModuleComponent;