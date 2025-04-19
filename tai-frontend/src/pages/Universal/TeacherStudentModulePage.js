import React, { useEffect, useState } from "react";  
import { useLocation } from "react-router-dom";
import TitleCard from "../../components/TitleCard";  
import { getRequest } from "../../API"; 

import axios from "axios";
import ChatFeature from "../../components/ChatFeature";
import ModuleComponent from "../../components/ModuleComponent";

const TeacherStudentModulePage = () => {     

    const [loading, setLoading] = useState(true); 
    const [data, setData] = useState(null);  

    const [isExpanded, setIsExpanded] = useState(false);

    const location = useLocation(); 
    const {unitID, unitName, userID, role} = location.state || {}; 


    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };


    useEffect(() => { 

        const loadModules = async () => {  

            try {   
                const url = `/unit/${unitID}/modules`; 
                const response = await getRequest(url);  
                console.log(response.data);
                setData(response.data.modules);

            } 
            catch(error) {
              console.log(error)

            } 
            finally { 
                setLoading(false); 
                populateModuleCards();
            }

        }; 
        
        loadModules();

    }, [userID, role]);

    //TODO: make a new component for each module with the dropdown so that they can be opened and added 

    // TODO: map all of the components as a list item 

    const populateModuleCards = () => {   


        console.log("This is the module cards response data: ", data);

        return( 
            <>  
                {Array.isArray(data) && data.map(module => ( 
                    <ModuleComponent 
                        key={module.id} 
                        module={module}
                    />
                ) ) }
            </>
        )

    }; 




    return(  
        <>     
        <TitleCard 
            title={unitName}
        />
        <div>  

            <div> 
                This is the module page hopefully this is there the modules will go  
                {populateModuleCards()} 
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