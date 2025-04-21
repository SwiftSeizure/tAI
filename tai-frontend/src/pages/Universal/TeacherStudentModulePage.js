import React, { useEffect, useState } from "react";  
import { useLocation } from "react-router-dom";
import TitleCard from "../../components/TitleCard";  
import { getRequest } from "../../API"; 
import axios from "axios";
import ChatFeature from "../../components/ChatFeature";
import ModuleComponent from "../../components/ModuleComponent"; 
import List from '@mui/material/List'; 
import buttons from "../../CSS/Buttons.css" 
import { Document, Page } from 'react-pdf'; 

const TeacherStudentModulePage = () => {     

    const [loading, setLoading] = useState(true); 
    const [modulesData, setModulesData] = useState(null);   

    const [isChatExpanded, setIsChatExpanded] = useState(false); 

    const [displayType, setDisplayType] = useState('welcome'); 
    const [selectedModule, setSelectedModule] = useState(null); 
    const [selectedDay, setSelectedDay] = useState(null);  
    const [selectedMaterial, setSelectedMaterial] = useState(null);  
    const [selectedAssignment, setSelectedAssignment] = useState(null);


    const [dayMaterails, setDayMaterials] = useState(null); 
    const [materialContent, setMaterialContent] = useState(null); 
    const [assignmentContent, setAssignmentContent] = useState(null); 

    const [currentContent, setCurrentContent] = useState(null);

    const location = useLocation(); 
    const {unitID, unitName, userID, role} = location.state || {};  

    const chatImage = require("../../images/chat-message-dots.png");


    const toggleChatExpand = () => {
        setIsChatExpanded(!isChatExpanded);  

        if (!isChatExpanded && role === "student") { 
            setDisplayType('chat') 
        } 
        else if (!isChatExpanded && role === "teacher") { 
            setDisplayType('chat-settings'); 
        }  

        if (isChatExpanded) { 
            setDisplayType(currentContent);
        }

        
    };


    useEffect(() => { 

        const loadModules = async () => {  

            try {   
                const url = `/unit/${unitID}/modules`; 
                const response = await getRequest(url);  
                console.log(response.data);
                setModulesData(response.data.modules);

            } 
            catch(error) {
              console.log(error)

            } 
            finally { 
                setLoading(false); 
            }
        }; 
        
        loadModules();

    }, [userID, role]); 


    const handleDaySelect = async ( moduleID, dayID ) => {  
        setSelectedModule(moduleID); 
        setSelectedDay(dayID);
        setDisplayType('day'); 

        try {  
            const url = `/module/${moduleID}/days` 
            const response = await getRequest(url); 
            console.log("This is the response from /days module call", response.data.materials);
            setDayMaterials(response.data.materials); 
            
        } 
        catch (error) { 
            console.log(error);  
             
        }
 
    };    



    const handleAssignmentSelect = async (dayID, assignmentID, fileName) => { 

        setSelectedAssignment(assignmentID);  
        setDisplayType('assignment'); 

        try { 
            const url = `/assignment/${dayID}/${fileName}`; 
            const response = await getRequest(url); 
            console.log("This is what we got back from the /assignments file call: ", response.data); 
            setAssignmentContent(response.data); 
            setCurrentContent('assignment');
        } 
        catch (error) { 
            console.log(error)
        }


    }

    const handleMaterialSelect = async ( dayID, materialID, fileName ) => { 


        setSelectedMaterial(materialID); 
        setDisplayType('material'); 

        try { 
            const url = `/material/${dayID}/${fileName}`;
            const response = await getRequest(url); 
            console.log("This is what we got back from /materials file call: ", response.data); 
            setMaterialContent(response.data); 
            setCurrentContent('material');
        } 
        catch (error) { 
            console.log(error);
        }

    }


    const renderModules = () => { 
        if (!Array.isArray(modulesData)) { 
            return null;
        } 
        else {  

            return( 
                <> 
                {modulesData.map (module => ( 
                    <ModuleComponent 
                        key={module.id} 
                        module={module} 
                        onDaySelect={handleDaySelect}  
                        onMaterialSelect={handleMaterialSelect} 
                        onAssignmentSelect={handleAssignmentSelect}
                    />
                ))}  
                </>
            )
        }
    };   


    useEffect(() => { 
        if (displayType !== 'chat' && displayType !== 'chat-settings') { 
            setIsChatExpanded(false);  
            
        } 

    }, [displayType]);


    const renderContent = () => { 
        switch(displayType) { 
            case 'welcome': 
                return(  
                    <div> 
                        <h1> select something </h1>
                    </div>
                    
                );  
            case 'material': 
                return( 
                    <div>      
                        <h1>  
                            {materialContent}
                        </h1>
                    </div>
                );   
            case 'assignment': 
                return( 
                    <div> 
                        <h1> 
                            {assignmentContent}
                        </h1>
                    </div>
                );
            case 'chat':  

                // Could maybe make an API call here for chat context?? 
                // then be able to pass it down into the chat component

                return(  
                    <div> 
                        <ChatFeature />
                    </div>
                    
                );   

            case 'chat-settings': 

                return( 
                    <div>  
                        <h1> Teacher Chat Settings Coming Soon </h1>
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

        <div className="modulepage-layout-grid">  

            <div> 
                {renderModules()} 
            </div>  
            
            <div> 
                {renderContent()}
            </div>  

        

        {role === 'student' ? 
                <button 
                    className="custom-button-chat"  
                    onClick={toggleChatExpand}  

                > 
                   { isChatExpanded ? "Close Chat" : "Open Chat" }
                   <img 
                    className="custom-button-chat-image"  
                    src={chatImage}
                    /> 
               </button>  
               : 
               <button 
                    className="custom-button-chat"  
                    onClick={toggleChatExpand}  

                > 
                    {isChatExpanded ? "Save" : "Edit Chat Settings"} 

                </button> 
        } 

        </div> 
        
        </>
    )

}; 

export default TeacherStudentModulePage;