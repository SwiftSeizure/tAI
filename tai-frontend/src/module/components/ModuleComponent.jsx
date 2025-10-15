import React, { useState } from "react";  
import DayComponent from "./DayComponent";
import { FaBookOpen } from "react-icons/fa"; 
import { useCurrentUser } from "../../store/user-store"; 


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
const ModuleComponent = ( { 
    module, 
    onDaySelect, 
    onMaterialSelect, 
    onAssignmentSelect, 
    onAddDay, 
    onAddMaterial, 
    onAddAssignment, 
    onClickDeleteModule,
    onClickDeleteDay, 
    onClickDeleteMaterial, 
    onClickDeleteAssignment,
    refreshKey = 0,  // Add refreshKey prop to trigger refresh
    selectedContent = null  // Add selectedContent prop
} ) => {   
 
    // State to track whether the module is expanded or not
    const [isExpanded, setIsExpanded] = useState(false);   

    const { user } = useCurrentUser(); 

    const handleDaySelect = (day) => {
        onDaySelect(day);
    };
    

    /**
     * toggleExpand
     * Toggles the expanded state of the module to show or hide its days.
     */
    const toggleExpand = () => { 
        setIsExpanded(!isExpanded);
    }; 

    const handleOnClickDeleteModule = () => { 
        onClickDeleteModule(module);
    };

    const handleOnClickDeleteDay = (day) => { 
        onClickDeleteDay(day);
    }; 

    const handleOnClickDeleteMaterial = (material) => { 
        onClickDeleteMaterial(material);
    }; 

    const handleOnClickDeleteAssignment = (assignment) => { 
        onClickDeleteAssignment(assignment);
    }; 

    return ( 
        <> 

        {/* Everything this module will be wrapped in */}
        <div > 

            {user.role === "teacher" && (
                <div className="mb-3">
                    <button 
                        onClick={handleOnClickDeleteModule}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                    >
                        Delete Module
                    </button>
                </div>
            )} 


            {/* Header section for the module */}
            <div  
                className={`p-4 rounded-2xl cursor-pointer flex flex-row items-center transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-sm border
                    ${ isExpanded ? "bg-gradient-to-r from-green-500/60 to-emerald-500/60 border-green-400 scale-[1.02] font-bold text-white shadow-lg" : "bg-white border-gray-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 hover:shadow-md"
                }`}
                onClick={toggleExpand} // Toggle expand/collapse on click
            >  
                {/* Icon for the module */} 
                <div className={`pr-3 text-xl transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-green-600'}`}> 
                    <FaBookOpen /> 
                </div> 

                {/* Title Text for the module */}
                <div className={`font-nunito font-bold text-lg m-0 transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-gray-700'}`}> 
                    {module.name}    
                </div> 
            </div>  

            {/* Content section for the module, displayed only when expanded */}
            {isExpanded && module.days && ( 
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>   
                    <ul className="">        
                        {/* Map through the days in the module and render DayComponent for each day in the module*/}      
                        {Array.isArray(module.days) && [...module.days].map((day, index) => (   
                            <li 
                                key={day.id}
                                style={{ animationDelay: `${index * 100}ms`}}
                            > 
                                <DayComponent  
                                    day={day} 
                                    onDaySelect={handleDaySelect} 
                                    onMaterialSelect={onMaterialSelect}  
                                    onAssignmentSelect={onAssignmentSelect}
                                    handleAddMaterial={onAddMaterial}
                                    handleAddAssignment={onAddAssignment}
                                    handleOnClickDeleteDay={handleOnClickDeleteDay} 
                                    handleOnClickDeleteMaterial={handleOnClickDeleteMaterial} 
                                    handleOnClickDeleteAssignment={handleOnClickDeleteAssignment}
                                    refreshKey={refreshKey}
                                    selectedContent={selectedContent}
                                /> 
                            </li> 
                        ))}  
                        {user.role === "teacher" && (
                            <div className="mt-3">
                                <button 
                                    onClick={() => onAddDay(module.id)}
                                    className="px-4 py-2 text-sm font-semibold text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-xl hover:from-green-200 hover:to-emerald-200 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    + Add Day
                                </button>
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </div> 

        
        </>
    );
}; 

export default ModuleComponent;