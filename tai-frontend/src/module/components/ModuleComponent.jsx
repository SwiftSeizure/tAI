import React, { useState } from "react";  
import DayComponent from "./DayComponent";
import { FaBookOpen } from "react-icons/fa"; 
import { useCurrentUser } from "../../store/user-store";  
import DeleteIcon from '@mui/icons-material/Delete';



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
        <div className="mb-3"> 

            {/* Header section for the module */}
            <div  
                className={`p-3 rounded-lg cursor-pointer flex flex-row items-center justify-between transition-colors duration-200 border
                    ${isExpanded 
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                        : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                onClick={toggleExpand} // Toggle expand/collapse on click
            >  
                <div className="flex items-center">
                    {/* Icon for the module */} 
                    <div className={`pr-3 text-lg transition-colors duration-200 ${isExpanded ? 'text-white' : 'text-blue-600'}`}> 
                        <FaBookOpen /> 
                    </div> 

                    {/* Title Text for the module */}
                    <div className={`font-medium text-sm transition-colors duration-200 ${isExpanded ? 'text-white' : 'text-gray-900'}`}> 
                        {module.name}    
                    </div>  
                </div>

                {user.role === "teacher" && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent toggling expand when clicking delete
                            handleOnClickDeleteModule();
                        }}
                        className={`p-1.5 rounded-md transition-colors duration-200 ml-2 ${
                            isExpanded 
                                ? "text-white/90 hover:bg-white/20" 
                                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="Delete Module"
                    >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                    </button>
                )}
            </div>   
            

            {/* Content section for the module, displayed only when expanded */}
            {isExpanded && module.days && ( 
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}>   
                    <ul className="mt-2 space-y-1.5 pl-2">        
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
                            <div className="mt-2">
                                <button 
                                    onClick={() => onAddDay(module.id)}
                                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
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