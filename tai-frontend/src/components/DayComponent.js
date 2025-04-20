import React, {useState} from "react";  
import { getRequest } from "../API";

const DayComponent = ( {day, onDaySelect, onMaterialSelect }  ) => { 

    const [isExpanded, setIsExpanded] = useState(false);  
    const [materials, setMaterials] = useState([]); 
    const [loading, setLoading] = useState(false);

    const toggleExpand = async () =>  { 
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState); 


        if (newExpandedState && materials.length === 0 && !loading) {  
            setLoading(true); 

            try {  
                const url = `/day/${day.id}/materials`; 
                const response = await getRequest(url); 
                console.log("This is the materials we have received from our day component: ", response.data.materials); 
                setMaterials(response.data.materials); 
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

        </div>
        </>


    );


}; 

export default DayComponent;