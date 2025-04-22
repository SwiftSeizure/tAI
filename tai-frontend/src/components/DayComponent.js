import React, {useState} from "react";  
import { getRequest } from "../API"; 
import { FaChevronDown, FaChevronUp, FaFile, FaClipboard } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";

const DayComponent = ( {day, onDaySelect, onMaterialSelect, onAssignmentSelect}  ) => { 

    const [isExpanded, setIsExpanded] = useState(false);  
    const [materials, setMaterials] = useState([]);  
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(false);

    const toggleExpand = async () =>  { 
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState); 

        
        if (newExpandedState && materials.length === 0 && !loading) {  
            setLoading(true); 

            try {   
                // Materials
                const urlMaterial = `/day/${day.id}/materials`; 
                const responseMaterial = await getRequest(urlMaterial); 
                console.log("This is the materials we have received from our day component: ", responseMaterial.data.materials); 
                setMaterials(responseMaterial.data.materials);  

                // Assignments 
                const urlAssignment = `/day/${day.id}/assignments`; 
                const responseAssignment = await getRequest(urlAssignment);  
                console.log("This is the assignment we have received from our day component: ", responseAssignment.data.assignments);
                setAssignments(responseAssignment.data.assignments);
            } 
            catch (error) { 
                console.log(error);
            } 
            finally { 
                setLoading(false);
            }
        }  


    };


    return (
        <li className={`day-item ${isExpanded ? 'day-expanded' : ''}`}>
            <div 
                className="day-header"
                onClick={toggleExpand}
            >
                <h4 className="day-title">
                    {day.name} 
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </h4>
            </div>

            {isExpanded && (
                <div className="day-content">
                    {loading ? (
                        <div className="day-loading">
                            <div className="day-loading-spinner"></div>
                            <span>Loading resources...</span>
                        </div>
                    ) : (
                        <>
                            {materials && materials.length > 0 && (
                                <div className="resources-section">
                                    <h5 className="resources-title">Materials</h5>
                                    <ul className="material-list">
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

                            {assignments && assignments.length > 0 && (
                                <div className="resources-section">
                                    <h5 className="resources-title">Assignments</h5>
                                    <ul className="assignment-list">
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