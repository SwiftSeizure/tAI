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
    const [isChatExpanded, setIsChatExpanded] = useState(false); 

    const [displayType, setDisplayType] = useState('welcome'); 
    const [selectedModule, setSelectedModule] = useState(null); 
    const [selectedDay, setSelectedDay] = useState(null); 
    const [dayContent, setDayContent] = useState(null);

    const location = useLocation(); 
    const {unitID, unitName, userID, role} = location.state || {}; 


    const toggleChatExpand = () => {
        setIsChatExpanded(!isChatExpanded); 
        if (!isChatExpanded) { 
            setDisplayType('chat')
        } 
        else { 
            setDisplayType('welcome');
        }
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
                // populateModuleCards();
            }
        }; 
        
        loadModules();

    }, [userID, role]); 


    const handleDaySelect = async ( moduleID, dayID ) => {  
        setSelectedModule(moduleID); 
        setSelectedDay(dayID);
        setDisplayType('day'); 

        try {  
            // TODO: 
            // Make request here to get all of the content for the day  
            // setDayContent("This is example content of where the actual content will go ")
        } 
        catch (error) { 
            console.log(error);  
             
        }
 
    };  


    const renderModules = () => { 
        if (!Array.isArray(data)) { 
            return null;
        } 
        else { 
            return( 
                <> 
                {data.map (module => ( 
                    <ModuleComponent 
                        key={module.id} 
                        module={module} 
                        onDaySelect={handleDaySelect} 
                    />
                ))} 
                </>
            )
        }
    }; 

    const renderContent = () => { 
        switch(displayType) { 
            case 'welcome': 
                return(  
                    <div> 
                        <h1> select something </h1>
                    </div>
                    
                );  
            case 'day': 
                return( 
                    <div> 
                        {dayContent ? ( 
                            <> 
                            <div> 
                                this is where the content will go for the day something like whats bellow in the code 
                                {/* {dayContent.content}    */}
                            </div> 
                            </>
                        ) : ( 
                            <h3> Stuff is loading </h3>
                        )}
                    </div>
                ); 
            case 'chat':  

                // Could maybe make an API call here for chat context??
                return(  
                    <div> 
                        <ChatFeature />
                    </div>
                    
                ); 
            default: 
                return( 
                    <div> 
                        Nothing is selected
                    </div>
                )
        }
    };


    return(  
        <>     
        <TitleCard 
            title={unitName}
        /> 

        <div >  

            <div> 
                {renderModules()} 
            </div>  
            
            <div> 
                {renderContent()}
            </div>  

        </div> 

        <button 
            onClick={toggleChatExpand} 
        > 
            {isChatExpanded ? "Close Chat" : "Open Chat"}
        </button>
        
        </>
    )

}; 

export default TeacherStudentModulePage;