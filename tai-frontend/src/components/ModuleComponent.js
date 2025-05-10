import React, { useState } from "react";  
import DayComponent from "./DayComponent"; 
import { FaChevronDown, FaChevronUp, FaBookOpen } from "react-icons/fa"; 
import "../CSS/ModulePage.css" 


/**
 * ModuleComponent
 * This component represents a module in a course or curriculum. It displays the module name
 * and allows users to expand it to view the associated days. Each day is rendered using the
 * DayComponent.
 * 
 * Props:
 * - module: Object containing information about the module (e.g., id, name, days).
 * - onDaySelect: Callback function triggered when a day is selected.
 * - onMaterialSelect: Callback function triggered when a material is selected.
 * - onAssignmentSelect: Callback function triggered when an assignment is selected.
 */
const ModuleComponent = ( { module, onDaySelect, onMaterialSelect, onAssignmentSelect } ) => {   
 
    // State to track whether the module is expanded or not
    const [isExpanded, setIsExpanded] = useState(false); 

    /**
     * toggleExpand
     * Toggles the expanded state of the module to show or hide its days.
     */
    const toggleExpand = () => { 
        setIsExpanded(!isExpanded);
    };

    return ( 
        <> 


        {/* Everything this module will be wrapped in */}
        <div >
            {/* Header section for the module */}
            <div  
                className={`p-2 rounded-md cursor-pointer flex flex-row items-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:font-bold
                    ${ isExpanded ? "bg-pink-400 border-pink-500 scale-105 font-bold" : "bg-blue-400 bg-opacity-30 hover:bg-pink-400 hover:border-pink-500"
                }`}
                onClick={toggleExpand} // Toggle expand/collapse on click
            >  
                {/* Icon for the module */} 
                <div className="pr-2 text-lg text-blue-500"> 
                    <FaBookOpen /> 
                </div> 

                {/* Title Text for the module */}
                <div className="font-nunito font-bold text-[1.1rem] m-0 text-[#2c3e50]"> 
                    {module.name}    
                </div> 
            </div>  

            {/* Content section for the module, displayed only when expanded */}
            {isExpanded && module.days && ( 
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>   
                    <ul className="">        
                        {/* Map through the days in the module and render DayComponent for each day in the module*/}      
                        {Array.isArray(module.days) && module.days.map((day, index) => (   

                            // Might need to put this in the DayComponent
                            <li 

                             style={{ animationDelay: `${index * 100}ms`}}
                            > 
                                <DayComponent  
                                    key={day.id} 
                                    day={day} 
                                    onDaySelect={() => onDaySelect(module.id, day.id)} 
                                    onMaterialSelect={onMaterialSelect}  
                                    onAssignmentSelect={onAssignmentSelect}
                                /> 

                            </li>
                        ))} 
                    </ul>
                </div>
            )}
        </div> 

        
        </>
    );
}; 

export default ModuleComponent;