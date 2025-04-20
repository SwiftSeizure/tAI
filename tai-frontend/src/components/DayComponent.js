import React, {useState} from "react";  
import { getRequest } from "../API";

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


    }


    return( 
        <>  
        <div className="individual-day-componet-div"> 
   
            <div 
                onClick={toggleExpand}
            >  
                <h4 className="day-title-text"> 
                    {day.name}
                    <span>{isExpanded ? "▲" : "▼"}</span> 
                </h4>
            </div>  

            {isExpanded && ( 
                <div className="individual-material-div"> 
                    { Array.isArray(materials) && materials.map(material => ( 
                        <div 
                            key={material.id}
                            className="material-item"
                            onClick={() => onMaterialSelect(day.id, material.id, material.filename)} 
                        > 
                           <h4> {material.name} </h4> 
                        </div>
                    )) }
                </div>
            )}  

            {isExpanded && ( 
                <div className="individual-assignment-div"> 
                    { Array.isArray(assignments) && assignments.map(assignment => ( 
                        <div 
                            key={assignment.id} 
                            className="assignment-item"
                            onClick={() => onAssignmentSelect(day.id, assignment.id, assignment.filename)} 
                        > 
                            <h4> {assignment.name} </h4>
                        </div>
                    ))}
                </div>
            )}

        </div>
        </>


    );


}; 

export default DayComponent;