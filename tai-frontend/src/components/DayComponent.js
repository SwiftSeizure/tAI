import React, {useState} from "react";  
import { getRequest } from "../API"; 
import { FaChevronDown, FaChevronUp, FaFile, FaClipboard } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";

/**
 * DayComponent
 * This component represents a single day in a schedule or calendar.
 * It allows users to expand the day to view associated materials and assignments.
 * Props:
 * - day: Object containing information about the day (id, name, materials, assignments).
 * - onDaySelect: Callback function triggered when a day is selected (used in ModuleComponent).
 * - onMaterialSelect: Callback function triggered when a material is selected.
 * - onAssignmentSelect: Callback function triggered when an assignment is selected.
 */ 

const DayComponent = ( {day, onDaySelect, onMaterialSelect, onAssignmentSelect}  ) => { 

    // State to track whether the day is expanded or not
    const [isExpanded, setIsExpanded] = useState(false);   

    // State to store materials and assignments for the day
    const [materials, setMaterials] = useState([]);   

    // State to store assignments for the day
    const [assignments, setAssignments] = useState([]) 

    // State to store loading state
    const [loading, setLoading] = useState(false);


    /**
     * toggleExpand
     * Toggles the expanded state of the day. If expanding for the first time,
     * it fetches materials and assignments for the day from the API.
     */
    const toggleExpand = async () =>  { 
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState); 

        // Fetch materials and assignments only if expanding for the first time
        if (newExpandedState && materials.length === 0 && !loading) {  
            setLoading(true); 

            try {   
                // Fetch Materials
                const urlMaterial = `/day/${day.id}/materials`; 
                const responseMaterial = await getRequest(urlMaterial); 
                setMaterials(responseMaterial.data.materials);  

                // Fetch Assignments 
                const urlAssignment = `/day/${day.id}/assignments`; 
                const responseAssignment = await getRequest(urlAssignment);  
                setAssignments(responseAssignment.data.assignments);
            }  

            // Handle errors during API requests
            catch (error) { 
                console.log(error);
            }  

            // Reset loading state
            finally { 
                setLoading(false);
            }
        }  


    };


    return (
        <li className={`day-item ${isExpanded ? 'day-expanded' : ''}`}> 
            {/* Header section for the day */}
            <div 
                className="day-header"
                onClick={toggleExpand} // Expand/collapse on click
            >
                <h4 className="day-title">
                    {day.name} 
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </h4>
            </div>

            {/* Content section for the day */}
            {isExpanded && (
                <div className="day-content"> 

                    {/* Display loading spinner while fetching data */}
                    {loading ? (
                        <div className="day-loading">
                            <div className="day-loading-spinner"></div>
                            <span>Loading resources...</span>
                        </div>
                    ) : (
                        <> 
                        {/* Display materials if available */}
                        {materials && materials.length > 0 && (
                            <div className="resources-section">
                                <h5 className="resources-title">Materials</h5>
                                <ul className="material-list"> 
                                    { /* Map through materials and display them */}
                                    {materials.map(material => (
                                        <li
                                            key={material.id}
                                            className="material-item"
                                            onClick={() => onMaterialSelect(day.id, material.id, material.filename, material.name)}
                                        >
                                            <FaFile className="material-icon" />
                                            <span className="material-name">{material.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )} 
                        {/* Display assignments if available */}
                        {assignments && assignments.length > 0 && (
                            <div className="resources-section">
                                <h5 className="resources-title">Assignments</h5>
                                <ul className="assignment-list"> 
                                    { /* Map through assignments and display them */}
                                    {assignments.map(assignment => (
                                        <li
                                            key={assignment.id}
                                            className="assignment-item"
                                            onClick={() => onAssignmentSelect(day.id, assignment.id, assignment.filename, assignment.name)}
                                        >   
                                            <MdAssignment className="assignment-icon" />
                                            <span className="assignment-name">{assignment.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )} 
                        {/* Display message if no resources are available */}
                        {(!materials || materials.length === 0) && (!assignments || assignments.length === 0) && (
                            <p className="no-resources-message">No resources available for this day.</p>
                        )}
                        </>
                    )}
                </div>
            )}
        </li>
      );
    };

export default DayComponent;