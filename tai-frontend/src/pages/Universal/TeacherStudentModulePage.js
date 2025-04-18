import React, { useEffect, useState } from "react";  
import { useLocation } from "react-router-dom";
import TitleCard from "../../components/TitleCard";  
import { getRequest } from "../../API"; 

import axios from "axios";
import ChatFeature from "../../components/ChatFeature";

const TeacherStudentModulePage = () => {     

    const [loading, setLoading] = useState(true); 
    const [data, setData] = useState(null);  

    const [isExpanded, setIsExpanded] = useState(false);

    const location = useLocation(); 
    const {unitID, unitName, userID, role} = location.state || {}; 


    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };


    //TODO: make a get request to get all the modules of the unit  

    useEffect(() => { 

        const loadModules = async () => {  

            try {   
                const url = `/modulepage/${unitID}/${userID}`; 
                const response = await getRequest();  
                // TODO Change this response based on getting the stuff back 
                setData(response);

            } 
            catch(error) {
              console.log(error)

            } 
            finally { 
                setLoading(false);
            }

        } 


    });

    //TODO: make a new component for each module with the dropdown so that they can be opened and added 

    // TODO: map all of the components as a list item 



    return(  
        <>     
        <TitleCard 
            title={unitName}
        />
        <div>  

            <div> 
                This is the module page hopefully this is there the modules will go 
            </div>  
            
            <div> 
                This is where display will go 
            </div> 
            <div className="expanding-chat-div">   


                <button onClick={toggleExpand} >   
                    Chat feature
                </button>  
                {isExpanded && <div> <ChatFeature /> </div>}

            </div>

        </div>
        
        </>
    )

}; 

export default TeacherStudentModulePage;